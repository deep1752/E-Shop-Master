'use client';
import React from 'react';

import AddUser from '@/components/UserManagerPage/AddUser';
import AdminWithAuth from "@/components/AdminWithAuth";

function AddUserPage() {
  return <AddUser />;
}

export default AdminWithAuth(AddUserPage);