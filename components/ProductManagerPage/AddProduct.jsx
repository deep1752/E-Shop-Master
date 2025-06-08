"use client"; // Enables client-side rendering in Next.js (important for hooks like useState/useEffect)

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For client-side navigation
import { toast } from "sonner";

// Default product object structure used to initialize or add new rows
const defaultProduct = {
  category_id: "",
  name: "",
  description: "",
  mrp: "",
  net_price: "",
  quantity_in_stock: "",
  image: "",
  product_cat: "",
};

export default function AddProduct() {
  // State to hold the list of products being added
  const [products, setProducts] = useState([{ ...defaultProduct }]);

  // State to hold form validation errors
  const [errors, setErrors] = useState([{}]);

  // Fetched categories from the backend
  const [categories, setCategories] = useState([]);

  // Loading state for UI indication
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Fetch product categories when the component mounts
  useEffect(() => {
    setIsLoading(true);
    fetch("https://e-shop-api-1vr0.onrender.com/categories/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to load categories", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Handle changes to any field in a product row
  const handleChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);

    // Clear the error on field change
    const updatedErrors = [...errors];
    if (updatedErrors[index]) updatedErrors[index][field] = "";
    setErrors(updatedErrors);
  };

  // Add a new empty product row
  const addRow = () => {
    setProducts([...products, { ...defaultProduct }]);
    setErrors([...errors, {}]);
  };

  // Remove a product row by index
  const removeRow = (index) => {
    if (products.length === 1) {
      toast.warning("⚠️ You must have at least one product row.");

      return;
    }

    const updated = products.filter((_, i) => i !== index);
    const updatedErrors = errors.filter((_, i) => i !== index);
    setProducts(updated);
    setErrors(updatedErrors);
  };

  // Form validation logic
  const validate = () => {
    let hasError = false;
    const newErrors = products.map((product) => {
      const fieldErrors = {};
      Object.keys(defaultProduct).forEach((key) => {
        const value = product[key];

        // Check for empty fields
        if (!value && value !== 0) {
          fieldErrors[key] = "This field is required.";
          hasError = true;
        } else if (["mrp", "net_price", "quantity_in_stock"].includes(key)) {
          const number = Number(value);
          if (isNaN(number) || number < 0) {
            fieldErrors[key] = "Must be a non-negative number.";
            hasError = true;
          }
        }
      });
      return fieldErrors;
    });

    setErrors(newErrors);
    return !hasError;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const timestamp = new Date().toISOString();

    // Prepare the product list for backend (casting types)
    const cleanProducts = products.map((p) => ({
      ...p,
      category_id: Number(p.category_id),
      mrp: Number(p.mrp),
      net_price: Number(p.net_price),
      quantity_in_stock: Number(p.quantity_in_stock),
      created_at: timestamp,
      updated_at: timestamp,
    }));

    try {
      setIsLoading(true);

      const res = await fetch("https://e-shop-api-1vr0.onrender.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanProducts),
      });

      if (res.ok) {
        toast.success("✅ Products added successfully!");
        router.push("/admin/product"); // Navigate to product list page
      } else {
        const errorText = await res.text();
        console.error("❌ Server error:", errorText);
        toast.error("❌ Failed to add products.");
      }
    } catch (error) {
      console.error("Error submitting products:", error);
      toast.error("❌ Something went wrong while submitting.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-add-container">
      <h1 className="product-add-heading">Add Products</h1>

      {/* Show loader during fetch or submit */}
      {isLoading && (
        <div className="loader">
          🔄 Please wait... loading or submitting data.
        </div>
      )}

      {/* Back button */}
      <div className="product-header">
        <button
          type="button"
          onClick={() => router.push("/admin/product")}
          className="back-btn"
        >
          ◀ Back
        </button>
      </div>

      {/* Form starts */}
      <form onSubmit={handleSubmit}>
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead className="product-table-header">
              <tr>
                <th>Category</th>
                <th>Name</th>
                <th>Description</th>
                <th>MRP</th>
                <th>Net Price</th>
                <th>Stock</th>
                <th>Image</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="product-table-row">
                  {/* Category dropdown */}
                  <td>
                    <select
                      value={product.category_id}
                      onChange={(e) =>
                        handleChange(index, "category_id", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.category_id ? "input-error" : ""
                      }`}
                    >
                      <option value="">Select</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors[index]?.category_id && (
                      <div className="error-text">
                        {errors[index].category_id}
                      </div>
                    )}
                  </td>

                  {/* Name input */}
                  <td>
                    <input
                      type="text"
                      value={product.name}
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

                  {/* Description input */}
                  <td>
                    <input
                      type="text"
                      value={product.description}
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

                  {/* MRP input */}
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={product.mrp}
                      onChange={(e) =>
                        handleChange(index, "mrp", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.mrp ? "input-error" : ""
                      }`}
                    />
                    {errors[index]?.mrp && (
                      <div className="error-text">{errors[index].mrp}</div>
                    )}
                  </td>

                  {/* Net Price input */}
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={product.net_price}
                      onChange={(e) =>
                        handleChange(index, "net_price", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.net_price ? "input-error" : ""
                      }`}
                    />
                    {errors[index]?.net_price && (
                      <div className="error-text">
                        {errors[index].net_price}
                      </div>
                    )}
                  </td>

                  {/* Quantity input */}
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={product.quantity_in_stock}
                      onChange={(e) =>
                        handleChange(index, "quantity_in_stock", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.quantity_in_stock ? "input-error" : ""
                      }`}
                    />
                    {errors[index]?.quantity_in_stock && (
                      <div className="error-text">
                        {errors[index].quantity_in_stock}
                      </div>
                    )}
                  </td>

                  {/* Image URL input */}
                  <td>
                    <input
                      type="text"
                      value={product.image}
                      onChange={(e) =>
                        handleChange(index, "image", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.image ? "input-error" : ""
                      }`}
                    />
                    {errors[index]?.image && (
                      <div className="error-text">{errors[index].image}</div>
                    )}
                  </td>

                  {/* Product type dropdown */}
                  <td>
                    <select
                      value={product.product_cat}
                      onChange={(e) =>
                        handleChange(index, "product_cat", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.product_cat ? "input-error" : ""
                      }`}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="kids">Kids</option>
                      <option value="other">other</option>
                    </select>
                    {errors[index]?.product_cat && (
                      <div className="error-text">
                        {errors[index].product_cat}
                      </div>
                    )}
                  </td>

                  {/* Remove row button */}
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

        {/* Add row and submit buttons */}
        <div className="product-actions">
          <button type="button" onClick={addRow} className="btn add-btn">
            + Add Product
          </button>
          <button type="submit" className="btn submit-btn">
            Submit All
          </button>
        </div>
      </form>
    </div>
  );
}
