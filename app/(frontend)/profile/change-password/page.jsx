"use client";

import { useEffect, useState } from "react";  // Import React hooks
import { useRouter } from "next/navigation";  // Import Next.js router for navigation
import { Card, CardContent } from "@/components/ui/card";  // Import UI components for card display
import { Button } from "@/components/ui/button";  // Import button component
import { Input } from "@/components/ui/input";  // Import input field component
import { ReloadIcon } from "@radix-ui/react-icons";  // Import reload icon for loading state
import { toast } from "sonner";  // Import toast notifications for feedback

export default function ChangePasswordPage() {
  // State to hold user data, loading state, password inputs, and saving state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Initialize loading state to true
  const [newPassword, setNewPassword] = useState("");  // Initialize new password state
  const [confirmPassword, setConfirmPassword] = useState("");  // Initialize confirm password state
  const [isSaving, setIsSaving] = useState(false);  // State to track if password is being saved
  const router = useRouter();  // Initialize Next.js router for navigation

  // Effect hook to check if the user is logged in and fetch their profile
  useEffect(() => {
    const token = localStorage.getItem("token");  // Get token from localStorage

    // If no token, redirect to login page
    if (!token) {
      toast.error("You must be logged in to change your password.");
      router.push("/login");
      return;
    }

    // Fetch profile data from the backend using the token
    const fetchProfile = async () => {
      try {
        // Make GET request to fetch user profile
        const res = await fetch("http://127.0.0.1:8000/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,  // Send token in Authorization header
          },
        });

        // If response is not OK, throw an error
        if (!res.ok) {
          throw new Error("Failed to fetch profile.");
        }

        // Parse the response JSON and set the user data
        const data = await res.json();
        setUser(data);
      } catch (error) {
        // If an error occurs, show an error toast and redirect to login page
        toast.error("You must be logged in.");
        router.push("/login");
      } finally {
        setLoading(false);  // Set loading state to false after fetching profile
      }
    };

    fetchProfile();  // Call the fetchProfile function to get the user's profile
  }, [router]);  // Effect hook will re-run if the router changes

  // Function to handle password change
  const handleChangePassword = async () => {
    // Check if both password fields are filled
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }

    // Check if the passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const token = localStorage.getItem("token");  // Get the token from localStorage

    try {
      setIsSaving(true);  // Set isSaving to true to disable button during the request

      // Make PUT request to update the user's password
      const updateRes = await fetch(
        `http://127.0.0.1:8000/users/update/${user.id}`,  // Use the user ID in the URL
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,  // Include the token in the headers
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            password: newPassword,  // Update the password
            mob_number: user.mob_number,
            role: user.role,
          }),
        }
      );

      // If response is not OK, throw an error
      if (!updateRes.ok) {
        throw new Error("Failed to update password.");
      }

      // Show success toast if password is updated successfully
      toast.success("Password updated successfully!");

      // Reset the password fields
      setNewPassword("");
      setConfirmPassword("");

      // Redirect the user to the login page after updating the password
      router.push("/login");
    } catch (error) {
      // Show error toast if there was an issue updating the password
      toast.error("Error updating password.");
    } finally {
      setIsSaving(false);  // Set isSaving to false after the request completes
    }
  };

  // If loading, display a spinner
  if (loading) {
    return (
      <div className="loading-container">
        <ReloadIcon className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  // Return the UI for the Change Password page
  return (
    <div className="password-page-container">
      <Card className="card-container">
        <CardContent className="card-content">
          <h2 className="header-text">Change Password</h2>

          {/* Input fields for new password and confirm password */}
          <div className="input-container">
            <div className="input-field">
              <label className="label-text">New Password</label>
              <Input
                type="password"  // Password input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}  // Update state on input change
                className="input-field"
              />
            </div>

            <div className="input-field">
              <label className="label-text">Confirm New Password</label>
              <Input
                type="password"  // Password input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}  // Update state on input change
                className="input-field"
              />
            </div>

            {/* Button to submit password change */}
            <Button
              onClick={handleChangePassword}  // Call handleChangePassword on click
              disabled={isSaving}  // Disable button while saving
              className="submit-button"
            >
              {isSaving ? "Updating..." : "Update Password"}  // Change button text while saving
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
