"use client"; // Enables client-side rendering in Next.js 13+ App Router

import { useEffect, useState } from "react"; // React hooks for managing state and side effects
import { useRouter } from "next/navigation"; // Hook to programmatically navigate between routes
import Link from "next/link"; // Next.js link component for client-side navigation
import { deleteProductById } from "./DeleteProduct"; // Custom delete function for product
import jsPDF from "jspdf"; // PDF generation library
import autoTable from "jspdf-autotable"; // Plugin for table support in jsPDF
import * as XLSX from "xlsx"; // Excel generation library
import { saveAs } from "file-saver"; // Utility to save files on client-side
import { toast } from "sonner"; // ✅ Import toast

export default function ProductManager({ onEdit, onAdd }) {
  const router = useRouter(); // Initialize the router

  // State variables
  const [products, setProducts] = useState([]); // All fetched products
  const [searchTerm, setSearchTerm] = useState(""); // Text input for filtering
  const [selectedIds, setSelectedIds] = useState([]); // IDs of selected products for bulk actions
  const [loading, setLoading] = useState(true); // Loading state for API call

  // Fetch products from the backend on component mount
  useEffect(() => {
    fetch("https://e-shop-api-1vr0.onrender.com/products/all_products")
      .then((res) => res.json())
      .then((data) => {
        // Sort products by most recently updated or created
        const sortedProducts = data.sort(
          (a, b) =>
            new Date(b.updated_at || b.created_at) -
            new Date(a.updated_at || a.created_at)
        );
        setProducts(sortedProducts); // Update state
      })
      .catch((error) => console.error("Error fetching products:", error))
      .finally(() => setLoading(false)); // Stop loading
  }, []);

  // Handle single product deletion
  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (confirmed) {
      const success = await deleteProductById(id); // Call API
      if (success) {
        toast.success("Product deleted successfully!");
        setProducts(products.filter((p) => p.id !== id)); // Remove from state
      } else {
        toast.error("Failed to delete product.");
      }
    }
  };

  // Handle bulk delete of selected products
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one product to delete.");
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedIds.length} selected products?`
    );

    if (confirmed) {
      const deleteResults = await Promise.all(
        selectedIds.map((id) => deleteProductById(id))
      );

      const failed = deleteResults.filter((r) => !r).length;

      if (failed > 0) {
        toast.error(`Some deletions failed (${failed}).`);
      } else {
        toast.success("Selected products deleted successfully!");
      }

      setProducts(products.filter((p) => !selectedIds.includes(p.id))); // Remove deleted
      setSelectedIds([]); // Clear selection
    }
  };

  // Handle checkbox change for selecting/deselecting a product
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Determine if all items are selected
  const isAllSelected =
    products.length > 0 && selectedIds.length === products.length;

  // Toggle select/deselect all
  const handleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : products.map((p) => p.id));
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate a downloadable PDF of the filtered products
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Product List", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [
        [
          "Name",
          "Description",
          "Category",
          "Type",
          "MRP",
          "Net Price",
          "Stock",
        ],
      ],
      body: filteredProducts.map((p) => [
        p.name,
        p.description,
        p.category_name,
        p.product_cat,
        `₹${p.mrp}`,
        `₹${p.net_price}`,
        p.quantity_in_stock,
      ]),
    });
    doc.save("products.pdf"); // Save file
  };

  // Generate downloadable Excel file of filtered products
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredProducts.map((p) => ({
        Name: p.name,
        Description: p.description,
        Category: p.category_name,
        Type: p.product_cat,
        MRP: p.mrp,
        "Net Price": p.net_price,
        Stock: p.quantity_in_stock,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "products.xlsx"); // Save file
  };

  // Show loading screen while fetching data
  if (loading) {
    return (
      <div className="loader-container">
        <p className="loader-text">🔄 Loading products...</p>
      </div>
    );
  }

  // Main UI rendering
  return (
    <div className="product-manager-wrapper">
      {/* Header Section */}
      <div className="header-bar">
        <div className="product-header">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="back-btn"
          >
            ◀ Back
          </button>
        </div>
        <h2 className="title">Product Manager</h2>

        {/* Action buttons */}
        <div className="actions">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <Link href="/admin/product/add">
            <button className="add-button" onClick={onAdd}>
              ➕ Add
            </button>
          </Link>

          <button onClick={downloadPDF} className="download-button">
            📄 Download PDF
          </button>

          <button onClick={downloadExcel} className="download-button">
            📊 Download Excel
          </button>

          <button
            onClick={handleBulkDelete}
            className="delete-button"
          >
            🗑️ Delete Selected ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={isAllSelected}
                />
              </th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>MRP</th>
              <th>Net Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-products-found">
                  🔍 No products found matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => handleCheckboxChange(product.id)}
                    />
                  </td>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td className="text-sm text-gray-700">{product.description}</td>
                  <td>{product.category_name}</td>
                  <td className="capitalize">{product.product_cat}</td>
                  <td>₹{product.mrp}</td>
                  <td>₹{product.net_price}</td>
                  <td>{product.quantity_in_stock}</td>
                  <td className="action-buttons">
                    <Link href={`/admin/product/edit/${product.id}`}>
                      <button
                        className="edit-button"
                        onClick={() => onEdit(product.id)}
                      >
                        ✏️
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="delete-button"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
