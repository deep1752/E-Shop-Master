"use client"; // Ensures this component is client-side

import { use } from 'react';
import EditPromoCode from '@/components/PromocodeManagerPage/EditPromoCode';
import AdminWithAuth from "@/components/AdminWithAuth";

function EditPromoCodePage({ params }) {
  // Unwrap the params using `React.use()`
  const { id } = use(params);

  return <EditPromoCode promoId={id} />;
}

export default AdminWithAuth(EditPromoCodePage);
