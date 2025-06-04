"use client"; 

import React, { useEffect, useState } from "react"; 
import Link from "next/link"; 
import { toast } from "sonner"; 
import { CgShoppingCart } from "react-icons/cg"; 
import { useStateContext } from "@/context/StateContext"; 

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]); // Local state to store wishlist items
  const { wishlistItems, setWishlistItems, onAdd } = useStateContext(); 

  useEffect(() => {

    const fetchWishlist = async () => {
      const token = localStorage.getItem("token"); // Get token from local storage for authentication

      try {
        // First fetch the current user's profile to get user ID
        const profileRes = await fetch("http://127.0.0.1:8000/users/profile", {
          headers: { Authorization: `Bearer ${token}` }, // Send token in Authorization header
        });
        const profileData = await profileRes.json();

        if (!profileData.id) {
          toast.error("Failed to retrieve user profile"); 
          return;
        }

        // Then fetch wishlist items using the user's ID
        const res = await fetch(
          `http://127.0.0.1:8000/wishlist/user/${profileData.id}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          // For each wishlist item, fetch full product details using product_id
          const enrichedWishlist = await Promise.all(
            data.map(async (item) => {
              try {
                const productRes = await fetch(
                  `http://127.0.0.1:8000/products/by-id/${item.product_id}`
                );
                const productData = await productRes.json();
                return {
                  ...item,
                  product: productData, // Add product details to wishlist item
                };
              } catch {
                return item; // If fetching product fails, return original item
              }
            })
          );
          setWishlist(enrichedWishlist); // Update local wishlist state
          setWishlistItems(enrichedWishlist); // Update global wishlist state in context
        } else {
          // Handle unexpected data structure
          console.error("Wishlist is not an array:", data);
          toast.error("Unexpected data format for wishlist");
          setWishlist([]);
        }
      } catch (err) {
        // Handle network or other errors
        console.error("Error fetching wishlist:", err);
        toast.error("Failed to fetch wishlist");
        setWishlist([]);
      }
    };

    fetchWishlist(); // Call the async function
  }, [setWishlistItems]); // Dependency: re-run if setWishlistItems changes

  // Function to remove a wishlist item by ID
  const handleRemove = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/wishlist/delete/${id}`, {
        method: "DELETE", 
      });
      // Filter out the removed item from both local and context state
      setWishlist((prev) => prev.filter((item) => item.id !== id));
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      toast.error("Failed to remove");
    }
  };

  // Function to move a product from wishlist to cart
  const handleMoveToCart = (product, wishlistId) => {
    onAdd(product, 1); // Add one unit of the product to cart using context
    handleRemove(wishlistId); 
    toast.success("Moved to cart");
  };

  return (
    <div className="wishlist-list">
      {wishlist.length > 0 ? ( // Check if there are wishlist items
        wishlist.map((item) => (
          <div key={item.id} className="wishlist-item">
            <img
              src={item.product?.image || "/placeholder.png"} // Fallback image if none
              alt={item.product?.name || "Product"}
              className="wishlist-image"
            />
            <div className="wishlist-info">
              <h2 className="wishlist-title">{item.product?.name}</h2>
              <p className="wishlist-price">₹{item.product?.net_price}</p>
              <div className="wishlist-actions">
                {/* Button to move item to cart */}
                <button
                  onClick={() => handleMoveToCart(item.product, item.id)}
                  className="btn-move"
                >
                  <CgShoppingCart />
                  Move to Cart
                </button>
                {/* Button to remove item from wishlist */}
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
        // If wishlist is empty, show a message and a button to browse products
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

export default WishlistPage; // Export the component
