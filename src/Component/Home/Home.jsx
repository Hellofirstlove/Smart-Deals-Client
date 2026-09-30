import React from 'react';
import LatestProdustc from '../LatestProducts/LatestProdustc';
const latestProductsPromise = fetch('http://localhost:3000/latest-products').then(res => res.json());
const Home = () => {
    return (
        <div>
            <h3>This is Home Component</h3>
             <LatestProdustc latestProductsPromise={latestProductsPromise}></LatestProdustc>
        </div>
    );
};

export default Home;