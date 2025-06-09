export const dynamic = "force-dynamic"; // 👈 this disables static rendering
export const fetchCache = "force-no-store"; // optional: disables fetch caching

import React from 'react'
import AllProducts from '@/components/AllProducts'

export default async function Products() {
 
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/all_products`, {
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
