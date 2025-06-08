
import React from 'react';

import AllProducts from "@/components/AllProducts";

// Define an asynchronous React component for the "Kids" products page
export default async function Kids() {
    
    const response = await fetch('https://e-shop-api-1vr0.onrender.com/products/all_products?category=kids');

    const data = await response.json(); 

    // Check if the data returned is an array; if not, return a fallback message
    if (!Array.isArray(data)) {
        return <p>No products available.</p>; 
    }

    return (
        <div className='Allproducts-container'>
            {data.map(prod => (
                <AllProducts key={prod.id} allproducts={prod} />
            ))}
        </div>
    );
}
