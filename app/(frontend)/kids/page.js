"use client"; // 👈 Needed for hooks

import React, { useEffect, useState } from 'react';
import AllProducts from "@/components/AllProducts";

export default function Kids() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const [error, setError] = useState(null); // Optional: error handling

  useEffect(() => {
    const fetchKidsProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products?category=kids`, {
          cache: "no-store", // same as fetchCache = "force-no-store"
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error("Failed to fetch:", response.status, errText);
          setError("Failed to load products.");
          return;
        }

        const result = await response.json();

        if (!Array.isArray(result)) {
          setError("No products available.");
          return;
        }

        setData(result);
      } catch (err) {
        console.error("Error:", err);
        setError("Something went wrong while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchKidsProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-blue-600 font-semibold">
        Loading kids' products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-medium">
        {error}
      </div>
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
