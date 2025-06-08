"use client"; // Enables client-side rendering for this component in Next.js

import { useState, useEffect } from "react"; // React hooks
import { useRouter } from "next/navigation"; // Router for client-side navigation
import { toast } from "sonner"; // ✅ Import toast

// Component to edit a product, takes in `productId` as a prop
export default function EditProduct({ productId }) {
  // State to hold product form data
  const [formData, setFormData] = useState(null);
  // State to hold all categories fetched from backend
  const [categories, setCategories] = useState([]);
  // Loading state while fetching product and category data
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Next.js navigation hook

  // Fetch product and category data when component mounts or productId changes
  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      try {
        // Fetch product details and categories in parallel
        const [productRes, categoryRes] = await Promise.all([
          fetch(`https://e-shop-api-1vr0.onrender.com/products/by-id/${productId}`),
          fetch("https://e-shop-api-1vr0.onrender.com/categories/categories"),
        ]);

        // Parse responses as JSON
        const productData = await productRes.json();
        const categoryData = await categoryRes.json();

        // Initialize form data with product data or default values
        setFormData({
          category_id: productData.category_id || "",
          name: productData.name || "",
          description: productData.description || "",
          mrp: productData.mrp || "",
          net_price: productData.net_price || "",
          quantity_in_stock: productData.quantity_in_stock || "",
          image: productData.image || "",
          product_cat: productData.product_cat || "male", // default to male
        });

        // Set categories list
        setCategories(categoryData);
        setLoading(false); // Set loading to false after data fetch
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("❌ Failed to load data.");
        setLoading(false); // Handle error by stopping loading
      }
    };

    fetchData(); // Call async fetch function
  }, [productId]);

  // Handle form input changes and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate the form before submitting
  const validateForm = () => {
    const {
      name,
      description,
      category_id,
      mrp,
      net_price,
      quantity_in_stock,
      image,
      product_cat,
    } = formData;

    // Check all required fields
    if (
      !name ||
      !description ||
      !category_id ||
      !mrp ||
      !net_price ||
      !quantity_in_stock ||
      !image ||
      !product_cat
    ) {
      toast.warning("⚠️ Please fill in all fields.");
      return false;
    }

    // Ensure numerical fields are non-negative
    if (
      parseFloat(mrp) < 0 ||
      parseFloat(net_price) < 0 ||
      parseInt(quantity_in_stock) < 0
    ) {
      toast.warning("⚠️ MRP, Net Price, and Stock Quantity must be non-negative.");
      return false;
    }

    return true;
  };

  // Handle form submission to update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) return;

    try {
      const res = await fetch(
        `https://e-shop-api-1vr0.onrender.com/products/product_update/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData), // Send form data as JSON
        }
      );

      if (res.ok) {
        toast.success("✅ Product updated successfully!");
        router.push("/admin/product"); // Redirect back to product list
      } else {
        const error = await res.json();
        console.error("Update error:", error);
        toast.error("❌ Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("❌ Something went wrong!");
    }
  };

  // Show loading screen while data is being fetched
  if (loading) {
    return (
      <div className="loader-container">
        <p className="loader-text">🔄 Loading users...</p>
      </div>
    );
  }

  // Main form JSX
  return (
    <form onSubmit={handleSubmit} className="edit-form">
      {/* Back button to go back to product list */}
      <button
        type="button"
        onClick={() => router.push("/admin/product")}
        className="back-btn"
      >
        ◀ Back 
      </button>

      {/* Editable fields in table format */}
      <table className="edit-table">
        <tbody>
          {/* Category Dropdown */}
          <tr className="edit-row">
            <td className="edit-label">Category</td>
            <td className="edit-input-cell">
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="edit-input"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </td>
          </tr>

          {/* Other input fields */}
          {[
            ["Name", "name"],
            ["Description", "description"],
            ["MRP", "mrp", "number"],
            ["Net Price", "net_price", "number"],
            ["Stock", "quantity_in_stock", "number"],
            ["Image", "image"],
          ].map(([label, name, type = "text"]) => (
            <tr key={name} className="edit-row">
              <td className="edit-label">{label}</td>
              <td className="edit-input-cell">
                {/* Use textarea for description, input for others */}
                {name === "description" ? (
                  <textarea
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="edit-input"
                    required
                  />
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="edit-input"
                    required
                    min={["mrp", "net_price", "quantity_in_stock"].includes(name) ? 0 : undefined}
                  />
                )}
              </td>
            </tr>
          ))}

          {/* Product Category (Gender/Type) */}
          <tr className="edit-row">
            <td className="edit-label">Type</td>
            <td className="edit-input-cell">
              <select
                name="product_cat"
                value={formData.product_cat}
                onChange={handleChange}
                className="edit-input"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="kids">Kids</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Submit button */}
      <div className="edit-submit-container">
        <button type="submit" className="edit-submit-button">
          Update Product
        </button>
      </div>
    </form>
  );
}
