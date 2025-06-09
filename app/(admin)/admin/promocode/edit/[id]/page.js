"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminWithAuth from "@/components/AdminWithAuth";

function EditPromoCodePage({ params }) {
  const { id } = use(params);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    fetch(`https://e-shop-api-1vr0.onrender.com/promocode/?promo_id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch promo code");
        return res.json();
      })
      .then((data) => {
        const promo = data[0];
        if (!promo) {
          toast.error("Promo code not found!");
          setLoading(false);
          return;
        }

        setFormData({
          name: promo.name || "",
          description: promo.description || "",
          discount_type: promo.discount_type || "percentage",
          discount_value: promo.discount_value || 1,
          expiry_date: promo.expiry_date || "",
          status: promo.status || "active",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching promo code:", err);
        toast.error("Failed to load promo code.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    if (formData.expiry_date < today) {
      toast.error("❌ Expiry date must be in the future.");
      return;
    }

    try {
      const res = await fetch(
        `https://e-shop-api-1vr0.onrender.com/promocode/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        toast.success("✅ Promo code updated successfully!");
        router.push("/admin/promocode");
      } else {
        toast.error("❌ Failed to update promo code.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">🔄 Loading promo code...</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="text-red-500 text-center py-10">
        <p>❌ Failed to load promo code data.</p>
      </div>
    );
  }

  return (
    <div className="promo-edit-container">
      <form onSubmit={handleSubmit}>
        <button
          type="button"
          onClick={() => router.push("/admin/promocode")}
          className="btn secondary mb-4"
        >
          ◀ Back
        </button>

        <h1 className="text-2xl font-bold mb-6">Edit Promo Code</h1>

        <table className="promo-edit-table">
          <tbody>
            <tr>
              <th>Name</th>
              <td>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  required
                />
                {errors.name && <p className="error">{errors.name}</p>}
              </td>
            </tr>

            <tr>
              <th>Description</th>
              <td>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea"
                  rows={3}
                />
              </td>
            </tr>

            <tr>
              <th>Discount Type</th>
              <td>
                <select
                  name="discount_type"
                  value={formData.discount_type}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </td>
            </tr>

            <tr>
              <th>Discount Value</th>
              <td>
                <input
                  type="number"
                  name="discount_value"
                  value={formData.discount_value}
                  min="1"
                  max={formData.discount_type === "percentage" ? 100 : undefined}
                  onChange={handleChange}
                  className="input"
                  required
                />
                {errors.discount_value && (
                  <p className="error">{errors.discount_value}</p>
                )}
              </td>
            </tr>

            <tr>
              <th>Expiry Date</th>
              <td>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  className="input"
                  required
                />
                {errors.expiry_date && (
                  <p className="error">{errors.expiry_date}</p>
                )}
              </td>
            </tr>

            <tr>
              <th>Status</th>
              <td>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="active">Active</option>
                  <option value="non_active">Non-active</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="form-actions">
          <button type="submit" className="btn primary">
            Update Promo Code
          </button>
        </div>

      </form>
    </div>
  );
}

export default AdminWithAuth(EditPromoCodePage);
