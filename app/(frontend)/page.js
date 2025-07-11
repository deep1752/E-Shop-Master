
import HeroBanner from "@/components/HeroBanner";       
import EventsBanner from "@/components/EventsBanner";   
import Newsletter from "@/components/Newsletter";      
import ProductSlider from "@/components/ProductSlider"; 

// This is a Next.js Server Component for the Home page
export default async function Home() {
  
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products`, {
    cache: 'no-store',
  });

  const products = await res.json();


  return (
    <>
    
      <HeroBanner />

    
      <EventsBanner />

   
      <div className="products-outer-container">
        <div className="subtitle">
          <span>PRODUCTS</span>
          <h2>Check What We Have</h2> 
        </div>

      
        <ProductSlider products={products} />
      </div>

    
      <Newsletter />
    </>
  );
}
