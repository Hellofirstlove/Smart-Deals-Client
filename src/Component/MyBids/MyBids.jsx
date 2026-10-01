import React, { use, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const MyBids = () => {
    const { user } = use(AuthContext);
    const [bids, setBids] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        fetch(`${import.meta.env.VITE_API_URL}/bids?email=${user.email}`)
            .then(res => res.json())
            .then(async (bidsData) => {
                setBids(bidsData);

                // Fetch product details for each unique productId in parallel
                const uniqueIds = [...new Set(bidsData.map(b => b.productId).filter(Boolean))];
                const productMap = {};

                await Promise.all(
                    uniqueIds.map(id =>
                        fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)
                            .then(res => res.json())
                            .then(product => { productMap[id] = product; })
                            .catch(() => {})
                    )
                );

                setProducts(productMap);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load bids:', err);
                setLoading(false);
            });
    }, [user]);

    const handleRemoveBid = (bidId) => {
        Swal.fire({
            title: 'Remove this bid?',
            text: "You won't be able to undo this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#632EE3',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, remove it!',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${import.meta.env.VITE_API_URL}/bids/${bidId}`, { method: 'DELETE' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount > 0) {
                            setBids(prev => prev.filter(b => b._id !== bidId));
                            Swal.fire({
                                title: 'Removed!',
                                text: 'Your bid has been removed.',
                                icon: 'success',
                                timer: 1500,
                                showConfirmButton: false,
                            });
                        }
                    })
                    .catch(err => console.error('Delete failed:', err));
            }
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'accepted': return 'badge-success text-white';
            case 'rejected': return 'badge-error text-white';
            default: return 'badge-warning text-white';
        }
    };

    const capitalize = (str) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1) : 'Pending';

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <h2 className="text-3xl font-bold text-center mb-8">
                My Bids:{' '}
                <span className="text-primary">{bids.length}</span>
            </h2>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                <table className="table">
                    <thead className="bg-base-200 text-gray-600 text-sm">
                        <tr>
                            <th>SL No</th>
                            <th>Product</th>
                            <th>Seller</th>
                            <th>Bid Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bids.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                                    You haven&apos;t placed any bids yet.
                                </td>
                            </tr>
                        ) : (
                            bids.map((bid, index) => {
                                const product = products[bid.productId] || {};
                                const sellerInitial = product.seller_name || 'S';
                                const sellerAvatar = product.seller_image ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerInitial)}&background=632EE3&color=fff`;

                                return (
                                    <tr key={bid._id} className="hover">
                                        {/* SL No */}
                                        <th className="text-gray-500">{index + 1}</th>

                                        {/* Product */}
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle h-12 w-12 bg-gray-100">
                                                        {product.image ? (
                                                            <img
                                                                src={product.image}
                                                                alt={product.title}
                                                                onError={e => { e.target.src = 'https://placehold.co/48?text=P'; }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm">
                                                        {product.title || 'Unknown Product'}
                                                    </div>
                                                    <div className="text-xs opacity-50">
                                                        ${product.price_min ?? '—'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Seller */}
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle h-12 w-12">
                                                        <img src={sellerAvatar} alt={product.seller_name} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm">
                                                        {product.seller_name || 'N/A'}
                                                    </div>
                                                    <div className="text-xs opacity-50">
                                                        {product.seller_email || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Bid Price */}
                                        <td className="font-semibold">${bid.bid_price}</td>

                                        {/* Status */}
                                        <td>
                                            <span className={`badge badge-sm font-medium ${getStatusClass(bid.status)}`}>
                                                {capitalize(bid.status)}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td>
                                            <button
                                                onClick={() => handleRemoveBid(bid._id)}
                                                disabled={bid.status === 'accepted'}
                                                className="btn btn-error btn-xs text-white disabled:opacity-40"
                                            >
                                                Remove Bid
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyBids;