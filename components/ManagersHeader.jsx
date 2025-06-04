'use client';  // Indicates that this is a client-side component in Next.js (using React hooks)

import Link from 'next/link';  // Importing Link component from Next.js for navigation between pages
import { usePathname } from 'next/navigation';  // Importing usePathname hook to get the current pathname (used for highlighting active links)

export default function ManagersHeader() {
  // Using the usePathname hook to get the current path of the URL
  const pathname = usePathname();

  return (
    // Main container for the header links
    <div className="managers-header-container">

<Link
        href="/admin"  // URL to navigate to the User Manager page
        className={`managers-header-link ${pathname.includes('/admin') ? 'active-manager-link' : ''}`}  // Dynamically adding 'active-manager-link' class if current page is '/admin/user'
      >
        Dashbord
      </Link>
      
      {/* Link to the Product Manager page */}
      <Link
        href="/admin/product"  // URL to navigate to the Product Manager page
        className={`managers-header-link ${pathname.includes('/admin/product') ? 'active-manager-link' : ''}`}  // Dynamically adding 'active-manager-link' class if current page is '/admin/product'
      >
        Product Manager
      </Link>
      
      {/* Link to the Category Manager page */}
      <Link
        href="/admin/category"  // URL to navigate to the Category Manager page
        className={`managers-header-link ${pathname.includes('/admin/category') ? 'active-manager-link' : ''}`}  // Dynamically adding 'active-manager-link' class if current page is '/admin/category'
      >
        Category Manager
      </Link>
      
      {/* Link to the User Manager page */}
      <Link
        href="/admin/user"  // URL to navigate to the User Manager page
        className={`managers-header-link ${pathname.includes('/admin/user') ? 'active-manager-link' : ''}`}  // Dynamically adding 'active-manager-link' class if current page is '/admin/user'
      >
        User Manager
      </Link>
      
      {/* Link to the Promocode Manager page */}
      <Link
        href="/admin/promocode"  // URL to navigate to the Promocode Manager page
        className={`managers-header-link ${pathname.includes('/admin/promocode') ? 'active-manager-link' : ''}`}  // Dynamically adding 'active-manager-link' class if current page is '/admin/promocode'
      >
        Promocode Manager
      </Link>
      <Link
        href="/admin/profile"  // URL to navigate to the Product Manager page
        className={`managers-header-link ${pathname.includes('/admin/profile') ? 'active-manager-link' : ''}`}  // Dynamically adding 'active-manager-link' class if current page is '/admin/product'
      >
       Admin Profile
      </Link>
     
      
    </div>
  );
}
