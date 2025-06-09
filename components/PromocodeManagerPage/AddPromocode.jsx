"use client"; // This marks the component as a Client Component in Next.js 13+

import { useState } from "react";
import { useRouter } from "next/navigation"; // For programmatic navigation
import { toast } from "sonner";

// Default structure for a single promo code
const defaultPromo = {
  name: "",
  description: "",
  discount_type: "",
  discount_value: "",
  expiry_date: "",
  status: "active", // Default status
};

// Main Component
export default function AddPromoCode() {
  // State to hold all promo rows
  const [promos, setPromos] = useState([{ ...defaultPromo }]);

  // State to hold validation errors per promo row
  const [errors, setErrors] = useState([{}]);

  // State to manage loader while submitting
  const [isLoading, setIsLoading] = useState(false);

  // Router instance to navigate after successful submission
  const router = useRouter();

  // Handle input changes for each field in a row
  const handleChange = (index, field, value) => {
    const updated = [...promos];
    updated[index][field] = value;
    setPromos(updated);

    // Clear the error for the updated field
    const updatedErrors = [...errors];
    if (updatedErrors[index]) updatedErrors[index][field] = "";
    setErrors(updatedErrors);
  };

  // Add a new empty promo row
  const addRow = () => {
    setPromos([...promos, { ...defaultPromo }]);
    setErrors([...errors, {}]);
  };

  // Remove a promo row
  const removeRow = (index) => {
    if (promos.length === 1) {
      toast.warning("⚠️ At least one promo code is required.");
      return;
    }
    setPromos(promos.filter((_, i) => i !== index));
    setErrors(errors.filter((_, i) => i !== index));
  };

  // Validation function for all promo entries
  const validate = () => {
    let hasError = false;
    const now = new Date(); // Current date for expiry validation

    const newErrors = promos.map((promo) => {
      const e = {};

      // Validate name
      if (!promo.name.trim()) {
        e.name = "Name is required.";
        hasError = true;
      }

      // Validate description
      if (!promo.description.trim()) {
        e.description = "Description is required.";
        hasError = true;
      }

      // Validate discount type
      if (!promo.discount_type) {
        e.discount_type = "Discount type is required.";
        hasError = true;
      }

      // Validate discount value
      const value = Number(promo.discount_value);
      if (!promo.discount_value || isNaN(value)) {
        e.discount_value = "Valid discount value is required.";
        hasError = true;
      } else if (promo.discount_type === "percentage") {
        if (value < 1 || value > 100) {
          e.discount_value = "Percentage must be between 1 and 100.";
          hasError = true;
        }
      } else if (promo.discount_type === "fixed" && value <= 0) {
        e.discount_value = "Fixed discount must be greater than 0.";
        hasError = true;
      }

      // Validate expiry date
      if (!promo.expiry_date) {
        e.expiry_date = "Expiry date is required.";
        hasError = true;
      } else if (new Date(promo.expiry_date) <= now) {
        e.expiry_date = "Expiry must be a future date.";
        hasError = true;
      }

      return e;
    });

    setErrors(newErrors);
    return !hasError; // Return true if no errors
  };

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // First, validate the entries
    if (!validate()) {
      toast.error("❌ Please fix validation errors.");
      return;
    }

    try {
      setIsLoading(true); // Show loader

      // Send promo data to backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/promocode/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promos),
      });

      if (res.ok) {
        toast.success("✅ Promo codes added successfully!");
        router.push("/admin/promocode"); // Redirect to promo list
      } else {
        const errMsg = await res.text();
        console.error("❌ Server error:", errMsg);
        toast.error("❌ Failed to add promo codes.");
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      toast.error("❌ Something went wrong.");
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <div className="product-add-container">
      <h1 className="product-add-heading">Add Promo Codes</h1>

      {isLoading && <div className="loader">🔄 Submitting...</div>}

      {/* Back Button */}
      <div className="product-header">
        <button
          type="button"
          onClick={() => router.push("/admin/promocode")}
          className="back-btn"
        >
          ◀ Back
        </button>
      </div>

      {/* Form Starts */}
      <form onSubmit={handleSubmit}>
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead className="product-table-header">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Discount Type</th>
                <th>Discount Value</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {promos.map((promo, index) => (
                <tr key={index} className="product-table-row">
                  {/* Name Input */}
                  <td>
                    <input
                      type="text"
                      value={promo.name}
                      onChange={(e) =>
                        handleChange(index, "name", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.name ? "input-error" : ""
                      }`}
                    />
                    {errors[index]?.name && (
                      <div className="error-text">{errors[index].name}</div>
                    )}
                  </td>

                  {/* Description Input */}
                  <td>
                    <input
                      type="text"
                      value={promo.description}
                      onChange={(e) =>
                        handleChange(index, "description", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.description ? "input-error" : ""
                      }`}
                    />
                    {errors[index]?.description && (
                      <div className="error-text">
                        {errors[index].description}
                      </div>
                    )}
                  </td>

                  {/* Discount Type Dropdown */}
                  <td>
                    <select
                      value={promo.discount_type}
                      onChange={(e) =>
                        handleChange(index, "discount_type", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.discount_type ? "input-error" : ""
                      }`}
                    >
                      <option value="">Select</option>
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed</option>
                    </select>
                    {errors[index]?.discount_type && (
                      <div className="error-text">
                        {errors[index].discount_type}
                      </div>
                    )}
                  </td>

                  {/* Discount Value */}
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={promo.discount_value}
                      onChange={(e) =>
                        handleChange(index, "discount_value", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.discount_value ? "input-error" : ""
                      }`}
                    />
                    {errors[index]?.discount_value && (
                      <div className="error-text">
                        {errors[index].discount_value}
                      </div>
                    )}
                  </td>

                  {/* Expiry Date */}
                  <td>
                    <input
                      type="date"
                      value={promo.expiry_date}
                      onChange={(e) =>
                        handleChange(index, "expiry_date", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.expiry_date ? "input-error" : ""
                      }`}
                    />
                    {errors[index]?.expiry_date && (
                      <div className="error-text">
                        {errors[index].expiry_date}
                      </div>
                    )}
                  </td>

                  {/* Status Dropdown */}
                  <td>
                    <select
                      value={promo.status}
                      onChange={(e) =>
                        handleChange(index, "status", e.target.value)
                      }
                      className="product-input"
                    >
                      <option value="active">Active</option>
                      <option value="non_active">Non-active</option>
                    </select>
                  </td>

                  {/* Remove Button */}
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

        {/* Action Buttons */}
        <div className="product-actions">
          <button type="button" onClick={addRow} className="btn add-btn">
            + Add Promo
          </button>
          <button type="submit" className="btn submit-btn">
            Submit All
          </button>
        </div>
      </form>
    </div>
  );
}
