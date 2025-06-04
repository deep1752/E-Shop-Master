"use client";

import React, { useRef, useEffect, useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShopping } from 'react-icons/ai';
import { HiOutlineTrash } from 'react-icons/hi';
import { useStateContext } from '@/context/StateContext';
import { useUserContext } from '@/context/UserContext';
import getStripe from '@/lib/getStripe'; // Utility to get Stripe instance
import { toast } from "sonner";
import { useRouter } from 'next/navigation'; // For routing in app

const Cart = () => {
  const cartRef = useRef(); // Reference to the cart wrapper
  const router = useRouter(); // Router for navigation
  const { userInfo , setUserInfo } = useUserContext(); // Get logged-in user info from context
  
  const {
    cartItems,       // List of items in the cart
    setCartItems,
    totalPrice,      // Total price of all items
    totalQty,        // Total quantity of items
    setTotalQty,  // Now accessible from context
    setTotalPrice,  // Now accessible from context
    onRemove,        // Function to remove an item from cart
    toggleCartItemQuantity, // Function to increase or decrease item quantity
  } = useStateContext();


  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userInfo) return;
  
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/cart/?user_id=${userInfo.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const cartData = await response.json();
  
      const detailedCartItems = await Promise.all(
        cartData.map(async (item) => {
          const productRes = await fetch(
            `http://127.0.0.1:8000/products/by-id/${item.product_id}`
          );
          const product = await productRes.json();
  
          return {
            ...item,
            name: product.name,
            image: product.image,
            net_price: product.net_price,
          };
        })
      );
  
      // Set cart items
      setCartItems(detailedCartItems);
  
      // ✅ Recalculate total quantity and price
      const totalQuantity = detailedCartItems.reduce((acc, item) => acc + item.quantity, 0);
      const totalCost = detailedCartItems.reduce((acc, item) => acc + item.quantity * item.net_price, 0);
  
      // Update them using context setters if available, or manage here with useState
      setTotalQty(totalQuantity);
      setTotalPrice(totalCost);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };
  


  useEffect(() => {
    fetchCartItems(); // Load cart data on mount
  }, [userInfo]);



  // Handles the checkout process
  const handleCheckout = async () => {
    // If user is not logged in, show error and redirect to login
    if (!userInfo) {
      toast.error("Please log in to proceed to checkout.");
      router.push("/login");
      return;
    }

    // Get the Stripe instance
    const stripe = await getStripe();

    // Call the backend API to create a checkout session
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems), // Send cart items as JSON
    });

    // If server error, do nothing
    if (response.statusCode === 500) return;

    // Parse response data
    const data = await response.json();

    // Show toast and redirect to Stripe Checkout page
    toast.loading('Redirecting...');
    stripe.redirectToCheckout({ sessionId: data.id });
  };



  return (
    <div className='cart-wrapper' ref={cartRef}>
      <h2>Shopping Cart</h2>

      <div className='cart-container'>
        {/* Cart items */}
        <div className='cart-items'>
          {/* Show when cart is empty */}
          {cartItems.length < 1 && (
            <div className='empty-cart'>
              <AiOutlineShopping size={150} />
              <h1>Your shopping bag is empty</h1>
            </div>
          )}

          {/* Show cart items when not empty */}
          {cartItems.length >= 1 &&
            cartItems.map((item, index) => (
              <div key={item.id || index} className='item-card'>
                <div className='item-image'>
                  <img src={item.image} alt='img' />
                </div>

                <div className='item-details'>
                  <div className='name-and-remove'>
                    <h3>{item.name}</h3>
                    {/* Remove item from cart */}
                    <button type='button' onClick={() => onRemove(item)} className='remove-item'>
                      <HiOutlineTrash size={28} />
                    </button>
                  </div>

                  {/* Item details */}
                  <p className='item-tag'>Dress</p>
                  <p className='delivery-est'>Delivery Estimation</p>
                  <p className='delivery-days'>5 Working Days</p>

                  {/* Price and quantity controls */}
                  <div className='price-and-qty'>
                    <span className='price'>₹{item.net_price * item.quantity}</span>
                    <div>
                      {/* Decrease quantity */}
                      <span className='minus' onClick={() => toggleCartItemQuantity(item.id, 'dec')}>
                        <AiOutlineMinus />
                      </span>

                      {/* Show current quantity */}
                      <span className='num'>{item.quantity}</span>

                      {/* Increase quantity */}
                      <span className='plus' onClick={() => toggleCartItemQuantity(item.id, 'inc')}>
                        <AiOutlinePlus />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Order summary and checkout button */}
        {cartItems.length >= 1 && (
          <div className='order-summary'>
            <h3>Order Summary</h3>

            {/* Total Quantity */}
            <div className='qty'>
              <p>Quantity</p>
              <span>{totalQty} Product</span>
            </div>

            {/* Total Price */}
            <div className='subtotal'>
              <p>Sub Total</p>
              <span>₹{totalPrice}</span>
            </div>

            {/* Checkout button */}
            <div>
              <button className='btn' type='button' onClick={handleCheckout}>
                Process to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
