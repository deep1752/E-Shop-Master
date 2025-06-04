"use client"; // Indicates that this code is for the client-side (React component)

import { useState, useEffect } from "react"; // Import React hooks for managing state and lifecycle effects
import { useRouter } from "next/navigation"; // Import the useRouter hook from Next.js for navigation
import { toast } from "sonner";

export default function EditUser({ userId }) {
  // State to hold form data, errors, and loading state
  const [formData, setFormData] = useState(null); // Initialize form data to null
  const [errors, setErrors] = useState({}); // Initialize errors as an empty object
  const [loading, setLoading] = useState(true); // State to track the loading state
  const router = useRouter(); // Create a router instance for navigating programmatically

  // Fetch the user data based on the userId when the component is mounted or userId changes
  useEffect(() => {
    if (!userId) return; // If no userId is provided, don't fetch user data

    // Fetch user data from the backend API using the provided userId
    fetch(`http://127.0.0.1:8000/users/users?user_id=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user"); // Throw error if the request fails
        return res.json(); // Parse the response body as JSON
      })
      .then((data) => {
        const user = data[0]; // Get the user object from the returned data
        // Set the initial form data based on the fetched user data
        setFormData({
          name: user.name || "",
          email: user.email || "",
          password: "", // Password is set to empty because the user needs to set it during editing
          mob_number: user.mob_number || "",
          role: user.role?.toLowerCase() || "customer", // Default to "customer" if role is missing
        });
        setLoading(false); // Set loading to false once the data is fetched
      })
      .catch((err) => {
        console.error("Error fetching user:", err); // Log any errors that occur during the fetch
        setLoading(false); // Stop loading if an error occurs
      });
  }, [userId]); // Re-run the effect if userId changes

  // Handle changes in the input fields (for updating form data)
  const handleChange = (e) => {
    const { name, value } = e.target; // Get name and value from the changed input field
    
    // If the input field is for mobile number, only allow digits and limit to 10 digits
    if (name === "mob_number") {
      if (!/^\d*$/.test(value)) return; // Only digits are allowed
      if (value.length > 10) return; // Limit to 10 digits
    }

    // Update form data state and clear the error message for the updated field
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear the error message for the specific field
  };

  // Validate the form data before submitting
  const validate = () => {
    const newErrors = {}; // Initialize an object to store error messages

    // Check if name is not empty
    if (!formData.name.trim()) newErrors.name = "Name is required";

    // Check if email is not empty and is in a valid email format
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"; // Regex check for valid email format
    }

    // Check if password is not empty and meets minimum length requirement
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"; // Password length validation
    }

    // Check if mobile number is 10 digits
    if (!formData.mob_number.trim()) {
      newErrors.mob_number = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mob_number)) {
      newErrors.mob_number = "Mobile number must be 10 digits"; // Regex check for 10-digit number
    }

    // Check if role is selected
    if (!formData.role.trim()) newErrors.role = "Role is required";

    setErrors(newErrors); // Set the validation errors
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Validate the form data
    if (!validate()) {
      toast.error("❗ Please correct all required fields.");      // Alert if validation fails
      return;
    }

    try {
      // Send the updated user data to the backend API
      const res = await fetch(`http://127.0.0.1:8000/users/update/${userId}`, {
        method: "PUT", // HTTP method is PUT for updating
        headers: { "Content-Type": "application/json" }, // Set content type as JSON
        body: JSON.stringify(formData), // Send form data as JSON in the body
      });

      // Handle response from the backend
      if (res.ok) {
        toast.success("✅ User updated successfully!");

        router.push("/admin/user"); // Navigate to the user list page
      } else {
        const text = await res.text(); // Get the error message from the response
        try {
          const json = JSON.parse(text); // Try parsing JSON response
          toast.error(`❌ Update failed: ${json.detail || "Unknown error"}`);

        } catch {
          toast.error(`❌ Update failed: ${text || res.statusText}`);

        }
      }
    } catch (err) {
      console.error("Update error:", err); // Log any error during the update request
      toast.error("❌ Something went wrong during update.");

    }
  };

  // If the data is still loading, show a loading indicator
  if (loading) {
    return (
      <div className="loader-container">
        <p className="loader-text">🔄 Loading users...</p>
      </div>
    );
  }

  // If user data couldn't be loaded, show an error message
  if (!formData)
    return <p className="text-red-500">❌ Failed to load user data.</p>;

  // Return the form for editing the user
  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <button
        type="button"
        onClick={() => router.push("/admin/user")}
        className="back-btn"
      >
        ◀ Back
      </button>
      <table className="edit-table">
        <tbody>
          {[ // Table rows for each input field
            { label: "Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
            { label: "Mobile Number", name: "mob_number", type: "text" },
          ].map(({ label, name, type }) => (
            <tr key={name} className="edit-row">
              <td className="edit-label">{label}</td>
              <td className="edit-input-cell">
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`edit-input ${errors[name] ? "input-error" : ""}`}
                  required
                />
                {errors[name] && (
                  <small className="error-text">{errors[name]}</small>
                )}
              </td>
            </tr>
          ))}

          <tr className="edit-row">
            <td className="edit-label">Role</td>
            <td className="edit-input-cell">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`edit-input ${errors.role ? "input-error" : ""}`}
                required
              >
                <option value="">-- Select Role --</option>
                {/* <option value="admin">Admin</option> */}
                <option value="customer">Customer</option>
              </select>
              {errors.role && (
                <small className="error-text">{errors.role}</small>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="edit-submit-container">
        <button type="submit" className="edit-submit-button">
          Update User
        </button>
      </div>
    </form>
  );
}
