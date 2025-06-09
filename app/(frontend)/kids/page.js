export const dynamic = "force-dynamic"; // 👈 this disables static rendering
export const fetchCache = "force-no-store"; // optional: disables fetch caching

import React from 'react';

import AllProducts from "@/components/AllProducts";

// Define an asynchronous React component for the "Kids" products page
export default async function Kids() {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products?category=kids`);

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
