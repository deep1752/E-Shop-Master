"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { CgShoppingCart, CgUser } from "react-icons/cg";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { toast } from "sonner";
import logo from "../public/assets/Logo.png";
import { useRouter } from "next/navigation";

import { useStateContext } from "@/context/StateContext";
import { useUserContext } from "@/context/UserContext";

const Navbar = ({ Searchproducts }) => {
  const {
    showCart,
    setShowCart,
    cartItems,
    totalQty,
    setTotalQty,
    setCartItems,
    wishlistItems,
    setWishlistItems,
  } = useStateContext();
  const { userInfo, setUserInfo } = useUserContext();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(storedWishlist);

    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);

    const storedCartQty = JSON.parse(localStorage.getItem("cartQty")) || 0;
    setTotalQty(storedCartQty);
  }, [setWishlistItems, setCartItems, setTotalQty]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    const qty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setTotalQty(qty);
    localStorage.setItem("cartQty", JSON.stringify(qty));
  }, [cartItems]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleWishlistClick = () => {
    if (!userInfo) {
      toast.error("Please login to access your wishlist");
      router.push("/login");
    } else {
      router.push("/wishlist");
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50">
        {/* Logo */}
        <Link href="/">
          <Image src={logo} width={140} height={25} alt="logo" />
        </Link>

        {/* Nav Links (Desktop) */}
        <ul className="hidden md:flex gap-6 text-sm font-medium items-center">
          <Link href="/female"><li className="hover:text-blue-600">Female</li></Link>
          <Link href="/male"><li className="hover:text-blue-600">Male</li></Link>
          <Link href="/kids"><li className="hover:text-blue-600">Kids</li></Link>
          <Link href="/products"><li className="hover:text-blue-600">All Products</li></Link>
        </ul>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex items-center gap-2 border px-3 py-1 rounded-md w-64">
          <CiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="What are you looking for?"
            className="outline-none text-sm w-full"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 ml-4">
          {/* Wishlist */}
          <button onClick={handleWishlistClick} className="relative">
            <FaHeart className="text-2xl text-red-500 hover:scale-110 transition" />
            {userInfo && wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </button>

          {/* Cart */}
          <div className="relative">
            <Link href="/cart">
              <button className="relative">
                <CgShoppingCart className="text-2xl" />
                {totalQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalQty}
                  </span>
                )}
              </button>
            </Link>
          </div>

          {/* User/Login */}
          {userInfo ? (
            <div className="relative user-dropdown">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1 border rounded hover:bg-gray-100"
              >
                <CgUser size={22} />
                <span>{userInfo.name || "User"}</span>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-30">
                  <Link href="/profile">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
                  </Link>
                  <Link href="/profile/change-password">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Change Password</button>
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    onClick={() => {
                      localStorage.clear();
                      setCartItems([]);
                      setTotalQty(0);
                      setUserInfo(null);
                      toast.success("Logged out successfully");
                      router.push("/login");
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="flex items-center gap-2 px-3 py-1 border rounded hover:bg-gray-100">
                <CgUser size={22} />
                <span>Login</span>
              </button>
            </Link>
          )}

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button onClick={() => setToggleMenu(!toggleMenu)}>
              {toggleMenu ? <RiCloseLine size={25} /> : <RiMenu3Line size={25} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {toggleMenu && (
        <div className="md:hidden flex flex-col gap-4 p-4 bg-white shadow-md z-40 absolute top-16 left-0 w-full">
          <Link href="/female" onClick={() => setToggleMenu(false)}>
            <span className="block hover:text-blue-600">Female</span>
          </Link>
          <Link href="/male" onClick={() => setToggleMenu(false)}>
            <span className="block hover:text-blue-600">Male</span>
          </Link>
          <Link href="/kids" onClick={() => setToggleMenu(false)}>
            <span className="block hover:text-blue-600">Kids</span>
          </Link>
          <Link href="/products" onClick={() => setToggleMenu(false)}>
            <span className="block hover:text-blue-600">All Products</span>
          </Link>
          <Link href="/cart" onClick={() => setToggleMenu(false)}>
            <span className="block hover:text-blue-600">Cart</span>
          </Link>
          <button onClick={handleWishlistClick}>
            <span className="block hover:text-blue-600">Wishlist</span>
          </button>
          {userInfo ? (
            <>
              <Link href="/profile" onClick={() => setToggleMenu(false)}>
                <span className="block hover:text-blue-600">Profile</span>
              </Link>
              <button
                className="text-red-500 text-left"
                onClick={() => {
                  localStorage.clear();
                  setCartItems([]);
                  setTotalQty(0);
                  setUserInfo(null);
                  setToggleMenu(false);
                  toast.success("Logged out successfully");
                  router.push("/login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setToggleMenu(false)}>
              <span className="block hover:text-blue-600">Login</span>
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
