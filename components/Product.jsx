import React from 'react'; // Importing React to use JSX
import Link from 'next/link'; // Importing Next.js Link component for client-side navigation

// Functional component named Product
// Destructuring the `product` prop to directly extract `image`, `name`, `slug`, and `net_price`
const Product = ({ product: { image, name, slug, net_price } }) => {
  
  // Fallback/default image in case the `image` is missing or undefined
  const defaultImage = 'path/to/default/image.jpg'; // You should replace this with an actual image path in your public folder

  return (
    <div>
      {/* Link to the product detail page using the product's slug */}
      <Link href={`/products/${slug}`}>
        <div className='product-card'>
          {/* Display product image or fallback image if image is not available */}
          <img 
            src={image || defaultImage} // Fallback logic
            width={380} // Width of the image in pixels
            height={400} // Height of the image in pixels
            alt={name} // Accessibility feature: describes the image
            className='product-image' // Class name for styling the image
          />

          {/* Product name */}
          <p className='product-name'>
            {name}
          </p>

          {/* Product price with rupee symbol */}
          <p className='product-price'>
            ₹ {net_price}
          </p>
        </div>
      </Link>
    </div>
  );
};

// Exporting the Product component so it can be used in other files
export default Product;
