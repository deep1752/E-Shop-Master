'use client'

import ManagersHeader from '@/components/ManagersHeader' // ✅ Import ManagersHeader
import UserManager from '@/components/UserManagerPage/UserManager'
import AdminWithAuth from "@/components/AdminWithAuth";

function UserManagerPage() {
  return (
    <div className="managers-page-container px-6 py-4">
      {/* <ManagersHeader /> ✅ Show Managers Header */}
      
      <UserManager />
    </div>
  )
}


export default AdminWithAuth(UserManagerPage);