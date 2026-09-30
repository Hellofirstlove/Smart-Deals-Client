import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from './Component/Home/Home.jsx';
import RootLayout from './Component/LayOut/RootLayout.jsx';
import AllProducts from './Component/Allproducts/Allproducts.jsx';
import AuthProvider from './contexts/AuthProvider.jsx';
import Register from './Component/Register/Register.jsx';
import MyProducts from './Component/MyProducts/MyProducts.jsx';
import MyBids from './Component/MyBids/MyBids.jsx';
import ProductDetails from './Component/ProductDetails/ProductDetails.jsx'; 

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: 'allProducts',
        Component: AllProducts
      },
      {
        path: 'register',
        Component: Register
      },
      {
        path: 'myProducts',
        Component: MyProducts
      },
      {
        path: 'myBids',
        Component: MyBids
      },
      {
        path: 'productDetails/:id',
        loader: ({params}) => fetch(`http://localhost:3000/products/${params.id}`),
        Component: ProductDetails
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
