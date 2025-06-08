'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAdmin } from '@/context/AdminContext';

export default function AdminProfile() {
  const [adminData, setAdminData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const router = useRouter();
  const { token, admin, login } = useAdmin();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        toast.error('Unauthorized. Please login.');
        router.push('/admin');
        return;
      }

      try {
        const response = await axios.get('https://e-shop-api-1vr0.onrender.com/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        console.log('Fetched user data:', user);
        
        if (user.role !== 'admin') {
          toast.error('Access denied. Admins only.');
          router.push('/admin');
        } else {
          setAdminData(user);
          setNewName(user.name || '');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        toast.error('Failed to load profile. Please login again.');
        localStorage.clear();
        router.push('/admin');
      }
    };

    fetchProfile();
  }, [router]);

  const handleUpdateName = async () => {
    if (!adminData) return;

    try {
      const updatedUser = {
        ...adminData,
        name: newName,
      };

      const response = await axios.put(
        `https://e-shop-api-1vr0.onrender.com/users/update/${adminData.id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = { ...adminData, name: newName };
      setAdminData(updated);
      localStorage.setItem('admin_user', JSON.stringify(updated));
      login(updated, token);

      toast.success('Name updated successfully');
      setEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update name');
    }
  };

  if (!adminData) {
    return (
      <div className="admin-profile-container">
        <div className="admin-profile-loading">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="admin-profile-container">
      <h2 className="admin-profile-title">Admin Profile</h2>
      <div className="admin-profile-details">
        <div className="admin-profile-field">
          <strong className="admin-profile-label">Name:</strong>
          {editing ? (
            <div className="admin-profile-edit-group">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="admin-profile-input"
              />
              <button
                onClick={handleUpdateName}
                className="admin-profile-save-btn"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setNewName(adminData.name);
                }}
                className="admin-profile-cancel-btn"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="admin-profile-display-group">
              <span className="admin-profile-value">
                {adminData.name || 'Not specified'}
              </span>
              <button 
                onClick={() => setEditing(true)} 
                className="admin-profile-edit-btn"
              >
                🖉
              </button>
            </div>
          )}
        </div>

        <div className="admin-profile-field">
          <strong className="admin-profile-label">Email:</strong>
          <span className="admin-profile-value">
            {adminData.email || 'Not specified'}
          </span>
        </div>

        <div className="admin-profile-field">
          <strong className="admin-profile-label">Mobile:</strong>
          <span className="admin-profile-value">
            {adminData.mob_number || 'Not specified'}
          </span>
        </div>

        <div className="admin-profile-field">
          <strong className="admin-profile-label">Role:</strong>
          <span className="admin-profile-value">
            {adminData.role || 'Not specified'}
          </span>
        </div>

        <div className="admin-profile-field">
          <strong className="admin-profile-label">Created At:</strong>
          <span className="admin-profile-value">
            {adminData.created_at 
              ? new Date(adminData.created_at).toLocaleString() 
              : 'Not available'}
          </span>
        </div>
      </div>

      <button
        className="admin-profile-logout-btn"
        onClick={() => {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          localStorage.removeItem('admin_role');
          toast.success('Logged out successfully');
          router.push('/admin');
        }}
      >
        Logout
      </button>
    </div>
  );
}