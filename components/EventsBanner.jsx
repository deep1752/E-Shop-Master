import React from 'react'
import Image from 'next/image' // Importing Image component from Next.js for optimized image rendering
import event1 from '../public/assets/event1.png' // Importing event images
import event2 from '../public/assets/event2.png' 
import event3 from '../public/assets/event3.png' 

// Functional component for EventsBanner
const EventsBanner = () => {
  return (
    // Section wrapper for the event container
    <section className='event-container'>
      
      {/* Subtitle section */}
      <div className='subtitle'>
        {/* Span for "PROMOTIONS" label */}
        <span>PROMOTIONS</span>
        {/* Heading for the main title */}
        <h2>Our Promotions Events</h2>
      </div>

      {/* Container for the event banner */}
      <div className='event-banner'>
        
        {/* Left side of the event banner */}
        <div className='event-banner-left'>
          
          {/* First event card */}
          <div className='event-card'>
            <div className='content'>
              {/* Heading for the offer */}
              <h3>GET UP TO <span>60%</span></h3>
              {/* Description for the offer */}
              <p>For the summer season</p>
            </div>
            {/* Image for the event, using Next.js Image component */}
            <Image src={event1} alt='event' />
          </div>

          {/* Second event card */}
          <div className='event-card'>
            {/* Heading for the discount offer */}
            <h3>GET 30% Off</h3>
            {/* Description for the promo code */}
            <p>USE PROMO CODE</p>
            {/* Button to show the promo code */}
            <button>DINEWEEKENDSALE</button>
          </div>
        </div>

        {/* Right side of the event banner */}
        <div className='event-banner-right'>
          
          {/* First product in the right section */}
          <div className='event-banner-right-1'>
            <div className='details'>
              {/* Product name */}
              <p>Flex Sweatshirt</p>
              <div className='price'>
                {/* Original price */}
                <span>₹ 100.00</span>
                {/* Discounted price */}
                <span>₹ 75.00</span>
              </div>
            </div>
            {/* Image for the product */}
            <Image src={event2} alt='event' />
          </div>

          {/* Second product in the right section */}
          <div className='event-banner-right-2'>
            <div className='details'>
              {/* Product name */}
              <p>Flex Push Button Bomber</p>
              <div className='price'>
                {/* Original price */}
                <span>₹ 225.00</span>
                {/* Discounted price */}
                <span>₹ 190.00</span>
              </div>
            </div>
            {/* Image for the product */}
            <Image src={event3} alt='event' />
          </div>
        </div>
      </div>
      
    </section>
  )
}

export default EventsBanner
