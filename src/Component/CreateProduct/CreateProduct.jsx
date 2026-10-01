import React, { use, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const CreateProduct = () => {
    const { user } = use(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [condition, setCondition] = useState('Brand New');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;

        const title = form.title.value.trim();
        const category = form.category.value;
        const price_min = parseFloat(form.price_min.value);
        const price_max_val = form.price_max.value ? parseFloat(form.price_max.value) : price_min;
        const usage_time = form.usage_time.value.trim();
        const image = form.image.value.trim();
        const seller_name = form.seller_name.value.trim();
        const seller_email = form.seller_email.value.trim();
        const seller_contact = form.seller_contact.value.trim();
        const seller_image = form.seller_image.value.trim();
        const location = form.location.value.trim();
        const description = form.description.value.trim();

        if (!title) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Please enter a product title!' });
            setLoading(false);
            return;
        }

        if (!category || category === 'Select a Category') {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Please select a valid category!' });
            setLoading(false);
            return;
        }

        if (isNaN(price_min) || price_min <= 0) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Please enter a valid minimum price!' });
            setLoading(false);
            return;
        }

        if (!image) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Please enter a product image URL!' });
            setLoading(false);
            return;
        }

        const newProduct = {
            title,
            category,
            price_min,
            price_max: isNaN(price_max_val) ? price_min : price_max_val,
            condition,
            usage_time,
            image,
            seller_name: seller_name || user?.displayName || 'Anonymous Seller',
            seller_email: seller_email || user?.email || '',
            email: seller_email || user?.email || '', // For queries that match by email
            seller_contact,
            seller_image: seller_image || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller_name || 'Seller')}&background=632EE3&color=fff`,
            seller_location: location,
            location,
            description,
            status: 'active',
            created_at: new Date().toISOString()
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            const data = await res.json();
            if (data.insertedId) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Product Created Successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
                form.reset();
                navigate('/allProducts');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: data.message || 'Could not create product.'
                });
            }
        } catch (error) {
            console.error('Error creating product:', error);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Failed to connect to the server.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-8 px-4">
            {/* Back link */}
            <div className="text-center mb-4">
                <Link
                    to="/allProducts"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                    <span className="text-base">←</span> Back To Products
                </Link>
            </div>

            {/* Page Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Create <span className="text-primary">A Product</span>
                </h1>
            </div>

            {/* Form Card */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Row 1: Title & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. Yamaha Fz Guitar for Sale"
                                className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none placeholder:text-gray-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Category
                            </label>
                            <select
                                name="category"
                                defaultValue="Select a Category"
                                className="select select-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none text-gray-700"
                                required
                            >
                                <option disabled value="Select a Category">
                                    Select a Category
                                </option>
                                <option value="Electronics">Electronics</option>
                                <option value="Music Instruments">Music Instruments</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Home & Living">Home & Living</option>
                                <option value="Groceries">Groceries</option>
                                <option value="Vehicles">Vehicles</option>
                                <option value="Sports & Outdoors">Sports & Outdoors</option>
                                <option value="Books & Stationery">Books & Stationery</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 2: Min Price & Max Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Min Price You want to Sale ($)
                            </label>
                            <input
                                type="number"
                                step="any"
                                name="price_min"
                                placeholder="e.g. 10.5"
                                className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none placeholder:text-gray-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Max Price You want to Sale ($)
                            </label>
                            <input
                                type="number"
                                step="any"
                                name="price_max"
                                placeholder="Optional (default = Min Price)"
                                className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Row 3: Product Condition & Product Usage time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                                Product Condition
                            </label>
                            <div className="flex items-center gap-6 mt-1">
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                                    <input
                                        type="radio"
                                        name="condition"
                                        value="Brand New"
                                        checked={condition === 'Brand New'}
                                        onChange={() => setCondition('Brand New')}
                                        className="radio radio-primary radio-sm"
                                    />
                                    <span>Brand New</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                                    <input
                                        type="radio"
                                        name="condition"
                                        value="Used"
                                        checked={condition === 'Used'}
                                        onChange={() => setCondition('Used')}
                                        className="radio radio-primary radio-sm"
                                    />
                                    <span>Used</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Product Usage time
                            </label>
                            <input
                                type="text"
                                name="usage_time"
                                placeholder="e.g. 1 year 3 month"
                                className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Row 4: Your Product Image URL */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Your Product Image URL
                        </label>
                        <input
                            type="url"
                            name="image"
                            placeholder="https://..."
                            className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none placeholder:text-gray-400"
                            required
                        />
                    </div>

                    {/* Row 5: Seller Name & Seller Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Seller Name
                            </label>
                            <input
                                type="text"
                                name="seller_name"
                                defaultValue={user?.displayName || ''}
                                placeholder="e.g. Artisan Roasters"
                                className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none placeholder:text-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Seller Email
                            </label>
                            <input
                                type="email"
                                name="seller_email"
                                defaultValue={user?.email || ''}
                                placeholder="leli31955@nrnrlord.com"
                                className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Row 6: Seller Contact & Seller Image URL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Seller Contact
                            </label>
                            <input
                                type="text"
                                name="seller_contact"
                                placeholder="e.g. +1-555-1234"
                                className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none placeholder:text-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Seller Image URL
                            </label>
                            <input
                                type="url"
                                name="seller_image"
                                defaultValue={user?.photoURL || ''}
                                placeholder="https://..."
                                className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Row 7: Location */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            placeholder="City, Country"
                            className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none placeholder:text-gray-400"
                        />
                    </div>

                    {/* Row 8: Simple Description about your Product */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Simple Description about your Product
                        </label>
                        <textarea
                            name="description"
                            rows="4"
                            placeholder="e.g. I bought this product 3 month ago. did not used more than 1/2 time. actually learning guitar is so tough....."
                            className="textarea textarea-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none placeholder:text-gray-400 leading-relaxed"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-3.5 rounded-xl font-semibold text-base shadow-sm hover:shadow-md transition-all normal-case"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Creating Product...
                                </span>
                            ) : (
                                'Create A Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;
