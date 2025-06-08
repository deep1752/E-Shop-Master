"use client"; // This directive tells Next.js that this component should be rendered on the client-side

import { useEffect, useState } from "react"; // Importing React hooks for state and side effects
import { useStateContext } from "@/context/StateContext"; // Custom context hook to access shared state (like logged-in user)
import { toast } from "sonner"; // Toast notification library to show success or error messages

// This component fetches product details based on the slug and allows adding the product to the wishlist
const ProductDetailsClient = ({ slug }) => {
  // Local state to hold the product data
  const [product, setProduct] = useState(null);
  
  // Loading state to handle UI during fetch
  const [loading, setLoading] = useState(true);
  
  // State to track if the product is already wishlisted
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Access the logged-in user from the global state context
  const { user } = useStateContext();

  // Side effect to fetch product data when the component mounts or the `slug` changes
  useEffect(() => {
    // Async function to fetch the product details
    const fetchProduct = async () => {
      try {
        // Make GET request to the FastAPI backend using the slug
        const res = await fetch(`https://e-shop-api-1vr0.onrender.com/products/product?slug=${slug}`);
        
        // Parse the JSON response
        const data = await res.json();
        
        // Store the product data in local state
        setProduct(data);
        
        // Set loading to false since data is now available
        setLoading(false);
      } catch (err) {
        // Log error and show toast notification on failure
        console.error(err);
        toast.error("Failed to load product");
        
        // Stop loading in case of error as well
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchProduct();
  }, [slug]); // Dependency array ensures the effect runs again if the slug changes

  // Handler function to add the product to the wishlist
  const handleAddToWishlist = async () => {
    // Ensure user is logged in and product is available before making the request
    if (!user?.id || !product?.id) {
      toast.error("You must be logged in to add to wishlist.");
      return;
    }

    try {
      // Make POST request to the FastAPI wishlist endpoint
      const res = await fetch("https://e-shop-api-1vr0.onrender.com/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Indicate we're sending JSON
        body: JSON.stringify({
          user_id: user.id,         // User ID from the context
          product_id: product.id,   // Product ID from fetched data
        }),
      });

      // If request was successful, update UI and show success toast
      if (res.ok) {
        toast.success("Added to wishlist");
        setIsWishlisted(true); // Mark this product as wishlisted
      } else {
        toast.error("Failed to add to wishlist");
      }
    } catch (err) {
      // Catch and log any network or server errors
      console.error(err);
      toast.error("An error occurred while adding to wishlist");
    }
  };

  // While data is still loading, show a loading message
  if (loading) return <p className="p-6 text-lg">Loading product...</p>;

  // Main UI rendering the product details
  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      {/* Product name */}
      <h1 className="text-2xl font-bold mb-2">{product?.name}</h1>

      {/* Product description */}
      <p className="text-gray-600 mb-4">{product?.description}</p>

      {/* Product price */}
      <p className="text-xl font-semibold mb-4">${product?.price}</p>

      {/* Wishlist button — style and text change based on whether it's wishlisted */}
      <button
        onClick={handleAddToWishlist} // Handle button click
        className={`px-4 py-2 rounded text-white ${
          isWishlisted ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
      </button>
    </div>
  );
};

// Export the component to use in other parts of the app
export default ProductDetailsClient;
