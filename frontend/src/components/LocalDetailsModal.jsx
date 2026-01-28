import { IoClose, IoTrash } from "react-icons/io5"
import { useState } from "react"
import axios from "../api/axios"

const LocalDetailsModal = ({ isOpen, onClose, local, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  if (!isOpen || !local) return null

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await axios.post("http://localhost:8000/api/delete_local", {
        localId: local._id
      })
      
      // Call parent's onDelete to refresh the list
      onDelete(local._id)
      
      // Close modal and confirmation
      setShowConfirmDelete(false)
      onClose()
      
      // Could add toast notification here
      alert("Local deleted successfully!")
    } catch (error) {
      console.error("Error deleting local:", error)
      alert("Failed to delete local. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">
              Local Details - {local.LocalName}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Local ID
                  </label>
                  <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {local.LocalID}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Local Name
                  </label>
                  <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {local.LocalName || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {local.LocalPhone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Address
                  </label>
                  <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[3rem]">
                    {local.LocalAddress || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Total Assigned Quantity
                  </label>
                  <p className="text-lg font-bold text-blue-600 bg-blue-50 p-3 rounded-lg">
                    {local.totalAssignedQuantity || 0} units
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Total Returned Quantity
                  </label>
                  <p className="text-lg font-bold text-green-600 bg-green-50 p-3 rounded-lg">
                    {local.totalReturnedQuantity || 0} units
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {local.payment && (
              <div className="mt-6 border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      UPI ID
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {local.payment.localUPI || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      UPI Amount
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      ₹{local.payment.UPIAmount || 0}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Cash Amount
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      ₹{local.payment.cashAmount || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setShowConfirmDelete(true)}
              disabled={isDeleting}
              className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoTrash className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete Local"}
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              >
                Close
              </button>
              <button 
                disabled={isDeleting}
                className="px-4 py-2 bg-yellow-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors disabled:opacity-50"
              >
                Edit Local
              </button>
              <button 
                disabled={isDeleting}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                Assign Imli
              </button>
            </div>
          </div>

          {/* Confirmation Dialog */}
          {showConfirmDelete && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <IoTrash className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Delete Local
                    </h3>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete <strong>{local.LocalName}</strong>? 
                    This action cannot be undone and will permanently remove the local from the system.
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    disabled={isDeleting}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
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