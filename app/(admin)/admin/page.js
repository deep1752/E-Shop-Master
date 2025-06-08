'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const role = localStorage.getItem("admin_role");
    if (token && role === "admin") {
      router.push("/admin/profile");
    }
  }, [router]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("https://e-shop-api-1vr0.onrender.com/auth/login", data);
      const token = res.data.access_token;

      const profile = await axios.get("https://e-shop-api-1vr0.onrender.com/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userRole = profile.data.role?.toLowerCase();

      if (userRole !== "admin") {
        toast.error("Access denied. Only admins can log in.");
        return;
      }

      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_user", JSON.stringify(profile.data));
      localStorage.setItem("admin_role", profile.data.role);

      toast.success("Login successful!");
      router.push("/admin/profile");
    } catch (err) {
      const errorMessage = err?.response?.data?.detail || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="login-page-container">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="login-form"
      >
        <h2 className="login-title">Admin Login</h2>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            {...register("email")}
            type="email"
            className={`form-input ${errors.email ? "input-error" : ""}`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            {...register("password")}
            type="password"
            className={`form-input ${errors.password ? "input-error" : ""}`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="button-loading">
              <span className="loading-spinner"></span>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}