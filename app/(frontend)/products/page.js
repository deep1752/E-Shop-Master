export const dynamic = "force-dynamic"; // disables static rendering
export const fetchCache = "force-no-store"; // disables fetch caching

import React from 'react';
import AllProducts from '@/components/AllProducts';

export default async function Products() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products`, {
    cache: 'no-store',
  });

  // Check if response is OK (status 200–299)
  if (!response.ok) {
    const errorText = await response.text(); // Get plain text error from response
    console.error("Failed to fetch products:", response.status, errorText);

    return (
      <p className="text-center py-10 text-red-500">
        Failed to load products. Server responded with status {response.status}.
      </p>
    );
  }

  let data;
  try {
    data = await response.json(); // Try parsing response as JSON
  } catch (error) {
    console.error("Error parsing JSON from response:", error);
    return (
      <p className="text-center py-10 text-red-500">
        Error loading products. Invalid response format.
      </p>
    );
  }

  // If no valid array is returned
  if (!Array.isArray(data)) {
    return (
      <p className="text-center py-10 text-red-500">
        No products available.
      </p>
    );
  }

  return (
    <div className="Allproducts-container grid grid-cols-3 gap-6 px-6 py-10">
      {data.map(prod => (
        <AllProducts key={prod.id} allproducts={prod} />
      ))}
    </div>
  );
}
