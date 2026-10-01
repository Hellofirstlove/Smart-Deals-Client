import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Outlet } from 'react-router';

const RootLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar></Navbar>
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
                <Outlet></Outlet>
            </main>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;