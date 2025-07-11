"use client"; // ✅ Makes this a client component

import React, { useEffect, useState } from 'react';
import AllProducts from "@/components/AllProducts";

export default function Male() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [error, setError] = useState(null);     // ✅ Error state

  useEffect(() => {
    const fetchMaleProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products?category=male`, {
          cache: "no-store", // same as fetchCache = "force-no-store"
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch:", response.status, errorText);
          setError("❌ Failed to load products.");
          return;
        }

        const result = await response.json();

        if (!Array.isArray(result)) {
          setError("No products available.");
          return;
        }

        setData(result);
      } catch (err) {
        console.error("❌ Error fetching male products:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false); // ✅ Hide loader after fetch completes
      }
    };

    fetchMaleProducts();
  }, []);

  // ✅ Show loader
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // ✅ Show error
  if (error) {
    return (
      <p className="text-red-500 text-center py-10">{error}</p>
    );
  }

  // ✅ Show products
  return (
    <div className="Allproducts-container grid grid-cols-3 gap-6 px-6 py-10">
      {data.map(prod => (
        <AllProducts key={prod.id} allproducts={prod} />
      ))}
    </div>
  );
}
