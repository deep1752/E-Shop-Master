"use client"; // Ensures this component is client-side

// src/components/withAuth.js
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

const AdminWithAuth = (WrappedComponent) => {
  return function ProtectedRoute(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("admin_token");
      const role = localStorage.getItem("admin_role");

      if (!token || role !== "admin") {
        toast.error("You must be logged in as admin");
        router.push("/admin");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default AdminWithAuth;
