'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { useStateContext } from '../context/StateContext'
import { useUserContext } from '../context/UserContext'

const AllProducts = ({ allproducts }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { id, name, slug, description, mrp, net_price, image } = allproducts
  const router = useRouter()
  const searchParams = useSearchParams()
  const addToWishlist = searchParams.get('addToWishlist')

  const defaultImage = '/images/default.jpg'

  const { wishlistItems, setWishlistItems } = useStateContext()
  const { userInfo: user } = useUserContext()

  // ✅ Check wishlist on load
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user?.id || !id) return

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/user/${user.id}`)
        const wishlist = await res.json()
        const exists = wishlist.some((item) => item.product_id === id)
        setIsWishlisted(exists)
      } catch (err) {
        console.error('Failed to fetch wishlist', err)
      }
    }

    checkWishlist()
  }, [id, user?.id])

  // ✅ Handle add/remove wishlist
  const handleToggleWishlist = async () => {
    if (!user?.id || !id) {
      toast.error('You must be logged in to add this item to the wishlist.')
      localStorage.setItem('wishlist_redirect', slug)
      router.push('/login')
      return
    }

    if (isWishlisted) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/wishlist/delete`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, product_id: id }),
        })

        if (res.ok) {
          toast.success(`${name} removed from wishlist!`)
          setIsWishlisted(false)
          setWishlistItems((prev) => prev.filter((item) => item.product.id !== id))
        } else {
          toast.error(`${name} failed to remove from wishlist.`)
        }
      } catch (err) {
        console.error(err)
        toast.error('Error removing from wishlist.')
      }
    } else {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, product_id: id }),
        })

        if (res.ok) {
          toast.success(`${name} added to your wishlist!`)
          setIsWishlisted(true)
          setWishlistItems((prev) => [...prev, { id: Date.now(), product: allproducts }])
        } else {
          toast.error(`${name} failed to add to wishlist.`)
        }
      } catch (err) {
        console.error(err)
        toast.error('Error adding to wishlist.')
      }
    }
  }

  return (
    <div className="Allproduct-card bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition relative cursor-pointer">

      {/* Wishlist Icon */}
      <div className="wishlist-icon absolute top-2 right-2 cursor-pointer z-10" onClick={handleToggleWishlist}>
        {isWishlisted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 
              12.28 2 8.5 2 5.42 4.42 3 7.5 
              3c1.74 0 3.41.81 4.5 2.09C13.09 
              3.81 14.76 3 16.5 3 19.58 3 
              22 5.42 22 8.5c0 3.78-3.4 
              6.86-8.55 11.54L12 21.35z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white stroke-gray-500 stroke-2" fill="none" viewBox="0 0 24 24">
            <path d="M16.5 3c-1.74 0-3.41.81-4.5 
              2.09C10.91 3.81 9.24 3 7.5 
              3 4.42 3 2 5.42 2 8.5c0 
              3.78 3.4 6.86 8.55 11.54L12 
              21.35l1.45-1.32C18.6 15.36 
              22 12.28 22 8.5 22 5.42 
              19.58 3 16.5 3z" />
          </svg>
        )}
      </div>

      {/* Product Link */}
      <Link href={`/products/${slug}`} key={id}>
        <div className="w-full h-[250px] overflow-hidden rounded mb-3">
          <img
            src={image || defaultImage}
            alt={name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        <p className="Allproduct-name font-semibold text-lg mb-1">{name}</p>
        <p className="Allproduct-description text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        <p className="Allproduct-price text-blue-600 font-bold text-md">₹ {net_price}</p>
      </Link>
    </div>
  )
}

export default AllProducts
