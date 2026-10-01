import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

const Home = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [recentProducts, setRecentProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/latest-products`)
            .then(res => res.json())
            .then(data => {
                setRecentProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching latest products:', err);
                setLoading(false);
            });
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/allProducts?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/allProducts');
        }
    };

    return (
        <div className="pb-16">
            {/* ================= HERO SECTION ================= */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fdf2f8] via-[#f5f3ff] to-[#ecfeff] py-16 md:py-24 px-4 sm:px-6 my-4 border border-purple-50/50 shadow-xs">
                {/* Decorative Wave lines on Left */}
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none opacity-30">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-purple-400 stroke-current fill-none">
                        <path strokeWidth="1.2" d="M10,20 Q60,90 10,160 M25,20 Q75,90 25,160 M40,20 Q90,90 40,160 M55,20 Q105,90 55,160 M70,20 Q120,90 70,160" />
                    </svg>
                </div>

                {/* Decorative Wave lines on Right */}
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none opacity-30">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-cyan-400 stroke-current fill-none">
                        <path strokeWidth="1.2" d="M190,20 Q140,90 190,160 M175,20 Q125,90 175,160 M160,20 Q110,90 160,160 M145,20 Q95,90 145,160 M130,20 Q80,90 130,160" />
                    </svg>
                </div>

                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    {/* Hero Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                        Deal Your <span className="text-primary">Products</span>
                        <br />
                        In A <span className="text-primary">Smart</span> Way !
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto mt-4 mb-8 font-normal leading-relaxed">
                        SmartDeals helps you sell, resell, and shop from trusted local sellers — all in one place!
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-md mx-auto relative flex items-center mb-8">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="search For Products, Categories..."
                            className="w-full bg-white rounded-full py-3 pl-6 pr-14 shadow-sm border border-gray-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 text-gray-700"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs cursor-pointer"
                            aria-label="Search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>

                    {/* CTA Buttons */}
                    <div className="flex items-center justify-center gap-3">
                        <Link
                            to="/allProducts"
                            className="btn btn-primary px-5 py-2.5 rounded-lg text-xs font-semibold normal-case shadow-sm hover:shadow transition-all"
                        >
                            Watch All Products
                        </Link>
                        <Link
                            to="/createProduct"
                            className="border border-purple-400 text-purple-600 bg-white/80 hover:bg-purple-50 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all inline-block"
                        >
                            Post an Product
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= RECENT PRODUCTS SECTION ================= */}
            <section className="mt-16 md:mt-24 max-w-7xl mx-auto px-2 sm:px-4">
                {/* Title */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Recent <span className="text-primary">Products</span>
                    </h2>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center min-h-64">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : recentProducts.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        No recent products available.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentProducts.slice(0, 6).map((product) => {
                            const minPrice = product.price_min ?? 0;
                            const maxPrice = product.price_max;

                            return (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Image */}
                                        <div className="w-full h-52 bg-gray-200 rounded-xl overflow-hidden mb-4">
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

                                        {/* Title */}
                                        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-1 mb-1">
                                            {product.title}
                                        </h3>

                                        {/* Price */}
                                        <p className="text-primary font-bold text-sm mb-4">
                                            $ {minPrice}{maxPrice ? `- ${maxPrice}` : ''}
                                        </p>
                                    </div>

                                    {/* Action button */}
                                    <div>
                                        <Link
                                            to={`/productDetails/${product._id}`}
                                            className="w-full border border-purple-400 text-purple-600 hover:bg-primary hover:text-white hover:border-primary text-xs font-medium py-2 rounded-lg text-center transition-colors block"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Show All Button */}
                <div className="text-center mt-10">
                    <Link
                        to="/allProducts"
                        className="btn btn-primary px-8 py-2.5 rounded-lg text-white font-medium text-sm normal-case shadow-sm hover:shadow transition-all inline-block"
                    >
                        Show All
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;