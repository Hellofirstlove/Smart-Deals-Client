import React, { use } from 'react';
import Products from '../Products/Products';

const LatestProdustc = ({ latestProductsPromise }) => {
    const products = use(latestProductsPromise);
    console.log(products)
    return (
        <div>
            <h2 className="text-5xl text-center">Recent <span className='text-primary'>Products</span></h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {
                    products.map(product => <Products
                        key={product._id}
                        product={product}
                    ></Products>)
                }
            </div>
        </div>
    );
};

export default LatestProdustc;