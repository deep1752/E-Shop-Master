'use client'

import ManagersHeader from '@/components/ManagersHeader' // ✅ Import ManagersHeader
import PromocodeManager from '@/components/PromocodeManagerPage/PromocodeManager'
import AdminWithAuth from "@/components/AdminWithAuth";

function PromocodeManagerPage() {
  return (
    <div className="managers-page-container px-6 py-4">
      {/* <ManagersHeader /> ✅ Show Managers Header */}
      <PromocodeManager />
    </div>
  )
}


export default AdminWithAuth(PromocodeManagerPage);