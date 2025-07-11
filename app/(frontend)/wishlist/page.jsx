"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CgShoppingCart } from "react-icons/cg";
import { useStateContext } from "@/context/StateContext";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loader state
  const { wishlistItems, setWishlistItems, onAdd } = useStateContext();

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");

      try {
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();

        if (!profileData.id) {
          toast.error("Failed to retrieve user profile");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/user/${profileData.id}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          const enrichedWishlist = await Promise.all(
            data.map(async (item) => {
              try {
                const productRes = await fetch(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/by-id/${item.product_id}`
                );
                const productData = await productRes.json();
                return {
                  ...item,
                  product: productData,
                };
              } catch {
                return item;
              }
            })
          );

          setWishlist(enrichedWishlist);
          setWishlistItems(enrichedWishlist);
        } else {
          console.error("Wishlist is not an array:", data);
          toast.error("Unexpected data format for wishlist");
          setWishlist([]);
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        toast.error("Failed to fetch wishlist");
        setWishlist([]);
      } finally {
        setLoading(false); // ✅ Hide loader in all cases
      }
    };

    fetchWishlist();
  }, [setWishlistItems]);

  const handleRemove = async (id) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/delete/${id}`, {
        method: "DELETE",
      });
      setWishlist((prev) => prev.filter((item) => item.id !== id));
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      toast.error("Failed to remove");
    }
  };

  const handleMoveToCart = (product, wishlistId) => {
    onAdd(product, 1);
    handleRemove(wishlistId);
    toast.success("Moved to cart");
  };

  return (
    <div className="wishlist-list">
      {/* ✅ Show loader */}
      {loading ? (
        <div className="text-center py-16 text-blue-600 font-semibold text-lg">
          Loading wishlist...
        </div>
      ) : wishlist.length > 0 ? (
        wishlist.map((item) => (
          <div key={item.id} className="wishlist-item">
            <img
              src={item.product?.image || "/placeholder.png"}
              alt={item.product?.name || "Product"}
              className="wishlist-image"
            />
            <div className="wishlist-info">
              <h2 className="wishlist-title">{item.product?.name}</h2>
              <p className="wishlist-price">₹{item.product?.net_price}</p>
              <div className="wishlist-actions">
                <button
                  onClick={() => handleMoveToCart(item.product, item.id)}
                  className="btn-move"
                >
                  <CgShoppingCart />
                  Move to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-wishlist-container">
          <p className="empty-wishlist text-lg font-semibold mb-4">
            Your wishlist is empty.
          </p>
          <Link href="/products">
            <button className="view-all-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              View All Products
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
