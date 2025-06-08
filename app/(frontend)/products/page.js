import React from 'react'
import AllProducts from '@/components/AllProducts'

export default async function Products() {
 
  const response = await fetch('https://e-shop-api-1vr0.onrender.com/products/all_products', {
    // 'cache: no-store' ensures the data is always fresh, bypassing any cache
    cache: 'no-store',
  });

  const data = await response.json();

  
  if (!Array.isArray(data)) {
    return <p className="text-center py-10 text-red-500">No products available.</p>;
  }

  return (
    <div className="Allproducts-container grid grid-cols-3 gap-6 px-6 py-10">
     
      {data.map(prod => (
        // Use product ID as the key to help React efficiently update the DOM
        <AllProducts key={prod.id} allproducts={prod} />
      ))}
    </div>
  );
}
