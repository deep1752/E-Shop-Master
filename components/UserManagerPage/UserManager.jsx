"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importing router for page navigation
import Link from "next/link"; // Importing Link to navigate between pages
import jsPDF from "jspdf"; // Importing jsPDF to generate PDFs
import autoTable from "jspdf-autotable"; // Importing autoTable to format tables in PDFs
import * as XLSX from "xlsx"; // Importing XLSX to work with Excel files
import { saveAs } from "file-saver"; // Importing saveAs to save files locally
import { toast } from "sonner";

export default function UserManager({ onEdit, onAdd }) {
  const router = useRouter(); // Initialize router for navigation

  // State to manage users data, search term, loading state, selected users, and select-all checkbox state
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch users data from backend API on component mount
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data); // Store fetched data in the users state
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((err) => {
        console.error("Error fetching users:", err); // Log error if fetching fails
        toast.error("❌ Failed to load users.");

        setLoading(false); // Set loading to false even if there's an error
      });
  }, []);

  // Function to handle user deletion
  const handleDelete = async (idList) => {
    const confirmed = confirm(
      `Are you sure you want to delete ${idList.length > 1 ? "these users" : "this user"}?`
    );
    if (!confirmed) return; // Abort if user cancels the deletion

    try {
      // Map over the selected user IDs and send a DELETE request for each
      const deleteRequests = idList.map((id) =>
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/delete/${id}`, {
          method: "DELETE",
        })
      );

      // Wait for all delete requests to finish
      const results = await Promise.all(deleteRequests);
      const allSuccessful = results.every((res) => res.ok);

      if (allSuccessful) {
        toast.success("User(s) deleted successfully!"); // Success 
        setUsers(users.filter((user) => !idList.includes(user.id))); // Remove deleted users from the state
        setSelectedIds([]); // Reset selected IDs
        setSelectAll(false); // Uncheck the select-all checkbox
      } else {
        toast.error("⚠️ Some deletions failed.");

      }
    } catch (err) {
      console.error("Error deleting user(s):", err); // Log error if deletion fails
      toast.error("⚠️ Something went wrong.");

    }
  };

  // Function to toggle the selection of a single user
  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id)); // Deselect user if already selected
    } else {
      setSelectedIds([...selectedIds, id]); // Select user if not selected
    }
  };

  // Function to toggle the selection of all users
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]); // Deselect all if already selected
    } else {
      setSelectedIds(filteredUsers.map((user) => user.id)); // Select all users in the filtered list
    }
    setSelectAll(!selectAll); // Toggle the select-all state
  };

  // Sort users by their updated or created date (newest first)
  const sortedUsers = [...users].sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at);
    const dateB = new Date(b.updated_at || b.created_at);
    return dateB - dateA; // descending: newest first
  });

  // Filter users based on the search term entered in the search input
  const filteredUsers = sortedUsers
    .filter((user) => user.role === "customer") // 👈 Filter by role
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) // Then filter by search term
    );


  // Function to download the filtered user list as a PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("User List", 14, 10); // Add title to the PDF
    autoTable(doc, {
      startY: 20, // Start the table at Y coordinate 20
      head: [["Name", "Email", "Mobile", "Role"]], // Table headers
      body: filteredUsers.map((user) => [
        user.name,
        user.email,
        user.mob_number,
        user.role,
      ]), // Map filtered users data to table rows
    });
    doc.save("users.pdf"); // Save the PDF file
  };

  // Function to download the filtered user list as an Excel file
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredUsers.map((user) => ({
        Name: user.name,
        Email: user.email,
        Mobile: user.mob_number,
        Role: user.role,
      }))
    );
    const workbook = XLSX.utils.book_new(); // Create a new Excel workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users"); // Add the worksheet to the workbook
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "users.xlsx"); // Save the Excel file
  };

  // Render a loading state while users data is being fetched
  if (loading) {
    return (
      <div className="loader-container">
        <p className="loader-text">🔄 Loading users...</p>
      </div>
    );
  }

  return (
    <div className="product-manager-wrapper">
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
        <h2 className="title">Customer Manager</h2>
        <div className="actions">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {/* Add user button */}
          <Link href="/admin/user/add">
            <button className="add-button" onClick={onAdd}>
              ➕ Add
            </button>
          </Link>
          {/* Download PDF button */}
          <button onClick={downloadPDF} className="download-button">
            📄 Download PDF
          </button>
          {/* Download Excel button */}
          <button onClick={downloadExcel} className="download-button">
            📊 Download Excel
          </button>
          {/* Delete selected users button */}
          <button
            onClick={() => {
              if (selectedIds.length === 0) {
                toast.warning("⚠️ Please select at least one user to delete.");

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

      {/* User table */}
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>
                {/* Checkbox to select all users */}
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-users-found">
                  🔍 No users found matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => toggleSelectOne(user.id)}
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mob_number}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                  <td>
                    {user.updated_at
                      ? new Date(user.updated_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="action-buttons">
                    <Link href={`/admin/user/edit/${user.id}`}>
                      <button className="edit-button" onClick={() => onEdit?.(user.id)}>
                        ✏️
                      </button>
                    </Link>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete([user.id])}
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
