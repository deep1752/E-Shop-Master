"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminWithAuth from "@/components/AdminWithAuth";

function EditPromoCodePage({ params }) {
  const { id } = params;
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/promocode/?promo_id=${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch promo code');
        return res.json();
      })
      .then(data => {
        const promo = data[0];
        if (!promo) {
          toast.error('Promo code not found!');
          setLoading(false);
          return;
        }

        setFormData({
          name: promo.name || '',
          description: promo.description || '',
          discount_type: promo.discount_type || 'percentage',
          discount_value: promo.discount_value || 1,
          expiry_date: promo.expiry_date || '',
          status: promo.status || 'active'
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching promo code:', err);
        toast.error('Failed to load promo code.');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    if (formData.expiry_date < today) {
      toast.error("❌ Expiry date must be in the future.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/promocode/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Promo code updated successfully!");
        router.push("/admin/promocode");
      } else {
        toast.error("Failed to update promo code.");
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

  if (!formData) return <p className="text-red-500 text-center py-10">❌ Failed to load promo code data.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => router.push('/admin/promocode')}
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ◀ Back
        </button>

        <h1 className="text-2xl font-bold mb-6">Edit Promo Code</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type</label>
              <select
                name="discount_type"
                value={formData.discount_type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Discount Value</label>
              <input
                type="number"
                name="discount_value"
                value={formData.discount_value}
                min="1"
                max={formData.discount_type === 'percentage' ? 100 : undefined}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.discount_value && <p className="text-red-500 text-sm">{errors.discount_value}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.expiry_date && <p className="text-red-500 text-sm">{errors.expiry_date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="active">Active</option>
                <option value="non_active">Non-active</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Promo Code
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminWithAuth(EditPromoCodePage);



