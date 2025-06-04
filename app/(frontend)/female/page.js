import React from 'react';
import AllProducts from "@/components/AllProducts"; 

// async function
export default async function Female() {
  
  const response = await fetch('http://127.0.0.1:8000/products/all_products?category=female');

  // Convert the response to JSON
  const data = await response.json(); 

  // If the API doesn't return an array, show a fallback message
  if (!Array.isArray(data)) {
    return <p>No products available.</p>;
  }

  // Render the product list using AllProducts component for each product
  return (
    <div className='Allproducts-container'>
      {data.map(prod => (
        // Render each product with a unique key (using product ID)
        <AllProducts key={prod.id} allproducts={prod} />
      ))}
    </div>
  );
}
