import React, { use } from 'react';
import { Link, NavLink } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {

    const { user, signOutUser } = use(AuthContext);

    const handleSignOut = () => {
        signOutUser()
            .then()
            .catch()
    }


    const navLinkClass = ({ isActive }) =>
        isActive
            ? "text-primary font-semibold transition-colors"
            : "text-gray-600 hover:text-primary transition-colors";

    const links = <>
        <li><NavLink to="/" className={navLinkClass}>Home</NavLink></li>
        <li><NavLink to="/allProducts" className={navLinkClass}>All Products</NavLink></li>
        {
            user && <>
                <li><NavLink to="/myProducts" className={navLinkClass}>My Products</NavLink></li>
                <li><NavLink to="/myBids" className={navLinkClass}>My Bids</NavLink></li>
                <li><NavLink to="/createProduct" className={navLinkClass}>Create Product</NavLink></li>
            </>
        }
    </>

    return (
        <div className="navbar bg-base-100 shadow-sm px-4 md:px-8">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-2xl font-bold tracking-tight">
                    Smart<span className="text-primary">Deals</span>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2 text-sm">
                    {links}
                </ul>
            </div>
            <div className="navbar-end gap-3">
                {
                    user ? (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSignOut}
                                className="btn btn-ghost btn-sm text-xs text-gray-500 hover:text-error transition-colors"
                            >
                                Sign Out
                            </button>
                            <div className="avatar" title={user.displayName || user.email}>
                                <div className="w-10 h-10 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                                    <img
                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=632EE3&color=fff`}
                                        alt={user.displayName || 'User'}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="border border-purple-400 text-purple-600 hover:bg-purple-50 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-2xs"
                            >
                                Register
                            </Link>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Navbar;