"use client"; 
// This tells Next.js that the component must be rendered on the client side (required for Swiper which depends on the DOM)

// Import Swiper core modules for navigation and accessibility
import { Navigation, A11y } from "swiper";

// Import Swiper React components to create the carousel
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles so the slider appears correctly
import "swiper/css";
import "swiper/css/navigation";

// Import the Product component to display each product inside a slide
import Product from "./Product"; // Adjust the path if the Product component is located elsewhere

// Main functional component that receives a `products` array as props
export default function ProductSlider({ products }) {
  return (
    // Swiper component acts as the slider container
    <Swiper
      // Responsive breakpoints define how many slides to show at different viewport widths
      breakpoints={{
        300: { slidesPerView: 1, spaceBetween: 100 }, // On very small screens, show 1 product with space between
        1000: { slidesPerView: 2, spaceBetween: 0 },  // On medium screens, show 2 products
        1260: { slidesPerView: 3, spaceBetween: 0 },  // On large screens, show 3 products
      }}
      modules={[Navigation, A11y]} // Enable navigation arrows and accessibility support
      spaceBetween={0} // Space between slides (overridden by breakpoints)
      slidesPerView={3} // Default number of slides to show (overridden by breakpoints)
      navigation // Enables navigation arrows (prev/next)
    >
      {/* Check if product list is not empty */}
      {products.length > 0 ? (
        // Map over each product and render it inside a SwiperSlide
        products.map((product) => (
          <SwiperSlide key={product.id}>
            {/* Render the Product component, passing the product data as props */}
            <Product product={product} />
          </SwiperSlide>
        ))
      ) : (
        // If no products are available yet, show a loading message
        <p>Loading products...</p>
      )}
    </Swiper>
  );
}
