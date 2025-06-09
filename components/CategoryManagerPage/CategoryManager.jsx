"use client"; // Enables client-side rendering for this component

// Import required hooks and modules
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For navigating programmatically
import Link from "next/link"; // For linking between pages
import jsPDF from "jspdf"; // Library to generate PDF files
import autoTable from "jspdf-autotable"; // Plugin for jsPDF to create tables
import * as XLSX from "xlsx"; // Library to generate Excel files
import { saveAs } from "file-saver"; // For saving files to user's device
import { toast } from "sonner";

export default function CategoryManager() {
  const router = useRouter(); // Initialize router for navigation

  // State variables
  const [categories, setCategories] = useState([]); // Holds category data
  const [selectedIds, setSelectedIds] = useState([]); // Tracks selected category IDs
  const [selectAll, setSelectAll] = useState(false); // Toggle for selecting all
  const [searchTerm, setSearchTerm] = useState(""); // Search filter
  const [loading, setLoading] = useState(true); // Loading indicator

  // Fetch categories from API when component mounts
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Sort by latest updated or created date
          const sorted = data.sort(
            (a, b) =>
              new Date(b.updated_at || b.created_at) -
              new Date(a.updated_at || a.created_at)
          );
          setCategories(sorted); // Update state
        } else {
          console.error("Expected array, got:", data);
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false)); // Turn off loader
  }, []);

  // Handle single or bulk deletion of categories
  const handleDelete = async (idList) => {
    const confirmed = confirm(
      `Are you sure you want to delete ${idList.length > 1 ? "these categories" : "this category"
      }?`
    );
    if (!confirmed) return;

    try {
      const results = await Promise.all(
        idList.map(async (id) => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/delete/${id}`,
            { method: "DELETE" }
          );

          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to delete category ID ${id}: ${text}`);
          }

          return id; // Return successfully deleted ID
        })
      );

      toast.success("✅ Selected category(s) deleted successfully.");

      // Remove deleted categories from the local list
      setCategories(categories.filter((cat) => !results.includes(cat.id)));
      setSelectedIds([]); // Clear selection
      setSelectAll(false);
    } catch (error) {
      console.error("Delete error:", error);
      if (error.message.includes("linked to one or more products")) {
        toast.error("❌ Cannot delete: One or more selected categories are linked to products.");
      } else {
        toast.warning("⚠️ Please select at least one category to delete.");
      }
    }
  };

  // Toggle select all checkbox
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]); // Deselect all
    } else {
      setSelectedIds(filteredCategories.map((cat) => cat.id)); // Select all visible
    }
    setSelectAll(!selectAll);
  };

  // Toggle selection for one category
  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Filter categories based on search input
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate and download PDF of categories
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Category List", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [["ID", "Name", "Created At", "Updated At"]],
      body: filteredCategories.map((cat) => [
        cat.id,
        cat.name,
        new Date(cat.created_at).toLocaleString(),
        new Date(cat.updated_at).toLocaleString(),
      ]),
    });
    doc.save("categories.pdf");
  };

  // Generate and download Excel file of categories
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredCategories.map((cat) => ({
        ID: cat.id,
        Name: cat.name,
        "Created At": new Date(cat.created_at).toLocaleString(),
        "Updated At": new Date(cat.updated_at).toLocaleString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "categories.xlsx");
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="loader-container">
        <p className="loader-text">🔄 Loading categories...</p>
      </div>
    );
  }

  // Render component UI
  return (
    <div className="product-manager-wrapper">
      {/* Top bar */}
      <div className="header-bar">
        <div className="product-header">
          {/* Back to Admin Dashboard */}
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="back-btn"
          >
            ◀ Back
          </button>
        </div>

        {/* Title */}
        <h2 className="title">Category Manager</h2>

        {/* Action buttons */}
        <div className="actions">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          {/* Add Category Link */}
          <Link href="/admin/category/add">
            <button className="add-button">➕ Add</button>
          </Link>

          {/* Download PDF */}
          <button onClick={downloadPDF} className="download-button">
            📄 Download PDF
          </button>

          {/* Download Excel */}
          <button onClick={downloadExcel} className="download-button">
            📊 Download Excel
          </button>

          {/* Delete selected categories */}
          <button
            onClick={() => {
              if (selectedIds.length === 0) {
                toast.warning("⚠️ Please select at least one category to delete.");

              } else {
                handleDelete(selectedIds);
              }
            }}
            className="delete-button"
          >
            🗑️ Delete Selected ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* Category table */}
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-categories-found">
                  🔍 No categories found matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(category.id)}
                      onChange={() => toggleSelectOne(category.id)}
                    />
                  </td>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{new Date(category.created_at).toLocaleString()}</td>
                  <td>
                    {category.updated_at
                      ? new Date(category.updated_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="action-buttons">
                    <Link href={`/admin/category/edit/${category.id}`}>
                      <button className="edit-button">✏️</button>
                    </Link>
                    <button
                      onClick={() => handleDelete([category.id])}
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
