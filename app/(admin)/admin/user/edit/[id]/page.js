'use client';

import { useParams } from 'next/navigation';
import EditUser  from '@/components/UserManagerPage/EditUser';
import AdminWithAuth from "@/components/AdminWithAuth";

function EditUserPage() {
  const { id } = useParams();

  return (
    <div className="p-4">
      { id ? <EditUser userId={id} /> : <p className="text-red-500">User ID not found</p> }
    </div>
  );
}

export default AdminWithAuth(EditUserPage);
