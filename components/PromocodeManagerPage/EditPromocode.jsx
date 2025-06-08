"use client"; // Ensures this component is client-side

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function EditPromoCode({ promoId }) {
  // Local state for form data, loading status, and validation errors
  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const router = useRouter()

  // Fetch promo code details when the component mounts or promoId changes
  useEffect(() => {
    if (!promoId) return

    // Fetch the promo code data by ID from the FastAPI backend
    fetch(`https://e-shop-api-1vr0.onrender.com/promocode/?promo_id=${promoId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch promo code')
        return res.json()
      })
      .then(data => {
        const promo = data[0] // Assumes the response is an array with a single object
        if (!promo) {
          toast.error('Promo code not found!')

          setLoading(false)
          return
        }

        // Set form data with the fetched promo code values
        setFormData({
          name: promo.name || '',
          description: promo.description || '',
          discount_type: promo.discount_type || 'percentage',
          discount_value: promo.discount_value || 1,
          expiry_date: promo.expiry_date || '',
          status: promo.status || 'active'
        })
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching promo code:', err)
        toast.error('Failed to load promo code.')

        setLoading(false)
      })
  }, [promoId])

  // Handle input changes and update form data
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Validate form fields before submission
  const validate = () => {
    const errs = {}

    if (!formData.name.trim()) errs.name = 'Name is required.'
    if (!formData.discount_value || formData.discount_value < 1)
      errs.discount_value = 'Discount value must be at least 1.'

    // Additional check for percentage type
    if (formData.discount_type === 'percentage' && formData.discount_value > 100) {
      errs.discount_value = 'Percentage cannot exceed 100.'
    }

    const today = new Date().toISOString().split('T')[0]
    if (!formData.expiry_date || formData.expiry_date < today) {
      toast.error('❌ Expiry date must be in the future.')
    }

    return errs
  }

  // Submit the updated promo code to the backend
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic date check
    const today = new Date().toISOString().split("T")[0]
    if (formData.expiry_date < today) {
      
      toast.error("❌ Expiry date must be in the future.")

      return
    }

    // Attempt to update the promo code via API
    try {
      const res = await fetch(`https://e-shop-api-1vr0.onrender.com/promocode/update/${promoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success("Promo code updated successfully!")

        router.push("/admin/promocode") // Redirect to promo list page
      } else {
        toast.error("Failed to update promo code.")

      }
    } catch (error) {
      toast.error("Something went wrong!")

    }
  }

  // Show a loading state while fetching data
  if (loading) {
    return (
      <div className="loader-container">
        <p className="loader-text">🔄 Loading promo code...</p>
      </div>
    )
  }

  // If no form data was fetched
  if (!formData) return <p className="text-red-500">❌ Failed to load promo code data.</p>

  // Main form UI
  return (
    <form onSubmit={handleSubmit} className="edit-form">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.push('/admin/promocode')}
        className="back-btn"
      >
        ◀ Back
      </button>

      {/* Editable Table Form */}
      <table className="edit-table">
        <tbody>
          {/* Promo Code Name */}
          <tr className="edit-row">
            <td className="edit-label">Name</td>
            <td className="edit-input-cell">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="edit-input"
                required
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </td>
          </tr>

          {/* Description */}
          <tr className="edit-row">
            <td className="edit-label">Description</td>
            <td className="edit-input-cell">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="edit-input"
              />
            </td>
          </tr>

          {/* Discount Type */}
          <tr className="edit-row">
            <td className="edit-label">Discount Type</td>
            <td className="edit-input-cell">
              <select
                name="discount_type"
                value={formData.discount_type}
                onChange={handleChange}
                className="edit-input"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </td>
          </tr>

          {/* Discount Value */}
          <tr className="edit-row">
            <td className="edit-label">Discount Value</td>
            <td className="edit-input-cell">
              <input
                type="number"
                name="discount_value"
                value={formData.discount_value}
                min="1"
                max={formData.discount_type === 'percentage' ? 100 : undefined}
                onChange={handleChange}
                className="edit-input"
                required
              />
              {errors.discount_value && <p className="text-red-500">{errors.discount_value}</p>}
            </td>
          </tr>

          {/* Expiry Date */}
          <tr className="edit-row">
            <td className="edit-label">Expiry Date</td>
            <td className="edit-input-cell">
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="edit-input"
                required
              />
              {errors.expiry_date && <p className="text-red-500">{errors.expiry_date}</p>}
            </td>
          </tr>

          {/* Status Dropdown */}
          <tr className="edit-row">
            <td className="edit-label">Status</td>
            <td className="edit-input-cell">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="edit-input"
              >
                <option value="active">Active</option>
                <option value="non_active">Non-active</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Submit Button */}
      <div className="edit-submit-container">
        <button type="submit" className="edit-submit-button">
          Update Promo Code
        </button>
      </div>
    </form>
  )
}
