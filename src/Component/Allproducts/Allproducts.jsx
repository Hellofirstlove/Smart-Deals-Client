import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/products`)
            .then(res => res.json())
            .then(data => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching all products:', err);
                setLoading(false);
            });
    }, []);

    const displayedProducts = searchQuery
        ? products.filter(p =>
            p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : products;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="py-6 px-2 md:px-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="rounded-lg py-3 px-6 text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    All <span className="text-primary">Products</span>
                </h1>
                {searchQuery && (
                    <div className="mt-2 text-sm text-gray-500 flex items-center justify-center gap-2">
                        <span>Showing results for: <strong className="text-gray-800">"{searchQuery}"</strong></span>
                        <button
                            onClick={() => setSearchParams({})}
                            className="text-xs text-primary hover:underline font-medium"
                        >
                            (Clear Filter)
                        </button>
                    </div>
                )}
            </div>

            {/* Container */}
            <div className="rounded-2xl p-4 md:p-6 lg:p-8">
                {displayedProducts.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 text-base">
                        No products found matching your criteria.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedProducts.map((product) => {
                            const minPrice = product.price_min ?? 0;
                            const maxPrice = product.price_max;

                            return (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Product Image */}
                                        <div className="w-full h-52 bg-gray-200 rounded-xl overflow-hidden mb-3">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://placehold.co/600x400?text=No+Image';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Status Badge */}
                                        <div className="mb-2">
                                            <span className="text-[11px] font-medium text-purple-600 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full inline-block">
                                                {product.status === 'sold' ? 'Sold' : 'On Sale'}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-1.5 min-h-[3rem]">
                                            {product.title}
                                        </h3>

                                        {/* Price */}
                                        <p className="text-primary font-bold text-sm mb-4">
                                            $ {minPrice}{maxPrice ? `- ${maxPrice}` : ''}
                                        </p>
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-2">
                                        <Link
                                            to={`/productDetails/${product._id}`}
                                            className="w-full border border-purple-400 text-purple-600 hover:bg-primary hover:text-white hover:border-primary text-xs md:text-sm font-medium py-2 rounded-lg text-center transition-colors block"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProducts;