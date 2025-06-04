'use client';

import { useParams } from 'next/navigation';
import EditProduct from '@/components/ProductManagerPage/EditProduct';
import AdminWithAuth from "@/components/AdminWithAuth";

function EditProductPage() {
  const { id } = useParams();

  return (
    <div className="p-4">
      {id && <EditProduct productId={id} />}
    </div>
  );
}

export default AdminWithAuth(EditProductPage);
