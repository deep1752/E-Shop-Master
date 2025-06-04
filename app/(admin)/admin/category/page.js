'use client'




import ManagersHeader from '@/components/ManagersHeader' // ✅ Import ManagersHeader
import CategoryManager from '@/components/CategoryManagerPage/CategoryManager'
import AdminWithAuth from "@/components/AdminWithAuth";


function CategoryManagerPage() {


  return (
    <div className="managers-page-container px-6 py-4">
      {/* <ManagersHeader /> ✅ Show Managers Header */}
      <CategoryManager />
    </div>
  )
}


export default AdminWithAuth(CategoryManagerPage);