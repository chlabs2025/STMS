import { IoClose, IoTrash } from "react-icons/io5"
import { MdPerson, MdPhone, MdLocationOn, MdAssignment, MdEdit, MdInventory } from "react-icons/md"
import { useState } from "react"
import api from "../api/axios"

const LocalDetailsModal = ({ isOpen, onClose, local, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  if (!isOpen || !local) return null

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await api.post("/delete_local", {
        localId: local._id
      })
      onDelete(local._id)
      setShowConfirmDelete(false)
      onClose()
      alert("Local deleted successfully!")
    } catch (error) {
      console.error("Error deleting local:", error)
      alert("Failed to delete local. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const pendingQuantity = (local.totalAssignedQuantity || 0) - (local.totalReturnedQuantity || 0)

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal — sits above the 64px bottom nav on mobile */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:inset-0 md:flex md:items-center md:justify-center md:p-4 z-40">
        <div className="relative bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-lg max-h-[calc(100vh-64px)] md:max-h-[90vh] flex flex-col overflow-hidden">

          {/* ─── Profile Header ─── */}
          <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 px-5 pt-5 pb-6 rounded-t-2xl md:rounded-t-2xl">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-1.5 rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <IoClose className="w-5 h-5" />
            </button>

            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30">
                {(local.LocalName || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white truncate">
                  {local.LocalName || "Unnamed"}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="bg-white/20 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    ID: {local.LocalID}
                  </span>
                  <span className="flex items-center gap-1 bg-green-400/30 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-300 rounded-full"></div>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Scrollable Content Area ─── */}
          <div className="flex-1 overflow-y-auto pb-4">
            {/* ─── Quick Stats ─── */}
            <div className="grid grid-cols-3 gap-0 border-b border-gray-100 bg-gray-50/50">
              <div className="text-center py-4 border-r border-gray-100">
                <p className="text-xl font-bold text-blue-600">{local.totalAssignedQuantity || 0}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Assigned</p>
              </div>
              <div className="text-center py-4 border-r border-gray-100">
                <p className="text-xl font-bold text-green-600">{local.totalReturnedQuantity || 0}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Returned</p>
              </div>
              <div className="text-center py-4">
                <p className="text-xl font-bold text-orange-600">{pendingQuantity}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Pending</p>
              </div>
            </div>

            {/* ─── Details ─── */}
            <div className="px-6 py-5 space-y-6">
              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100">
                  <MdPhone className="text-blue-600 text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Phone Number</p>
                  <p className="text-base font-bold text-gray-900 truncate tracking-tight">{local.LocalPhone || "N/A"}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm border border-purple-100">
                  <MdLocationOn className="text-purple-600 text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Address</p>
                  <p className="text-base font-semibold text-gray-900 leading-relaxed">{local.LocalAddress || "N/A"}</p>
                </div>
              </div>

              {/* Payment Info (if available) */}
              {local.payment && (
                <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 shadow-inner">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500 font-bold uppercase">UPI ID</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{local.payment.localUPI || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500 font-bold uppercase">UPI Amount</p>
                      <p className="text-sm font-bold text-blue-600">₹{local.payment.UPIAmount || 0}</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-gray-200 mt-2">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Cash Amount</p>
                        <p className="text-base font-bold text-green-600">₹{local.payment.cashAmount || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── Sticky Action Footer ─── */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-5 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <div className="grid grid-cols-2 gap-4">
              <button
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 text-white rounded-2xl text-base font-bold shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <MdEdit className="text-xl" />
                Edit Profile
              </button>
              <button
                onClick={() => setShowConfirmDelete(true)}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 rounded-2xl text-base font-bold border border-red-100 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <IoTrash className="text-xl" />
                Delete
              </button>
            </div>
          </div>

          {/* ─── Delete Confirmation ─── */}
          {showConfirmDelete && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
              <div className="bg-white rounded-2xl p-5 max-w-xs mx-4 shadow-2xl">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IoTrash className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">Delete Local?</h3>
                  <p className="text-sm text-gray-500">
                    <strong>{local.LocalName}</strong> will be permanently removed. This cannot be undone.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    disabled={isDeleting}
                    className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2.5 bg-red-600 rounded-xl text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LocalDetailsModal