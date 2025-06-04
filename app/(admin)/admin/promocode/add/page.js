'use client';
import React from 'react';

import AddPromocode from '@/components/PromocodeManagerPage/AddPromocode';
import AdminWithAuth from "@/components/AdminWithAuth";

function AddPromocodePage() {
  return <AddPromocode />;
}

export default AdminWithAuth(AddPromocodePage);