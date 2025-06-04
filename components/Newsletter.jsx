"use client"; // This directive tells Next.js to treat this component as a Client Component

import React from 'react'; // Importing React

// Newsletter functional component
const Newsletter = () => {
  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents page reload when the form is submitted
    // You can add logic here to send the email to a server or an API
  };

  return (
    // Main section of the newsletter
    <section className='newsletter'>
      
      {/* Background section of the newsletter, possibly styled via CSS */}
      <div className="newsletter-background">
        Newsletter
      </div>

      {/* Heading of the newsletter section */}
      <h1>Subscribe Our Newsletter</h1>

      {/* Subtext or subtitle */}
      <p>Get the latest information and promo offers directly</p>

      {/* Email subscription form */}
      <form onSubmit={handleSubmit}>
        
        {/* Email input field */}
        <input 
          type='email' 
          placeholder='Input email address'
          required // HTML5 validation to ensure email input is not empty and correctly formatted
        />

        {/* Submit button */}
        <button type='submit'>
          Get Started
        </button>
      </form>
    </section>
  );
};

// Exporting the component for use in other parts of the application
export default Newsletter;
