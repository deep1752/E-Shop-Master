"use client";

import React, { useEffect, useState } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { CgShoppingCart } from "react-icons/cg";  // Import shopping cart icon.
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useStateContext } from "@/context/StateContext";
import { useUserContext } from "@/context/UserContext";
import { toast } from "sonner";

const ProductPage = () => {
  const { slug } = useParams();  // Get the `slug` from the URL params.
  const searchParams = useSearchParams();  // Access search parameters from the URL.
  const addToWishlist = searchParams.get("addToWishlist");  // Check if the "addToWishlist" param is present in the URL.

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);




  const { decQty, incQty, qty, onAdd, wishlistItems, setWishlistItems } = useStateContext();
  const { userInfo: user } = useUserContext();  // Get the current logged-in user info.
  const router = useRouter();


  useEffect(() => {
    if (!slug) return;  // If no slug is present, exit early.

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get_product/${slug}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);  // Store the product data in the state.
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);  // Set loading to false even if the fetch fails.
      }
    };

    fetchProduct();
  }, [slug]);  // This effect runs whenever the `slug` changes.

  // Check if the product is already in the user's wishlist after the product or user info changes.
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user?.id || !product?.id) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/user/${user.id}`);
        const wishlist = await res.json();
        const exists = wishlist.some((item) => item.product_id === product.id);
        setIsWishlisted(exists);
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      }
    };

    if (product?.id) checkWishlist();  // Call checkWishlist only if product is loaded.
  }, [product?.id, user?.id]);

  // Handle adding/removing product from wishlist.
  const handleToggleWishlist = async () => {
    if (!user?.id || !product?.id) {  // If the user is not logged in or product data is missing.
      toast.error("You must be logged in to add this item to the wishlist.");
      localStorage.setItem("wishlist_redirect", product.slug);
      router.push("/login");
      return;
    }

    // If the product is already in the wishlist, remove it.
    if (isWishlisted) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/wishlist/delete`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,  // Pass user and product IDs in the request body.
            product_id: product.id,
          }),
        });

        if (res.ok) {
          toast.success(`${product.name} Removed from Wishlist!`);
          setIsWishlisted(false);  // Update wishlist state.
          setWishlistItems((prev) => prev.filter((item) => item.product.id !== product.id));  // Remove the product from the wishlist items in context.
        } else {
          toast.error(`${product.name} Failed to Remove from Wishlist!`);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error removing from wishlist");
      }
    } else {
      // If the product is not in the wishlist, add it.
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,  // Pass user and product IDs in the request body.
            product_id: product.id,
          }),
        });

        if (res.ok) {
          toast.success(`${product.name} added to your wishlist!`);
          setIsWishlisted(true);  // Update wishlist state.
          setWishlistItems((prev) => [...prev, { id: Date.now(), product }]);  // Add product to wishlist in context.
        } else {
          toast.error(`${product.name} Failed to add to wishlist`);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error adding to wishlist");
      }
    }
  };

  // Auto add to wishlist after login if the `addToWishlist` search param is true.
  useEffect(() => {
    if (
      addToWishlist === "true" &&
      user?.id &&
      product?.id &&
      !isWishlisted
    ) {
      handleToggleWishlist();  // Call the function to toggle the wishlist.
    }
  }, [addToWishlist, user?.id, product?.id]);  // This effect depends on `addToWishlist`, user, and product.



  useEffect(() => {
    const checkCart = async () => {
      if (!user?.id || !product?.id) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/?user_id=${user.id}`);
        const cartItems = await res.json();
        const exists = cartItems.some((item) => item.product_id === product.id);
        setIsInCart(exists);
      } catch (err) {
        console.error("Failed to fetch cart", err);
      }
    };

    checkCart();
  }, [user?.id, product?.id]);


  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-detail-container">
      <div className="product-images">
        <div className="big-image-container">
          <img src={product.image} alt={product.name} />  {/* Display product image */}
        </div>
      </div>
      <div className="product-details">
        <h3>{product.name}</h3>  {/* Display product name */}
        <p>{product.description}</p>  {/* Display product description */}
        <div className="quantity-desc">
          <h4>Quantity:</h4>
          <div>
            <span className="minus" onClick={decQty}>
              <AiOutlineMinus />  {/* Decrease quantity */}
            </span>
            <span className="num">{qty}</span>  {/* Display quantity */}
            <span className="plus" onClick={incQty}>
              <AiOutlinePlus />  {/* Increase quantity */}
            </span>
          </div>
        </div>
        <div className="add-to-cart">
          <button
            className="btn"
            onClick={() => {
              if (isInCart) {
                router.push("/cart");
              } else {
                onAdd(product, qty);
                toast.success(`${product.name} added to cart!`);
                setIsInCart(true); // Set to true immediately
              }
            }}
          >
            <CgShoppingCart size={20} />
            {isInCart ? "Go to Cart" : "Add to Cart"}
          </button>

          <p className="price">₹ {product.net_price}.00</p>  {/* Display product price */}
        </div>

        <div className="wishlist-btn mt-4">
          <button className="btn" onClick={handleToggleWishlist}>
            {isWishlisted ? (
              <>
                <AiFillHeart className="mr-2 text-red-500" />  {/* Filled heart for wishlist */}
                Wishlisted
              </>
            ) : (
              <>
                <AiOutlineHeart className="mr-2" />  {/* Empty heart for not wishlisted */}
                Add to Wishlist
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
