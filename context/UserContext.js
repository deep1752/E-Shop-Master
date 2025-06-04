"use client"; 

import React, { createContext, useContext, useEffect, useState } from "react";

// Create a context to hold and provide user-related data globally
const Context = createContext();

// UserContext component to wrap your application and provide user data
export const UserContext = ({ children }) => {
 
  const [userInfo, setUserInfo] = useState(null);

 
  const [loading, setLoading] = useState(true);

  
  const [error, setError] = useState(null);

  // State to store the token from localStorage
  const [token, setToken] = useState(null);

  // Get token from localStorage when component mounts
  useEffect(() => {
    // Only run this in the browser (window exists)
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (storedToken) {
      setToken(storedToken); // Set the token if found
    } else {
      setLoading(false); // If no token, stop loading immediately
    }
  }, []);

  // Function to fetch the current user's profile from the backend
  const fetchProfile = async (overrideToken) => {
    const authToken = overrideToken || token; // Use override token if provided

    // If there's no token, clear the user state and stop loading
    if (!authToken) {
      setUserInfo(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true); // Start loading while fetching

      const res = await fetch("http://127.0.0.1:8000/users/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`, // Auth header with token
          "Content-Type": "application/json",
        },
      });

      const data = await res.json(); // Parse the response JSON

      // If response is not OK, throw an error to be caught
      if (!res.ok) {
        throw new Error(data.detail || "Failed to fetch profile.");
      }

      setUserInfo(data); // Set the fetched user profile
      setError(null); // Clear any previous errors
    } catch (err) {
      console.warn("Profile fetch failed:", err.message);

      // If token is invalid, clear it from localStorage
      if (err.message === "Could not validate credentials") {
        localStorage.removeItem("token");
        setToken(null);
      }

      setUserInfo(null); // Clear any existing user info
      setError(err.message || "Something went wrong."); // Set error
    } finally {
      setLoading(false); // Done fetching
    }
  };

  // Automatically fetch profile whenever token changes
  useEffect(() => {
    if (token) {
      fetchProfile(token);
    }
  }, [token]);

  return (
    // Provide user-related values to all children components
    <Context.Provider
      value={{
        userInfo,                // The current logged-in user's profile
        setUserInfo,             // Function to manually update userInfo
        loading,                 // Whether the user profile is being loaded
        error,                   // Any error that occurred during fetch
        setLoading,              // Allow manual control of loading state
        refreshUserInfo: () => fetchProfile(token), // Refetch user profile manually
        setToken,                // Allow updating token (e.g. after login)
      }}
    >
      {children}
    </Context.Provider>
  );
};

// Custom hook to access the UserContext easily
export const useUserContext = () => useContext(Context);
