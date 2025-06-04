'use client';
import React from 'react';

import AddProduct from '@/components/ProductManagerPage/AddProduct';
import AdminWithAuth from "@/components/AdminWithAuth";

function AddProductPage() {
  return <AddProduct />;
}

export default AdminWithAuth(AddProductPage);