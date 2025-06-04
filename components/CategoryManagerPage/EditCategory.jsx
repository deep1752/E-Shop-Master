'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner' // ✅ Import toast

/**
 * EditCategory component
 * Props:
 *  - categoryId: ID of the category to be edited
 */
export default function EditCategory({ categoryId }) {
  // State to store form data (category name)
  const [formData, setFormData] = useState(null)
  // State to manage loading indicator
  const [loading, setLoading] = useState(true)
  // Next.js router hook to programmatically navigate
  const router = useRouter()

  // Fetch category data when component mounts or when categoryId changes
  useEffect(() => {
    // If no categoryId provided, exit early
    if (!categoryId) return

    // Fetch category data from FastAPI backend
    fetch(`http://127.0.0.1:8000/categories/categories?category_id=${categoryId}`)
      .then(res => {
        // If the response is not OK, throw an error
        if (!res.ok) throw new Error('Failed to fetch category')
        return res.json()
      })
      .then(data => {
        // Set fetched data into form state
        setFormData({
          name: data.name || ''
        })
        setLoading(false) // Turn off loading indicator
      })
      .catch(err => {
        console.error('Error fetching category:', err)
        setLoading(false) // Turn off loading even on error
      })
  }, [categoryId])

  // Handle input change and update formData state
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission behavior

    try {
      // Send updated data to backend via PUT request
      const res = await fetch(`http://127.0.0.1:8000/categories/category_update/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        // Show success message and navigate back to category manager page
        toast.success('✅ Category updated successfully!')

        router.push('/admin/category')
      } else {
        // If not successful, log error and alert user
        const error = await res.json()
        console.error('Update error:', error)
        toast.error('❌ Failed to update category.')

      }
    } catch (error) {
      // Catch and show any unexpected errors
      console.error('Error updating category:', error)
      toast.error('❌ Something went wrong!')

    }
  }

  // Show loader while fetching category
  if (loading) {
    return (
      <div className="loader-container">
        <p className="loader-text">🔄 Loading users...</p>
      </div>
    )
  }

  // If formData is not available (fetch failed), show error
  if (!formData) return <p className="text-red-500">❌ Failed to load category data.</p>

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      {/* Back button to return to category list */}
      <button
        type="button"
        onClick={() => router.push("/admin/category")}
        className="back-btn"
      >
        ◀ Back 
      </button>

      {/* Form displayed as a table with one editable row for name */}
      <table className="edit-table">
        <tbody>
          <tr className="edit-row">
            <td className="edit-label">Name</td>
            <td className="edit-input-cell">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="edit-input"
                required // Field is mandatory
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Submit button */}
      <div className="edit-submit-container">
        <button type="submit" className="edit-submit-button">
          Update Category
        </button>
      </div>
    </form>
  )
}
