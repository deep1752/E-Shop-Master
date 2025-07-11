"use client"; // ✅ Enable hooks

import React, { useEffect, useState } from 'react';
import AllProducts from "@/components/AllProducts";

export default function Female() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const [error, setError] = useState(null);     // ✅ error state

  useEffect(() => {
    const fetchFemaleProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products?category=female`, {
          cache: 'no-store', // same as export const fetchCache = "force-no-store"
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch products:", response.status, errorText);
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
        console.error("❌ Fetch error:", err);
        setError("❌ Something went wrong while fetching products.");
      } finally {
        setLoading(false); // ✅ Stop loader
      }
    };

    fetchFemaleProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16 text-blue-600 font-semibold">
        Loading female products...
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-center py-10">{error}</p>
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
