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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-end md:items-center justify-center md:p-4">
        <div className="relative bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-lg max-h-[92vh] overflow-y-auto">

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

          {/* ─── Quick Stats ─── */}
          <div className="grid grid-cols-3 gap-0 border-b border-gray-100">
            <div className="text-center py-4 border-r border-gray-100">
              <p className="text-lg font-bold text-blue-600">{local.totalAssignedQuantity || 0}</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide mt-0.5">Assigned</p>
            </div>
            <div className="text-center py-4 border-r border-gray-100">
              <p className="text-lg font-bold text-green-600">{local.totalReturnedQuantity || 0}</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide mt-0.5">Returned</p>
            </div>
            <div className="text-center py-4">
              <p className="text-lg font-bold text-orange-600">{pendingQuantity}</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide mt-0.5">Pending</p>
            </div>
          </div>

          {/* ─── Details ─── */}
          <div className="px-5 py-4 space-y-4">
            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <MdPhone className="text-blue-600 text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Phone</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{local.LocalPhone || "N/A"}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MdLocationOn className="text-purple-600 text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Address</p>
                <p className="text-sm font-semibold text-gray-900">{local.LocalAddress || "N/A"}</p>
              </div>
            </div>

            {/* Payment Info (if available) */}
            {local.payment && (
              <>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">Payment Info</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-[10px] text-gray-400 font-medium uppercase">UPI ID</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{local.payment.localUPI || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-[10px] text-gray-400 font-medium uppercase">UPI Amount</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">₹{local.payment.UPIAmount || 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                      <p className="text-[10px] text-gray-400 font-medium uppercase">Cash Amount</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">₹{local.payment.cashAmount || 0}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ─── Action Buttons ─── */}
          <div className="px-5 pb-5 pt-2 space-y-2.5">
            {/* Primary Actions */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 text-white rounded-xl text-sm font-semibold hover:bg-yellow-600 active:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                <MdEdit className="text-base" />
                Edit
              </button>
              <button
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50"
              >
                <MdAssignment className="text-base" />
                Assign Imli
              </button>
            </div>

            {/* Secondary: Close & Delete */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Close
              </button>
              <button
                onClick={() => setShowConfirmDelete(true)}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 active:bg-red-200 transition-colors disabled:opacity-50 border border-red-200"
              >
                <IoTrash className="text-sm" />
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