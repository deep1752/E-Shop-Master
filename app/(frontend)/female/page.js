// app/(frontend)/female/page.js
export const dynamic = "force-dynamic"; // 👈 this disables static rendering
export const fetchCache = "force-no-store"; // optional: disables fetch caching

import React from 'react';
import AllProducts from "@/components/AllProducts";

export default async function Female() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products?category=female`);
    const data = await response.json();

    if (!Array.isArray(data)) {
      return <p>No products available.</p>;
    }

    return (
      <div className='Allproducts-container'>
        {data.map((prod) => (
          <AllProducts key={prod.id} allproducts={prod} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("❌ Failed to load female products:", error);
    return <p className="text-red-500">❌ Failed to load products. Please try again later.</p>;
  }
}



// git add .
// git commit -m "feat: updated EditPromoCode page with global CSS and aligned update button to right"
// git push origin main