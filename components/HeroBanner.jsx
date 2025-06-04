import React from 'react'  // Importing React to build the component
import Image from 'next/image'  // Importing Image from Next.js for optimized image rendering
import { CgShoppingCart } from 'react-icons/cg'  // Importing shopping cart icon from 'react-icons'
import headerImg from '../public/assets/header.png'  // Importing the header image
import featured1 from '../public/assets/Featured1.png';  // Importing featured images
import featured2 from '../public/assets/Featured2.png';
import featured3 from '../public/assets/Featured3.png';
import featured4 from '../public/assets/Featured4.png';
import Link from 'next/link';  // Importing Link for client-side navigation between pages

// HeroBanner functional component
const HeroBanner = () => {
  return (
    // Main container for the hero banner, structured as a header
    <header className='header'>
        
        {/* Left side of the header (content and featured images) */}
        <div className='header-left-side'>
            
            {/* Main content area with the title, subtitle, and shopping button */}
            <div className='header-content'>
                {/* Sale text */}
                <span>Sale 70%</span>
                
                {/* Main heading for the hero banner */}
                <h1>An Industrial Take on Streetwear</h1>
                
                {/* Subheading with a catchy line describing the brand */}
                <p>Anyone can beat you but no one can beat your outfit as long as you wear Dine outfits.</p>
                
                {/* Link to the products page with a styled shopping button */}
                <Link href='/products'>
                     <button className='btn' type='button'>
                        {/* Shopping cart icon inside the button */}
                        <CgShoppingCart size={26} />  Start Shopping
                    </button>
                </Link>
            </div>

            {/* Featured images section */}
            <div className='header-featured'>
                {/* Displaying four featured images with specific sizes */}
                <Image src={featured1} width={100} height={35} alt='Featured 1' />
                <Image src={featured2} width={100} height={35} alt='Featured 2' />
                <Image src={featured3} width={100} height={35} alt='Featured 3' />
                <Image src={featured4} width={100} height={35} alt='Featured 4' />
            </div>
        </div>

        {/* Right side of the header (main circular image) */}
        <div className='header-right-side'>
            {/* Circle container for the large header image */}
            <div className='header-circle'>
                {/* Displaying the main header image with optimized size */}
                <Image className='header-img' src={headerImg} width={650} height={650} alt='Main header image' />
            </div>
        </div>
    </header>
  )
}

export default HeroBanner
