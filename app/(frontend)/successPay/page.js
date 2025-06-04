'use client';

import React, { useState, useEffect } from 'react'; 
import Link from 'next/link'; 
import { BsBagCheckFill } from 'react-icons/bs'; 
import { useStateContext } from '@/context/StateContext'; 

// Confetti function defined inline
// This function runs a confetti animation upon successful order placement
const runConfetti = () => {
  if (typeof window !== 'undefined') { // Checking if the code is running in the browser (client-side)
    import('canvas-confetti') // Dynamically importing the canvas-confetti package
      .then((confetti) => { // Once the package is imported, execute the confetti animation
        confetti.default({
          particleCount: 150, // Number of confetti particles
          spread: 70, // The spread angle of the confetti
          origin: { y: 0.6 }, // The vertical starting position of the confetti
        });
      });
  }
};

const SuccessPay = () => {
  // Accessing the context to manage cart state
  const { setCartItems, setTotalPrice, setTotalQty } = useStateContext();

  // useEffect hook to run code when the component is mounted
  useEffect(() => {
    localStorage.clear(); // Clearing any stored data in localStorage after the order is successful
    setCartItems([]); // Resetting cart items to an empty array
    setTotalPrice(0); // Resetting total price to 0
    setTotalQty(0); // Resetting total quantity to 0
    runConfetti(); // Triggering the confetti animation
  }, []); // Empty dependency array ensures this code runs only once, when the component mounts

  return (
    <div className='success'> {/* Container div with a 'success' class for styling */}
      <p className='icon'> {/* Icon container */}
        <BsBagCheckFill size={80} /> {/* Displaying the shopping bag check icon */}
      </p>
      <h1>Thank you for your order!</h1> {/* Main heading showing a thank you message */}
      <p>Check your email inbox for the receipt</p> {/* Informing the user to check their email for the receipt */}
      <p className='description'> {/* Descriptive text container */}
        If you have any questions, please email
        <a href='mailto:dinemarket@example.com'> dinemarket@example.com</a> {/* Providing an email contact link */}
      </p>
      <Link href='/'> {/* Next.js Link component to navigate to the homepage */}
        <button className='btn' type='button' width='300px'> {/* Button to continue shopping */}
          Continue Shopping
        </button>
      </Link>
    </div>
  );
};

export default SuccessPay; // Exporting the SuccessPay component for use in other parts of the application
