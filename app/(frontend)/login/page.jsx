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

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const router = useRouter();
  const { userInfo, loading, refreshUserInfo } = useUserContext();
  const [isCheckingRole, setIsCheckingRole] = useState(false);

  // Redirect only after userInfo is loaded and confirmed as customer
  useEffect(() => {
    if (loading || isCheckingRole) return;

    if (userInfo?.role === "customer") {
      const wishlistSlug = localStorage.getItem("wishlist_redirect");
      if (wishlistSlug) {
        localStorage.removeItem("wishlist_redirect");
        router.push(`/products/${wishlistSlug}?addToWishlist=true`);
      } else {
        router.push("/profile");
      }
    }
  }, [userInfo, loading, isCheckingRole, router]);

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
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
        setIsCheckingRole(true);
        await refreshUserInfo();
        setIsCheckingRole(false);
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