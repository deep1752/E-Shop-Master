"use client";

import { useState, useEffect } from "react"; 
import { toast } from "sonner"; 
import { useRouter } from "next/navigation"; 

import { Card, CardContent } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import { ReloadIcon } from "@radix-ui/react-icons"; 
import Link from "next/link"; 

export default function LoginPage() {
  // Initial state for the form fields: name, email, password, and mobile number
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mob_number: "",
  });

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  //redirect to profile if a token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/profile"); 
    }
  }, []);

  // Validation function for the form inputs
  const validate = () => {
    const errs = {};
    
    // Validation checks for each field
    if (form.name.trim().length < 2) errs.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email address";
    if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.mob_number.length < 10) errs.mob_number = "Mobile number is required";

    return errs;
  };

  // Handle changes in form inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission, performing validation and making the API request
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const validationErrors = validate(); 
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); 
      toast.error("Please fix the form errors."); 
      return;
    }
    setErrors({}); // Reset errors state
    setIsSubmitting(true); // Set submitting state to true to disable the button

    try {

      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.detail || "Something went wrong");

      toast.success("Account created successfully! You can now log in."); 
      setForm({ name: "", email: "", password: "", mob_number: "" }); // Clear form fields
      router.push("/login"); 
    } catch (error) {
      toast.error(error.message || "Signup failed. Please try again."); 
      setErrors({ root: error.message }); 
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      {/* Main container for the form, styled with gradient background */}
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-gray-200">
        {/* Card container for form */}
        <CardContent className="px-6 py-8 space-y-6">
          {/* Card content wrapper */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            {/* Title of the page */}
            <p className="text-gray-600 text-sm">Join us by filling in your details</p>
            {/* Description text */}
          </div>

          {/* Form to collect user input */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Loop through fields and create input for each */}
            <div className="space-y-4">
              {["name", "email", "password", "mob_number"].map((field) => (
                <div key={field}>
                  {/* Label and input field for each form field */}
                  <Label htmlFor={field}>
                    {field === "mob_number" ? "Mobile Number" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    id={field}
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    placeholder={`Enter your ${field}`}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full mt-1"
                  />
                  {/* Display validation error if there is an issue with the field */}
                  {errors[field] && <p className="text-red-600 text-xs mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>

            {/* Submit button for form */}
            <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isSubmitting}>
              {/* Spinner and text while submitting */}
              {isSubmitting ? (
                <>
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : "Sign up"}
            </Button>
          </form>

          {/* Link to login page if the user already has an account */}
          <div className="text-center text-sm pt-4">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
