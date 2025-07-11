'use client'; // ✅ Required for client-side rendering

import React, { useEffect, useState } from 'react';
import AllProducts from '@/components/AllProducts';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ For loader
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid response format.');

        setProducts(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loader
  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-semibold text-blue-500">
        Loading products...
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <p className="text-center py-10 text-red-500">
        {error}
      </p>
    );
  }

  // Empty
  if (products.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        No products available.
      </p>
    );
  }

  // Success
  return (
    <div className="Allproducts-container grid grid-cols-3 gap-6 px-6 py-10">
      {products.map(prod => (
        <AllProducts key={prod.id} allproducts={prod} />
      ))}
    </div>
  );
}
