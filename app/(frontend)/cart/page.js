"use client";

import React, { useRef, useEffect, useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShopping } from 'react-icons/ai';
import { HiOutlineTrash } from 'react-icons/hi';
import { useStateContext } from '@/context/StateContext';
import { useUserContext } from '@/context/UserContext';
import getStripe from '@/lib/getStripe';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

const Cart = () => {
  const cartRef = useRef();
  const router = useRouter();
  const { userInfo } = useUserContext();

  const {
    cartItems,
    setCartItems,
    totalPrice,
    totalQty,
    setTotalQty,
    setTotalPrice,
    onRemove,
    toggleCartItemQuantity,
  } = useStateContext();

  const [loading, setLoading] = useState(true); // ✅ Loader state

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userInfo) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/?user_id=${userInfo.id}`,
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
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/by-id/${item.product_id}`
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

      setCartItems(detailedCartItems);

      const totalQuantity = detailedCartItems.reduce((acc, item) => acc + item.quantity, 0);
      const totalCost = detailedCartItems.reduce((acc, item) => acc + item.quantity * item.net_price, 0);

      setTotalQty(totalQuantity);
      setTotalPrice(totalCost);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false); // ✅ Done loading
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [userInfo]);

  const handleCheckout = async () => {
    if (!userInfo) {
      toast.error("Please log in to proceed to checkout.");
      router.push("/login");
      return;
    }

    const stripe = await getStripe();

    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartItems),
    });

    if (response.statusCode === 500) return;

    const data = await response.json();

    toast.loading('Redirecting...');
    stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div className='cart-wrapper' ref={cartRef}>
      <h2>Shopping Cart</h2>

      {/* ✅ Show loader while loading */}
      {loading ? (
        <div className="text-center py-20 text-blue-600 font-semibold text-lg">
          Loading cart items...
        </div>
      ) : (
        <div className='cart-container'>
          {/* Cart Items */}
          <div className='cart-items'>
            {cartItems.length < 1 && (
              <div className='empty-cart'>
                <AiOutlineShopping size={150} />
                <h1>Your shopping bag is empty</h1>
              </div>
            )}

            {cartItems.length >= 1 &&
              cartItems.map((item, index) => (
                <div key={item.id || index} className='item-card'>
                  <div className='item-image'>
                    <img src={item.image} alt='img' />
                  </div>

                  <div className='item-details'>
                    <div className='name-and-remove'>
                      <h3>{item.name}</h3>
                      <button type='button' onClick={() => onRemove(item)} className='remove-item'>
                        <HiOutlineTrash size={28} />
                      </button>
                    </div>

                    <p className='item-tag'>Dress</p>
                    <p className='delivery-est'>Delivery Estimation</p>
                    <p className='delivery-days'>5 Working Days</p>

                    <div className='price-and-qty'>
                      <span className='price'>₹{item.net_price * item.quantity}</span>
                      <div>
                        <span className='minus' onClick={() => toggleCartItemQuantity(item.id, 'dec')}>
                          <AiOutlineMinus />
                        </span>
                        <span className='num'>{item.quantity}</span>
                        <span className='plus' onClick={() => toggleCartItemQuantity(item.id, 'inc')}>
                          <AiOutlinePlus />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Order Summary */}
          {cartItems.length >= 1 && (
            <div className='order-summary'>
              <h3>Order Summary</h3>

              <div className='qty'>
                <p>Quantity</p>
                <span>{totalQty} Product</span>
              </div>

              <div className='subtotal'>
                <p>Sub Total</p>
                <span>₹{totalPrice}</span>
              </div>

              <div>
                <button className='btn' type='button' onClick={handleCheckout}>
                  Process to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
