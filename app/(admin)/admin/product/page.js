'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ManagersHeader from '@/components/ManagersHeader' // ✅ Import header
import ProductManager from '@/components/ProductManagerPage/ProductManager'
import AddProduct from '@/components/ProductManagerPage/AddProduct'
import EditProduct from '@/components/ProductManagerPage/EditProduct'
import AdminWithAuth from "@/components/AdminWithAuth";

function ProductManagerPage() {
  const [editingProductId, setEditingProductId] = useState(null)
  const [addingProduct, setAddingProduct] = useState(false)
  const router = useRouter()

  const handleEdit = (id) => {
    setEditingProductId(id)
    setAddingProduct(false)
  }

  const handleAdd = () => {
    setAddingProduct(true)
    setEditingProductId(null)
  }

  const handleSuccess = (message) => {
    alert(message)
    router.refresh()
    setAddingProduct(false)
    setEditingProductId(null)
  }

  return (
    <div className="managers-page-container px-6 py-4">
      

      {!addingProduct && !editingProductId && (
        <ProductManager onEdit={handleEdit} onAdd={handleAdd} />
      )}
      {addingProduct && <AddProduct onSuccess={handleSuccess} />}
      {editingProductId && <EditProduct productId={editingProductId} onSuccess={handleSuccess} />}
    </div>
  )
}


export default AdminWithAuth(ProductManagerPage);