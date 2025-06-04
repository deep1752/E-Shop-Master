"use client"; 

import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import axios from 'axios';
import { useRouter } from "next/navigation";
// import { useUserContext } from "@/context/UserContext"; // adjust import path as needed

import { useUserContext } from '../context/UserContext'  
// Create a new context instance to share state globally
const Context = createContext();

// Context provider component that wraps around parts of the app that need access to shared state
export const StateContext = ({ children }) => {
  // Shopping cart state variables
  const [showCart, setShowCart] = useState(false);        // Boolean to toggle cart visibility
  const [cartItems, setCartItems] = useState([]);         // Array of items in the cart
  const [totalPrice, setTotalPrice] = useState(0);        // Total price of cart items
  const [totalQty, setTotalQty] = useState(0);            // Total quantity of all cart items
  const [qty, setQty] = useState(1);                      // Quantity selector for product page
  
  const { userInfo, setUserInfo } = useUserContext();
  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState([]); // Array of items added to wishlist
  const router = useRouter();

  

  /**
   * Fetches the wishlist items for the logged-in user from the backend
   */
  const fetchWishlist = async () => {
    const token = localStorage.getItem("token"); // Retrieve auth token
    if (!token || !userInfo) return;             // If no token or user info, exit

    try {
      // Call the backend API to get wishlist items
      const response = await fetch(
        `http://127.0.0.1:8000/wishlist/?user_id=${userInfo.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include auth token in headers
          },
        }
      );

      const data = await response.json(); // Parse JSON response
      if (response.ok) {
        setWishlistItems(data); // Update wishlist state
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error); // Log any errors
    }
  };

  /**
   * Adds a product to wishlist state if it doesn't already exist
   */
  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      // Only add if not already in wishlist
      if (!prevItems.find((item) => item.id === product.id)) {
        return [...prevItems, product];
      }
      return prevItems; // If already there, return original
    });
  };

  /**
   * Removes a product from the wishlist by its ID
   */
  const removeFromWishlist = (id) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  /**
   * Moves a product from wishlist to cart and removes it from wishlist
   */
  const moveToCart = (product, wishlistId) => {
    onAdd(product, 1);              // Add the item to the cart
    removeFromWishlist(wishlistId); // Then remove it from wishlist
  };

  /**
   * Increments the product quantity (used on product detail page)
   */
  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  /**
   * Decrements the quantity but never below 1
   */
  const decQty = () => {
    setQty((prevQty) => (prevQty > 1 ? prevQty - 1 : 1));
  };

  /**
   * Adds a product to the cart
   * @param {Object} product - product to be added
   * @param {Number} quantity - quantity to add
   */



  const fetchCartItems = async () => {
    if (!userInfo || !userInfo.id) return;
  
    try {
      const response = await axios.get(`http://127.0.0.1:8000/cart/?user_id=${userInfo.id}`);
      setCartItems(response.data);
  
      const totalPrice = response.data.reduce((acc, item) => acc + item.net_price * item.quantity, 0);
      const totalQty = response.data.reduce((acc, item) => acc + item.quantity, 0);
      setTotalPrice(totalPrice);
      setTotalQty(totalQty);
    } catch (error) {
      toast.error("Failed to fetch cart items.");
    }
  };
  
  
  const onAdd = async (product, quantity) => {
    if (!userInfo || !userInfo.id) {
      toast.error("Please log in to add items to the cart.");
      return;
    }
  
    const checkProductInCart = cartItems.find((item) => item.id === product.id);
  
    if (checkProductInCart) {
      // Product already in cart → redirect
      router.push('/cart');
      return;
    }
  
    // Add to backend cart
    try {
      await axios.post('http://127.0.0.1:8000/cart/add', {
        user_id: userInfo.id,
        product_id: product.id,
        quantity,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      toast.error("Failed to add to backend cart.");
      return;
    }
  
    // Update local cart
    setTotalPrice((prev) => prev + product.net_price * quantity);
    setTotalQty((prev) => prev + quantity);
    setCartItems([...cartItems, { ...product, quantity }]);
    toast.success(`${quantity} ${product.name} added to the cart.`);
    setQty(1);
  };


  const toggleCartItemQuantity = (id, action) => {
    const foundProduct = cartItems.find((item) => item.id === id);
    if (!foundProduct) return;
  
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === id) {
        let newQuantity = item.quantity;
  
        if (action === 'inc') {
          newQuantity = item.quantity + 1;
          setTotalPrice((prev) => prev + item.net_price);
          setTotalQty((prev) => prev + 1);
        } else if (action === 'dec' && item.quantity > 1) {
          newQuantity = item.quantity - 1;
          setTotalPrice((prev) => prev - item.net_price);
          setTotalQty((prev) => prev - 1);
        }
  
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
  
    setCartItems(updatedCartItems);
  };

 
  
  const onRemove = async (product) => {
    const token = localStorage.getItem("token");
  
    try {
      await axios.delete(`http://127.0.0.1:8000/cart/delete/${product.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to remove from backend cart.");
      return;
    }
  
    const filteredCartItems = cartItems.filter((item) => item.id !== product.id);
    setTotalPrice((prev) => prev - product.net_price * product.quantity);
    setTotalQty((prev) => prev - product.quantity);
    toast.success(`${product.quantity} ${product.name} deleted from the cart.`);

    setCartItems(filteredCartItems);
  };
  
  
  

  // Provide all states and functions to children components using this context
  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        setCartItems,
        totalPrice,
        setTotalPrice,
        totalQty,
        setTotalQty,
        qty,
        setQty,
        incQty,
        decQty,
        onAdd,
        wishlistItems,
        setWishlistItems, // Needed to reset or directly manipulate wishlist
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        onRemove, 
        toggleCartItemQuantity,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// Custom hook to use context easily in other components
export const useStateContext = () => useContext(Context);
