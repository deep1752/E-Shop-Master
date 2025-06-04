'use client';

import { useParams } from 'next/navigation';
import EditCategory from '@/components/CategoryManagerPage/EditCategory';
import AdminWithAuth from "@/components/AdminWithAuth";

function EditCategoryPage() {
  const { id } = useParams();

  return (
    <div className="p-4">
      {id ? <EditCategory categoryId={id} /> : <p className="text-red-500">Category ID not found</p>}
    </div>
  );
}

export default AdminWithAuth(EditCategoryPage);