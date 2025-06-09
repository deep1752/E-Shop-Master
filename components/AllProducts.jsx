'use client' 

// React and other hooks/libraries
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useStateContext } from '../context/StateContext' 
import { useUserContext } from '../context/UserContext'   
import { toast } from "sonner"                            
import { useRouter, useSearchParams } from 'next/navigation' 

// Functional component to display a single product card
const AllProducts = ({ allproducts }) => {

  // Local state to track wishlist status
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Destructure product properties from the passed props
  const { id, name, slug, description, mrp, net_price, image } = allproducts

  // Access router for navigation
  const router = useRouter()

  // Get query parameters (e.g., check if redirected with ?addToWishlist)
  const searchParams = useSearchParams();
  const addToWishlist = searchParams.get("addToWishlist");
  
  // Local states for product data and loading status
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Destructure wishlist and user info from contexts
  const { wishlistItems, setWishlistItems } = useStateContext();
  const { userInfo: user } = useUserContext();

  // Fallback product image if none is provided
  const defaultImage = '/images/default.jpg'

  // Fetch product details from backend using slug
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/get_product/${slug}`
        );
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Check if product already exists in the wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user?.id || !product?.id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/user/${user.id}`
        );
        const wishlist = await res.json();
        const exists = wishlist.some((item) => item.product_id === product.id);
        setIsWishlisted(exists); // Set wishlisted status based on response
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      }
    };

    if (product?.id) checkWishlist();
  }, [product?.id, user?.id]);

  // Handle adding/removing item to/from wishlist
  const handleToggleWishlist = async () => {
    // Redirect to login if user is not logged in
    if (!user?.id || !product?.id) {
      toast.error("You must be logged in to add this item to the wishlist.");
      localStorage.setItem("wishlist_redirect", product.slug);
      router.push("/login");
      return;
    }

    // If product is already in wishlist → Remove it
    if (isWishlisted) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/wishlist/delete`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.id,
              product_id: product.id,
            }),
          }
        );

        if (res.ok) {
          toast.success(`${product.name} Removed from Wishlist!`);
          setIsWishlisted(false);
          // Update wishlistItems in context
          setWishlistItems((prev) =>
            prev.filter((item) => item.product.id !== product.id)
          );
        } else {
          toast.error(`${product.name} Failed to remove from Wishlist!`);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error removing from wishlist");
      }
    } else {
      // If not in wishlist → Add it
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            product_id: product.id,
          }),
        });

        if (res.ok) {
          toast.success(`${product.name} added to your wishlist!`)
          setIsWishlisted(true);
          // Update wishlistItems in context
          setWishlistItems((prev) => [...prev, { id: Date.now(), product }]);
        } else {
          toast.error(`${product.name} Failed to add to wishlist`);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error adding to wishlist");
      }
    }
  };

  return (
    // Outer product card container
    <div className="Allproduct-card bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition relative cursor-pointer">

      {/* Wishlist Heart Icon (top right corner) */}
      <div
        className="wishlist-icon absolute top-2 right-2 cursor-pointer z-10"
        onClick={handleToggleWishlist}
      >
        {isWishlisted ? (
          // Filled red heart if wishlisted
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 
              12.28 2 8.5 2 5.42 4.42 3 7.5 
              3c1.74 0 3.41.81 4.5 2.09C13.09 
              3.81 14.76 3 16.5 3 19.58 3 
              22 5.42 22 8.5c0 3.78-3.4 
              6.86-8.55 11.54L12 21.35z" />
          </svg>
        ) : (
          // Outlined white heart if not wishlisted
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white stroke-gray-500 stroke-2" fill="none" viewBox="0 0 24 24">
            <path d="M16.5 3c-1.74 0-3.41.81-4.5 
              2.09C10.91 3.81 9.24 3 7.5 
              3 4.42 3 2 5.42 2 8.5c0 
              3.78 3.4 6.86 8.55 11.54L12 
              21.35l1.45-1.32C18.6 15.36 
              22 12.28 22 8.5 22 5.42 
              19.58 3 16.5 3z" />
          </svg>
        )}
      </div>

      {/* Clicking on the card leads to the product detail page */}
      <Link href={`/products/${slug}`} key={id}>

        {/* Product Image Block */}
        <div className="w-full h-[250px] overflow-hidden rounded mb-3">
          <img
            src={image || defaultImage}           // Fallback image if missing
            alt={name}                             // Alt text for accessibility
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Product Text Info */}
        <p className="Allproduct-name font-semibold text-lg mb-1">{name}</p>
        <p className="Allproduct-description text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        <p className="Allproduct-price text-blue-600 font-bold text-md">₹ {net_price}</p>

      </Link>
    </div>
  )
}

export default AllProducts
