"use client"; 

import React, { createContext, useContext, useEffect, useState } from "react";

const Context = createContext();

export const UserContext = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async (token) => {
    if (!token) {
      setUserInfo(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to fetch profile.");
      }

      // Verify user role here
      if (data.role !== "customer") {
        localStorage.removeItem("token");
        throw new Error("Only customer accounts are allowed");
      }

      setUserInfo(data);
      setError(null);
    } catch (err) {
      console.warn("Profile fetch failed:", err.message);
      setUserInfo(null);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (storedToken) {
      fetchProfile(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <Context.Provider
      value={{
        userInfo,
        setUserInfo,
        loading,
        error,
        refreshUserInfo: () => {
          const token = localStorage.getItem("token");
          return fetchProfile(token);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useUserContext = () => useContext(Context);