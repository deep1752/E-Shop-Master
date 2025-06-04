"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

// Default user object structure for adding new users
const defaultUser = {
  name: "",
  email: "",
  password: "",
  mob_number: "",
  role: "customer",
};

export default function AddUser() {
  // State for storing multiple users
  const [users, setUsers] = useState([{ ...defaultUser }]);
  // State for storing error messages
  const [errors, setErrors] = useState([{}]);
  // State for managing the loading state during submission
  const [loading, setLoading] = useState(false);
  // Router to redirect after successful submission
  const router = useRouter();

  // Handle input changes in each user row (name, email, etc.)
  const handleChange = (index, field, value) => {
    const updated = [...users]; // Create a copy of the users array

    // Validation for mobile number (only digits, max length 10)
    if (field === "mob_number") {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }

    // Update the specific field value in the user
    updated[index][field] = value;
    setUsers(updated);

    // Clear any existing error for this field
    const updatedErrors = [...errors];
    if (updatedErrors[index]) updatedErrors[index][field] = "";
    setErrors(updatedErrors);
  };

  // Add a new row to the users list (i.e., add a new user)
  const addRow = () => {
    setUsers([{ ...defaultUser }, ...users]); // Add a new user row
    setErrors([{}, ...errors]); // Add a corresponding empty error object
  };

  // Remove a user row (with validation to prevent removing the last row)
  const removeRow = (index) => {
    if (users.length === 1) {
      toast.warning("⚠️ You cannot remove the last remaining user row.");
      return;
    }

    const updated = users.filter((_, i) => i !== index); // Remove the row by index
    const updatedErrors = errors.filter((_, i) => i !== index); // Remove corresponding errors
    setUsers(updated);
    setErrors(updatedErrors);
  };

  // Validation function to check all fields before submission
  const validate = () => {
    let hasError = false;
    const newErrors = users.map((user) => {
      const fieldErrors = {}; // To store individual field errors

      // Validate each field
      if (!user.name.trim()) fieldErrors.name = "Name is required";
      if (!user.email.trim()) {
        fieldErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim())) {
        fieldErrors.email = "Invalid email format";
      }

      if (!user.password.trim()) {
        fieldErrors.password = "Password is required";
      } else if (user.password.length < 6) {
        fieldErrors.password = "Password must be at least 6 characters";
      }

      if (!user.mob_number.trim()) {
        fieldErrors.mob_number = "Mobile number is required";
      } else if (!/^\d{10}$/.test(user.mob_number.trim())) {
        fieldErrors.mob_number = "Mobile number must be 10 digits";
      }

      if (!user.role.trim()) fieldErrors.role = "Role is required";

      if (Object.keys(fieldErrors).length > 0) hasError = true; // If any errors, mark hasError as true
      return fieldErrors;
    });

    setErrors(newErrors); // Update the errors state
    return !hasError; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate the form before submission
    if (!validate()) {
      toast.error("❗ Please correct the highlighted errors before submitting.");
      return;
    }

    setLoading(true); // Start loading

    try {
      // Loop through each user and submit their data to the API
      for (const user of users) {
        const res = await fetch("http://127.0.0.1:8000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Error:", errorText);
          toast.error(`Failed to add user: ${user.email}`);

          setLoading(false); // Stop loading
          return;
        }
      }

      toast.success("User(s) added successfully!");
      router.push("/admin/user"); // Redirect to the user management page
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Something went wrong while submitting.");

    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    
    <div className="product-add-container">
      {/* Loader overlay when submitting users */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p className="loading-text">Submitting users...</p>
        </div>
      )}

      <h1 className="product-add-heading">Add Users</h1>
      {/* Back button to navigate to the user management page */}
      <button
        type="button"
        onClick={() => router.push("/admin/user")}
        className="back-btn"
      >
        ◀ Back
      </button>

      {/* User addition form */}
      <form onSubmit={handleSubmit}>
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead className="product-table-header">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Mobile Number</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Render each user row */}
              {users.map((user, index) => (
                <tr key={index} className="product-table-row">
                  {/* Input fields for user details */}
                  <td>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) =>
                        handleChange(index, "name", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.name ? "input-error" : ""
                      }`}
                      placeholder="Name"
                    />
                    {/* Display error for name if any */}
                    {errors[index]?.name && (
                      <small className="error-text">{errors[index].name}</small>
                    )}
                  </td>
                  <td>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        handleChange(index, "email", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.email ? "input-error" : ""
                      }`}
                      placeholder="Email"
                    />
                    {errors[index]?.email && (
                      <small className="error-text">
                        {errors[index].email}
                      </small>
                    )}
                  </td>
                  <td>
                    <input
                      type="password"
                      value={user.password}
                      onChange={(e) =>
                        handleChange(index, "password", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.password ? "input-error" : ""
                      }`}
                      placeholder="Password"
                    />
                    {errors[index]?.password && (
                      <small className="error-text">
                        {errors[index].password}
                      </small>
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      value={user.mob_number}
                      onChange={(e) =>
                        handleChange(index, "mob_number", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.mob_number ? "input-error" : ""
                      }`}
                      placeholder="10-digit number"
                      maxLength={10}
                    />
                    {errors[index]?.mob_number && (
                      <small className="error-text">
                        {errors[index].mob_number}
                      </small>
                    )}
                  </td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleChange(index, "role", e.target.value)
                      }
                      className={`product-input ${
                        errors[index]?.role ? "input-error" : ""
                      }`}
                    >
                      <option value="customer">Customer</option>
                      {/* <option value="admin">Admin</option> */}
                    </select>
                    {errors[index]?.role && (
                      <small className="error-text">{errors[index].role}</small>
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

        <div className="product-actions">
          <button type="button" onClick={addRow} className="btn add-btn">
            + Add User
          </button>
          <button type="submit" className="btn submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit All"}
          </button>
        </div>
      </form>

      {/* Loader Styles */}
      <style jsx>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .spinner {
          border: 4px solid #ccc;
          border-top: 4px solid #333;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 0.8s linear infinite;
        }
        .loading-text {
          margin-top: 1rem;
          font-size: 1.1rem;
          font-weight: bold;
          color: #333;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
