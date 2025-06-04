import React from 'react'  // Import React library for building the component
import Image from 'next/image'  // Import Image component from Next.js for optimized image rendering
import logo from '../public/assets/Logo.png'  // Import the logo image for the footer
import Link from "next/link";  // Import Link component from Next.js for client-side navigation

// Importing icons from the 'react-icons' library for social media links
import { GrFacebookOption, GrYoutube, GrInstagram } from 'react-icons/gr'

// Footer functional component
const Footer = () => {
  return (
    // Footer container
    <footer>
      <div className='footer'>
        
        {/* Logo section */}
        <div className='logo'>
          {/* Using Next.js Image component for logo with specific width and height */}
          <Image src={logo} width={180} height={30} alt='logo' />
          
          {/* Short description about the company */}
          <p>Small, artisan label that offers a thoughtfully curated collection of high quality everyday essentials made.</p>
          
          {/* Social media icons container */}
          <div className='icon-container'>
            {/* Facebook Icon with link to the Facebook profile */}
            <div>
              <a href={`https://www.facebook.com/ranveer.kumawat.716`} target="_blank" rel="noopener noreferrer">
                <GrFacebookOption size={20} />
              </a>
            </div>
            {/* YouTube Icon with link to the YouTube channel */}
            <div>
              <a href={`https://www.youtube.com/@neverseen-2805`} target="_blank" rel="noopener noreferrer">
                <GrYoutube size={20} />
              </a>
            </div>
            {/* Instagram Icon with link to the Instagram profile */}
            <div>
              <a href={`https://www.instagram.com/neverseen2805`} target="_blank" rel="noopener noreferrer">
                <GrInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Company Links section */}
        <div className='footer-links'>
          <h3>Company</h3>
          {/* Unordered list for company-related links */}
          <ul>
            <li><Link href="/footer/about">About</Link></li>
            <li><Link href="/footer/terms">Terms of Use</Link></li>
            <li><Link href="/footer/privacy">Privacy Policy</Link></li>
            <li><Link href="/footer/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Support Links section */}
        <div className='footer-links'>
          <h3>Support</h3>
          {/* Unordered list for support-related links */}
          <ul>
            <li><Link href="/footer/careers">Support Career</Link></li>
            <li><Link href="/footer/support">24h Service</Link></li>
            <li><Link href="/footer/chat">Quick Chat</Link></li>
          </ul>
        </div>

        {/* Contact Links section */}
        <div className='footer-links'>
          <h3>Contact</h3>
          {/* Unordered list for contact-related links */}
          <ul>
            {/* WhatsApp link with a phone number, opens in a new tab */}
            <li>
              <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            {/* Support link that redirects to a page for support */}
            <li><Link href="/footer/support">Support 24h</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright section (currently commented out) */}
      {/* 
      <div className='copyright'>
        <p>Copyright © 2022 Dine Market</p>
        <p>Design by. <span>Gajanand Kumawat</span></p>
        <p>Code by. <span>shabrina12 on github</span></p>
      </div> 
      */}
    </footer>
  )
}

export default Footer
