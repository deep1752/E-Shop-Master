"use client"; // Tells Next.js this is a client-side component

// Import necessary hooks and libraries
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "sonner";

// Main functional component
export default function PromoCodeManager() {
  const router = useRouter();

  // State variables
  const [promos, setPromos] = useState([]); // Holds all promo codes
  const [searchTerm, setSearchTerm] = useState(""); // For filtering by name
  const [selectedIds, setSelectedIds] = useState([]); // Track selected rows for bulk delete
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch promo code data from backend on component mount
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/promocode/`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched promo data:", data); // Debug log
        if (Array.isArray(data)) {
          // Sort by expiry date, then created_at
          const sorted = data.sort((a, b) => {
            const expiryDiff = new Date(b.expiry_date) - new Date(a.expiry_date);
            if (expiryDiff !== 0) return expiryDiff;
            return new Date(b.created_at) - new Date(a.created_at);
          });
          setPromos(sorted);
        } else {
          console.error("Expected an array but got:", data);
          setPromos([]);
        }
      })
      .catch((error) => console.error("Error fetching promo codes:", error))
      .finally(() => setLoading(false));
  }, []);

  // Single promo code delete handler
  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this promo code?");
    if (confirmed) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/promocode/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Promo code deleted!");
        setPromos(promos.filter((p) => p.id !== id));
      } else {
        toast.error("Failed to delete.");
      }
    }
  };

  // Bulk delete selected promo codes
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return toast.error("Select promos to delete.");
    const confirmed = confirm(`Delete ${selectedIds.length} selected promo codes?`);
    if (confirmed) {
      const results = await Promise.all(
        selectedIds.map((id) =>
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/promocode/delete/${id}`, {
            method: "DELETE",
          })
        )
      );
      toast.success("Deleted selected promo codes.");
      setPromos(promos.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    }
  };

  // Handle checkbox toggle for single item
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Select/deselect all items
  const isAllSelected = promos.length > 0 && selectedIds.length === promos.length;
  const handleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : promos.map((p) => p.id));
  };

  // Filter promos based on search term
  const filteredPromos = promos.filter((promo) =>
    promo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Download promo code list as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Promo Code List", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [["Name", "Type", "Value", "Expiry", "Status"]],
      body: filteredPromos.map((p) => [
        p.name,
        p.discount_type,
        p.discount_value,
        p.expiry_date,
        p.status,
      ]),
    });
    doc.save("promocodes.pdf");
  };

  // Download promo code list as Excel
  const downloadExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(
      filteredPromos.map((p) => ({
        Name: p.name,
        Description: p.description,
        Type: p.discount_type,
        Value: p.discount_value,
        Expiry: p.expiry_date,
        Status: p.status,
      }))
    );
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "PromoCodes");
    const excelBuffer = XLSX.write(book, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "promocodes.xlsx");
  };

  // Loading UI
  if (loading) {
    return <p className="loader-text">🔄 Loading promo codes...</p>;
  }

  return (
    <div className="product-manager-wrapper">
      {/* Header Bar with navigation, search and buttons */}
      <div className="header-bar">
        <div className="product-header">
          <button onClick={() => router.push("/admin")} className="back-btn">
            ◀ Back
          </button>
        </div>
        <h2 className="title">Promo Manager</h2>
        <div className="actions">
          {/* Search box */}
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {/* Add promo code button */}
          <Link href="/admin/promocode/add">
            <button className="add-button">➕ Add</button>
          </Link>
          {/* Export buttons */}
          <button onClick={downloadPDF} className="download-button">
            📄 Download PDF
          </button>
          <button onClick={downloadExcel} className="download-button">
            📊 Download Excel
          </button>
          {/* Bulk delete button */}
          <button onClick={handleBulkDelete} className="delete-button">
            🗑️ Delete Selected ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* Table displaying promo code data */}
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
            {filteredPromos.map((promo) => (
              <tr key={promo.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(promo.id)}
                    onChange={() => handleCheckboxChange(promo.id)}
                  />
                </td>
                <td>{promo.name}</td>
                <td>{promo.description}</td>
                <td>{promo.discount_type}</td>
                <td>{promo.discount_value}</td>
                <td>{promo.expiry_date}</td>
                <td>{promo.status}</td>
                <td className="action-buttons">
                  {/* Edit and Delete Buttons */}
                  <Link href={`/admin/promocode/edit/${promo.id}`}>
                    <button className="edit-button">✏️</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    className="delete-button"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
