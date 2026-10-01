import React, { use, useEffect, useRef, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const ProductDetails = () => {
    const loadedProduct = useLoaderData();
    const { user } = use(AuthContext);
    const navigate = useNavigate();

    const [product, setProduct] = useState(loadedProduct);
    const [bids, setBids] = useState([]);
    const [biddingLoading, setBiddingLoading] = useState(false);
    const bidModalRef = useRef(null);

    const {
        _id: productId,
        title,
        price_min,
        price_max,
        image,
        description,
        condition,
        usage_time,
        category,
        tags,
        seller_name,
        seller_email,
        email,
        seller_image,
        seller_location,
        seller_contact,
        status: currentStatus,
        created_at,
    } = product;

    const actualSellerEmail = seller_email || email;
    const isOwner = user && user.email === actualSellerEmail;
    const isSold = currentStatus === 'sold';

    // Fetch bids for this product
    useEffect(() => {
        if (!productId) return;
        fetch(`${import.meta.env.VITE_API_URL}/bids/byProduct/${productId}`)
            .then(res => res.json())
            .then(data => setBids(Array.isArray(data) ? data : []))
            .catch(err => console.error('Failed to load bids:', err));
    }, [productId]);

    // Open Modal with Validation
    const handleBidModalOpen = () => {
        if (!user) {
            Swal.fire({
                title: 'Login Required',
                text: 'You must be logged in to place a bid on this product.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#632EE3',
                confirmButtonText: 'Login Now',
                cancelButtonColor: '#6b7280',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        if (isSold) {
            Swal.fire({
                icon: 'warning',
                title: 'Product Sold Out',
                text: 'This product has already been sold. Bidding is closed.',
            });
            return;
        }

        if (isOwner) {
            Swal.fire({
                icon: 'warning',
                title: 'Action Not Allowed',
                text: 'You are the seller of this product and cannot bid on it.',
            });
            return;
        }

        if (bidModalRef.current) {
            bidModalRef.current.showModal();
        }
    };

    // Submit Bid
    const handleBidSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        const form = e.target;
        const buyer_name = form.name.value.trim() || user?.displayName || 'Anonymous';
        const buyer_email = form.email.value.trim() || user?.email;
        const buyer_image = form.image.value.trim() || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(buyer_name)}&background=632EE3&color=fff`;
        const bid_price = parseFloat(form.bid.value);
        const contact = form.contact.value.trim();

        if (isNaN(bid_price) || bid_price <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Bid',
                text: 'Please enter a valid bid amount.',
            });
            return;
        }

        if (bid_price < price_min) {
            Swal.fire({
                icon: 'warning',
                title: 'Bid Too Low',
                text: `Minimum price to offer is $${price_min}.`,
            });
            return;
        }

        const newBid = {
            productId,
            buyer_name,
            buyer_email,
            buyer_image,
            bid_price,
            contact,
            status: 'pending',
            created_at: new Date().toISOString(),
        };

        setBiddingLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/bids`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBid),
            });

            const data = await res.json();

            if (res.ok && data.insertedId) {
                if (bidModalRef.current) {
                    bidModalRef.current.close();
                }
                form.reset();

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Your bid has been placed!',
                    showConfirmButton: false,
                    timer: 1500,
                });

                newBid._id = data.insertedId;
                const updatedBids = [...bids, newBid].sort((a, b) => b.bid_price - a.bid_price);
                setBids(updatedBids);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Could Not Place Bid',
                    text: data.message || 'Something went wrong.',
                });
            }
        } catch (error) {
            console.error('Bid error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Failed to connect to the server.',
            });
        } finally {
            setBiddingLoading(false);
        }
    };

    // Accept Offer
    const handleAcceptBid = async (bidId, buyerName) => {
        const confirm = await Swal.fire({
            title: 'Accept this offer?',
            text: `Accepting this will mark the product as Sold and accept the bid from ${buyerName}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Accept Offer!',
        });

        if (confirm.isConfirmed) {
            try {
                // Update Bid Status
                await fetch(`${import.meta.env.VITE_API_URL}/bids/${bidId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'accepted' }),
                });

                // Update Product Status to Sold
                await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'sold' }),
                });

                setBids(prev => prev.map(b => (b._id === bidId ? { ...b, status: 'accepted' } : b)));
                setProduct(prev => ({ ...prev, status: 'sold' }));

                Swal.fire({
                    icon: 'success',
                    title: 'Offer Accepted!',
                    text: 'This product has been marked as Sold.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            } catch (err) {
                console.error('Accept error:', err);
                Swal.fire('Error', 'Failed to accept offer.', 'error');
            }
        }
    };

    // Reject Offer
    const handleRejectBid = async (bidId) => {
        const confirm = await Swal.fire({
            title: 'Reject this offer?',
            text: 'This offer will be marked as rejected.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Reject',
        });

        if (confirm.isConfirmed) {
            try {
                await fetch(`${import.meta.env.VITE_API_URL}/bids/${bidId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'rejected' }),
                });

                setBids(prev => prev.map(b => (b._id === bidId ? { ...b, status: 'rejected' } : b)));

                Swal.fire({
                    icon: 'success',
                    title: 'Offer Rejected',
                    timer: 1500,
                    showConfirmButton: false,
                });
            } catch (err) {
                console.error('Reject error:', err);
                Swal.fire('Error', 'Failed to reject offer.', 'error');
            }
        }
    };

    const postedDate = created_at
        ? new Date(created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        : 'N/A';

    return (
        <div className="py-6 max-w-7xl mx-auto px-4">
            {/* Back link */}
            <div className="mb-6">
                <Link
                    to="/allProducts"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                    <span className="text-base">←</span> Back To Products
                </Link>
            </div>

            {/* Title & Price Header */}
            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{title}</h1>
                {tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag, i) => (
                            <span key={i} className="badge badge-soft badge-primary text-xs font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <div className="mt-3">
                    <p className="text-2xl font-bold text-primary">
                        ${price_min} {price_max ? `- ${price_max}` : ''}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Price starts from</p>
                </div>
            </div>

            {/* Product Details Info Box */}
            <div className="border border-gray-100 rounded-2xl p-5 mb-8 bg-white shadow-2xs">
                <h3 className="font-bold text-base text-gray-800 mb-2">Product Details</h3>
                <div className="text-sm text-gray-500 space-y-1">
                    <p><span className="font-medium text-gray-700">Product ID:</span> {productId}</p>
                    <p><span className="font-medium text-gray-700">Posted:</span> {postedDate}</p>
                    {category && <p><span className="font-medium text-gray-700">Category:</span> {category}</p>}
                </div>
            </div>

            {/* Main 2-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* LEFT: Image + Description */}
                <div className="space-y-5">
                    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center min-h-72">
                        <img
                            src={image}
                            alt={title}
                            className="w-full object-cover max-h-96"
                            onError={e => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
                        />
                    </div>

                    <div className="bg-white border border-gray-100 shadow-2xs rounded-2xl p-6">
                        <h3 className="font-bold text-base text-gray-800 mb-3">Product Description</h3>
                        <div className="flex gap-6 mb-3 text-sm">
                            {condition && (
                                <span>
                                    <span className="text-gray-500">Condition : </span>
                                    <span className="font-medium text-gray-800">{condition}</span>
                                </span>
                            )}
                            {usage_time && (
                                <span>
                                    <span className="text-gray-500">Usage Time : </span>
                                    <span className="font-medium text-gray-800">{usage_time}</span>
                                </span>
                            )}
                        </div>
                        <div className="divider my-2"></div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {description || 'No description provided.'}
                        </p>
                    </div>
                </div>

                {/* RIGHT: Seller Info + Buy Button */}
                <div className="space-y-5">
                    <div className="bg-white border border-gray-100 shadow-2xs rounded-2xl p-6">
                        <h3 className="font-bold text-base text-gray-800 mb-4">Seller Information</h3>

                        {/* Seller avatar + name */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="avatar">
                                <div className="w-12 h-12 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                                    <img
                                        src={seller_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller_name || 'Seller')}&background=632EE3&color=fff`}
                                        alt={seller_name}
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-gray-800">{seller_name || 'Unknown Seller'}</p>
                                <p className="text-xs text-gray-500">{actualSellerEmail}</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            {seller_location && (
                                <div className="flex items-center gap-2.5 text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Location: {seller_location}</span>
                                </div>
                            )}
                            {seller_contact && (
                                <div className="flex items-center gap-2.5 text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>Contact: {seller_contact}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Status:</span>
                                <span className={`badge badge-sm font-semibold text-white ${isSold ? 'bg-red-500' : 'bg-emerald-500'}`}>
                                    {isSold ? 'Sold' : 'On Sale'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Bidding / Purchase Button */}
                    {isSold ? (
                        <button
                            disabled
                            className="btn bg-gray-200 text-gray-400 border-none w-full text-sm font-semibold rounded-xl cursor-not-allowed"
                        >
                            Product Sold Out
                        </button>
                    ) : !user ? (
                        <button
                            onClick={handleBidModalOpen}
                            className="btn btn-primary w-full text-sm font-semibold rounded-xl shadow-sm"
                        >
                            Login To Place Bid
                        </button>
                    ) : isOwner ? (
                        <button
                            disabled
                            className="btn bg-purple-100 text-purple-700 border-none w-full text-sm font-semibold rounded-xl cursor-not-allowed"
                        >
                            You are the Seller of this Product
                        </button>
                    ) : (
                        <button
                            onClick={handleBidModalOpen}
                            className="btn btn-primary w-full text-sm font-semibold rounded-xl shadow-sm hover:shadow"
                        >
                            I Want Buy This Product
                        </button>
                    )}
                </div>
            </div>

            {/* ======== BIDS SECTION (Only Visible to Owner) ======== */}
            <div className="mb-12">
                <p className="text-3xl font-extralight text-gray-200 select-none">Only Visible to Owner</p>
                <h3 className="text-2xl font-bold -mt-1 mb-5">
                    Bids For This Products:{' '}
                    <span className="text-primary">{String(bids.length).padStart(2, '0')}</span>
                </h3>

                <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <table className="table">
                        <thead className="bg-gray-50/80 text-gray-600 text-xs font-semibold">
                            <tr>
                                <th className="py-3 px-4">SL No</th>
                                <th className="py-3 px-4">Product</th>
                                <th className="py-3 px-4">Buyer Info</th>
                                <th className="py-3 px-4">Bid Price</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {bids.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-400">
                                        No bids placed yet.
                                    </td>
                                </tr>
                            ) : (
                                bids.map((bid, index) => (
                                    <tr key={bid._id || index} className="hover:bg-gray-50/50">
                                        <th className="py-3 px-4 text-gray-500 font-medium">{index + 1}</th>

                                        {/* Product column */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                    <img
                                                        src={image}
                                                        alt={title}
                                                        className="w-full h-full object-cover"
                                                        onError={e => { e.target.src = 'https://placehold.co/40?text=P'; }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800 text-xs sm:text-sm line-clamp-1">{title}</div>
                                                    <div className="text-xs text-gray-400">${price_min}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Buyer column */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                                                    <img
                                                        src={bid.buyer_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(bid.buyer_name || 'B')}&background=9F62F2&color=fff`}
                                                        alt={bid.buyer_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-xs sm:text-sm text-gray-800">{bid.buyer_name}</div>
                                                    <div className="text-xs text-gray-400">{bid.buyer_email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Bid Price */}
                                        <td className="py-3 px-4 font-bold text-gray-900">${bid.bid_price}</td>

                                        {/* Status */}
                                        <td className="py-3 px-4">
                                            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block ${
                                                bid.status === 'accepted'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : bid.status === 'rejected'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {bid.status ? bid.status.charAt(0).toUpperCase() + bid.status.slice(1) : 'Pending'}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3 px-4">
                                            {isOwner ? (
                                                bid.status === 'accepted' ? (
                                                    <span className="text-xs font-semibold text-emerald-600 block text-center">Accepted Offer</span>
                                                ) : bid.status === 'rejected' ? (
                                                    <span className="text-xs font-semibold text-red-500 block text-center">Rejected</span>
                                                ) : isSold ? (
                                                    <span className="text-xs text-gray-400 block text-center">Product Sold</span>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleAcceptBid(bid._id, bid.buyer_name)}
                                                            className="btn btn-xs bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-md px-2.5"
                                                        >
                                                            Accept Offer
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectBid(bid._id)}
                                                            className="btn btn-xs bg-red-500 hover:bg-red-600 text-white border-none rounded-md px-2.5"
                                                        >
                                                            Reject Offer
                                                        </button>
                                                    </div>
                                                )
                                            ) : (
                                                <span className="text-xs text-gray-400 block text-center">Seller only</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ======== BID MODAL MATCHING USER SCREENSHOT ======== */}
            <dialog ref={bidModalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-white max-w-md rounded-2xl p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
                        Give Seller Your Offered Price
                    </h2>

                    <form onSubmit={handleBidSubmit} className="space-y-4">
                        {/* Row 1: Buyer Name & Buyer Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Buyer Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={user?.displayName || ''}
                                    placeholder="Your name"
                                    className="input input-bordered w-full rounded-lg text-xs bg-white border-gray-200 focus:border-primary focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Buyer Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={user?.email || ''}
                                    placeholder="Your Email"
                                    className="input input-bordered w-full rounded-lg text-xs bg-gray-50 border-gray-200 text-gray-500 focus:outline-none"
                                    readOnly
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 2: Buyer Image URL */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Buyer Image URL
                            </label>
                            <input
                                type="text"
                                name="image"
                                defaultValue={user?.photoURL || ''}
                                placeholder="https://...your_img_url"
                                className="input input-bordered w-full rounded-lg text-xs bg-white border-gray-200 focus:border-primary focus:outline-none"
                            />
                        </div>

                        {/* Row 3: Place your Price */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Place your Price
                            </label>
                            <input
                                type="number"
                                step="any"
                                name="bid"
                                placeholder={`Min: $${price_min}`}
                                min={price_min}
                                className="input input-bordered w-full rounded-lg text-xs bg-white border-gray-200 focus:border-primary focus:outline-none"
                                required
                            />
                        </div>

                        {/* Row 4: Contact Info */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Contact Info
                            </label>
                            <input
                                type="text"
                                name="contact"
                                placeholder="e.g. +1-555-1234"
                                className="input input-bordered w-full rounded-lg text-xs bg-white border-gray-200 focus:border-primary focus:outline-none"
                            />
                        </div>

                        {/* Action buttons matching screenshot */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => bidModalRef.current?.close()}
                                className="border border-purple-400 text-purple-600 hover:bg-purple-50 px-5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={biddingLoading}
                                className="btn btn-primary px-5 py-2 rounded-lg text-xs font-semibold text-white shadow-sm cursor-pointer"
                            >
                                {biddingLoading ? 'Submitting...' : 'Submit Bid'}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default ProductDetails;