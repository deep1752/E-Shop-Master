export const dynamic = "force-dynamic"; // 👈 this disables static rendering
export const fetchCache = "force-no-store"; // optional: disables fetch caching

import React from 'react';  
import AllProducts from "@/components/AllProducts";  

export default async function Male() {  
    
   
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products?category=male`);

    
    const data = await response.json(); 

    if (!Array.isArray(data)) {
        return <p>No products available.</p>;  
    }
    return (
        <div className='Allproducts-container'>    
            {data.map(prod => (
                <AllProducts key={prod.id} allproducts={prod} />  
                /* Pass each product to the AllProducts component */
               
            ))}
        </div>
    );
}
