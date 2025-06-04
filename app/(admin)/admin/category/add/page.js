'use client';
import React from 'react';

import AddCategory from '@/components/CategoryManagerPage/AddCategory';
import AdminWithAuth from "@/components/AdminWithAuth";

function AddCategoryPage() {
  return <AddCategory />;
}

export default AdminWithAuth(AddCategoryPage);