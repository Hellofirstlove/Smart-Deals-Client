import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div>
                        <h2 className="text-2xl font-bold mb-3">
                            Smart<span className="text-primary">Deals</span>
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your trusted marketplace for authentic local products. Discover the best deals from across Bangladesh.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-base mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/allProducts" className="hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                            <li><Link to="/register" className="hover:text-primary transition-colors">Login</Link></li>
                            <li><Link to="/register" className="hover:text-primary transition-colors">Register</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold text-base mb-4">Categories</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Electronics</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Fashion</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Home &amp; Living</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Groceries</a></li>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h3 className="font-semibold text-base mb-4">Contact &amp; Support</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                support@Smartdeals.com
                            </li>
                            <li className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                +880 123 456 789
                            </li>
                            <li className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                123 Commerce Street, Dhaka, Bangladesh
                            </li>
                        </ul>

                        {/* Social Links */}
                        <h3 className="font-semibold text-base mt-6 mb-3">Social Links</h3>
                        <div className="flex gap-3">
                            <a href="#" aria-label="Twitter" className="w-8 h-8 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="#" aria-label="LinkedIn" className="w-8 h-8 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                            <a href="#" aria-label="Facebook" className="w-8 h-8 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
                    © 2025 SmartDeals. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
