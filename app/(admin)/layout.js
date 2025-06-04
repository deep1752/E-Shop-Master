'use client';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { AdminProvider } from '@/context/AdminContext';
import './globals.css';
import AdminHeader from '@/components/AdminHeader';
import AdminFooter from '@/components/AdminFooter';
import { Toaster } from 'sonner'; // ✅ Add this

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin';

  return (
    <html lang="en">
      <body className={!isLoginPage ? "admin-layout" : ""}>
        <AdminProvider>
          <Toaster richColors position="top-center" /> {/* ✅ This is crucial */}
          {isLoginPage ? (
            children
          ) : (
            <div className="admin-dashboard-container">
              <div className="sidebar">
                <div className="logo">Admin Panel</div>
                <nav>
                  <ul>
                    <li><Link href="/admin/dashbord">Dashbord</Link></li>
                    <li><Link href="/admin/user">Customers</Link></li>
                    <li><Link href="/admin/product">Products</Link></li>
                    <li><Link href="/admin/category">Categories</Link></li>
                    <li><Link href="/admin/promocode">Promocodes</Link></li>
                    <li><Link href="/admin/orders">Orders</Link></li>
                    <li><Link href="/admin/settings">Settings</Link></li>
                  </ul>
                </nav>
              </div>

              <div className="main-content-wrapper">
                <AdminHeader />
                <main className="admin-main-content">
                  {children}
                </main>
                <AdminFooter />
              </div>
            </div>
          )}
        </AdminProvider>
      </body>
    </html>
  );
}