"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserContext } from "@/context/UserContext";
import { jwtDecode } from "jwt-decode";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const { refreshUserInfo } = useUserContext();

  // Auto-redirect user to profile if already logged in (and is customer)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        const userName = decoded?.name || decoded?.sub || "User";
        localStorage.setItem("userName", userName);
        setToken(storedToken);
        
        // Check if user is customer before redirecting
        checkUserRoleAndRedirect(storedToken);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
      }
    }
  }, [router]);

  const checkUserRoleAndRedirect = async (token) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/users/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const userData = await response.json();
      
      if (userData.role !== "customer") {
        toast.error("Only customer accounts are allowed to login");
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        return;
      }

      // User is a customer, proceed with redirect
      const wishlistSlug = localStorage.getItem("wishlist_redirect");
      if (wishlistSlug) {
        localStorage.removeItem("wishlist_redirect");
        router.push(`/products/${wishlistSlug}?addToWishlist=true`);
      } else {
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      toast.error("Error verifying your account type");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.detail || "Login failed");
        throw new Error(errorData.detail || "Login failed");
      }

      const result = await response.json();
      const accessToken = result.access_token;

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        setToken(accessToken);
        await refreshUserInfo();
        
        // After login, verify user role before proceeding
        await checkUserRoleAndRedirect(accessToken);
      } else {
        toast.error("No access token received.");
      }
    } catch (error) {
      console.error(error);
      setError("root", {
        type: "manual",
        message: error.message || "Invalid credentials. Please try again.",
      });
      toast.error(error.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-gray-200">
        <CardContent className="px-6 py-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Customer Login</h1>
            <p className="text-gray-600 text-sm">
              Please sign in to your customer account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1" aria-live="polite">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1" aria-live="polite">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full flex justify-center items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="text-center text-sm space-y-2 pt-4">
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
            <div className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}