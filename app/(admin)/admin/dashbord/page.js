'use client'

import { useEffect, useState } from 'react'
// import ManagersHeader from '@/components/ManagersHeader'
import { motion } from 'framer-motion'
import AdminWithAuth from "@/components/AdminWithAuth";

function ManagersHomePage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    activeUsers: 0,
    totalPromoCodes: 0, // ✅ New
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, categoriesRes, usersRes, promoRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/categories`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/users`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/promocode/`), // ✅ Replace with your actual promo code GET endpoint
        ])
        const [products, categories, users, promocodes] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
          usersRes.json(),
          promoRes.json(),
        ])

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          activeUsers: users.length,
          totalPromoCodes: promocodes.length,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="managers-dashboard-wrapper px-6 py-6">
      {/* <ManagersHeader /> */}

      <div className="dashboard-content-container">
        <h1 className="dashboard-heading">📊 Admin Dashboard</h1>

        {loading ? (
          <p className="dashboard-loader">Loading data...</p>
        ) : (
          <div className="dashboard-cards-grid">
            <motion.div whileHover={{ scale: 1.05 }} className="dashboard-card border-indigo-500">
              <h2>Total Products</h2>
              <p>{stats.totalProducts}</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="dashboard-card border-green-500">
              <h2>Total Categories</h2>
              <p>{stats.totalCategories}</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="dashboard-card border-pink-500">
              <h2>Total Customers</h2>
              <p>{stats.activeUsers}</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="dashboard-card border-yellow-500">
              <h2>Total PromoCodes</h2>
              <p>{stats.totalPromoCodes}</p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}


export default AdminWithAuth(ManagersHomePage);