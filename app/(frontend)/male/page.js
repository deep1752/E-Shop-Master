import React from 'react';  
import AllProducts from "@/components/AllProducts";  

export default async function Male() {  
    
   
    const response = await fetch('http://127.0.0.1:8000/products/all_products?category=male');

    
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
