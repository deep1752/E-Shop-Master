"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';

// Default structure for a category object
const defaultCategory = {
  name: "",
};

export default function AddCategory() {
  // State to hold all category rows
  const [categories, setCategories] = useState([{ ...defaultCategory }]);

  // State to track validation errors for each row
  const [errors, setErrors] = useState([{}]);

  // State to handle loading indicator during submission
  const [isLoading, setIsLoading] = useState(false);

  // Next.js router for navigation
  const router = useRouter();

  // Handle input change for any field in a given row
  const handleChange = (index, field, value) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);

    // Clear error for this field if it was previously set
    const updatedErrors = [...errors];
    if (updatedErrors[index]) updatedErrors[index][field] = false;
    setErrors(updatedErrors);
  };

  // Add a new empty row
  const addRow = () => {
    setCategories([...categories, { ...defaultCategory }]);
    setErrors([...errors, {}]);
  };

  // Remove a row by its index, prevent removing the last remaining row
  const removeRow = (index) => {
    if (categories.length === 1) {
      toast.error("⚠️ You cannot remove the last remaining category row.");

      return;
    }

    const updated = categories.filter((_, i) => i !== index);
    const updatedErrors = errors.filter((_, i) => i !== index);
    setCategories(updated);
    setErrors(updatedErrors);
  };

  // Validate all fields in all rows before submission
  const validate = () => {
    let hasError = false;
    const newErrors = categories.map((category) => {
      const fieldErrors = {};
      // Loop through each key in defaultCategory
      Object.keys(defaultCategory).forEach((key) => {
        if (!category[key]) {
          fieldErrors[key] = true;
          hasError = true;
        }
      });
      return fieldErrors;
    });

    setErrors(newErrors);
    return !hasError; // Return true if there are no errors
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate inputs before making requests
    if (!validate()) {
      toast.error("Please fill all fields before submitting.");

      return;
    }

    const timestamp = new Date().toISOString(); // Current time for created_at and updated_at

    try {
      setIsLoading(true); // Show loading state

      // Submit each category to the backend
      for (const category of categories) {
        const res = await fetch("http://127.0.0.1:8000/categories/add/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...category,
            created_at: timestamp,
            updated_at: timestamp,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Error:", errorText);
          toast.error("Failed to add category: " + category.name);

          setIsLoading(false);
          return;
        }
      }

      // Show success message and redirect
      toast.success("✅ Categories added successfully!");

      router.push("/admin/category");
    } catch (error) {
      // Handle unexpected errors
      console.error("❌ Error:", error);
      alert("Something went wrong while submitting.");

    } finally {
      setIsLoading(false); // Always stop loading regardless of outcome
    }
  };

  // JSX return block for the form UI
  return (
    <div className="product-add-container">
      <h1 className="product-add-heading">Add Categories</h1>

      {/* Show loader while submitting */}
      {isLoading && (
        <div className="loader">🔄 Please wait... submitting categories.</div>
      )}

      {/* Back button */}
      <div className="product-header">
        <button
          type="button"
          onClick={() => router.push("/admin/category")}
          className="back-btn"
        >
          ◀ Back
        </button>
      </div>

      {/* Category add form */}
      <form onSubmit={handleSubmit}>
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead className="product-table-header">
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={index} className="product-table-row">
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={category.name}
                      onChange={(e) =>
                        handleChange(index, "name", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.name ? "input-error" : ""
                      }`}
                    />
                    {/* Show inline error if field is empty */}
                    {errors[index]?.name && (
                      <div className="error-text">This field is required.</div>
                    )}
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action buttons */}
        <div className="product-actions">
          <button type="button" onClick={addRow} className="btn add-btn">
            + Add Category
          </button>
          <button type="submit" className="btn submit-btn" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit All"}
          </button>
        </div>
      </form>
    </div>
  );
}
