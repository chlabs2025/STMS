"use client"

import { useState, useEffect } from "react"
import { MdArrowBack, MdPayment, MdHistory, MdReceipt, MdClose, MdDelete } from 'react-icons/md'
import api from "../../api/axios"
import API from "../../api/endpoints"
import toast from "react-hot-toast"
const VendorProfile = ({ vendorId, onBack }) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("purchases") // "purchases" or "payments"
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentForm, setPaymentForm] = useState({ amount: "", method: "Cash", notes: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchVendorData = async () => {
    try {
      setIsLoading(true)
      const res = await api.get(API.GET_VENDOR_HISTORY(vendorId))
      setData(res.data.data)
    } catch (error) {
      toast.error("Failed to fetch vendor details")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVendorData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId])

  const handlePayment = async (e) => {
    e.preventDefault()
    if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
      toast.error("Enter a valid amount")
      return
    }

    try {
      setIsSubmitting(true)
      await api.post(API.PAY_VENDOR(vendorId), {
        amount: Number(paymentForm.amount),
        method: paymentForm.method,
        notes: paymentForm.notes
      })
      toast.success("Payment recorded successfully")
      setIsPaymentModalOpen(false)
      setPaymentForm({ amount: "", method: "Cash", notes: "" })
      fetchVendorData()
    } catch (error) {
      toast.error("Failed to record payment")
      console.error(error)
    } finally {
      setIsSubmitting(false)
      setIsSubmitting(false)
    }
  }

  const handleDeleteVendor = async () => {
    try {
      setIsDeleting(true)
      await api.delete(API.DELETE_VENDOR(vendorId))
      toast.success("Vendor and all related records deleted completely")
      onBack()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete vendor")
      console.error(error)
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const { vendor, purchases, payments } = data
  const balance = vendor.totalDebt - vendor.totalPaid

  return (
    <div className="min-h-full bg-gray-50 p-4 md:p-6 lg:p-8 pb-20">
      <div className="max-w-5xl mx-auto w-full space-y-4 md:space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={onBack}
              className="hidden sm:block p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-orange-600 transition-colors shadow-sm flex-shrink-0 mt-1 sm:mt-0"
            >
              <MdArrowBack className="text-xl" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 truncate">{vendor.name}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-2 truncate">
                Vendor ID: #{vendor.VendorID} {vendor.phone && `• ${vendor.phone}`}
              </p>
            </div>
          </div>
          
          <div className="w-full sm:w-auto flex justify-end">
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
              title="Delete Vendor completely"
            >
              <MdDelete className="text-xl" />
              <span className="sm:hidden font-semibold text-sm">Delete Vendor</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 font-medium mb-1 md:mb-2 truncate">Total Purchases</p>
            <p className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">₹{vendor.totalDebt.toLocaleString()}</p>
          </div>
          <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 font-medium mb-1 md:mb-2 truncate">Total Paid</p>
            <p className="text-lg sm:text-2xl md:text-3xl font-bold text-green-600 tracking-tight">₹{vendor.totalPaid.toLocaleString()}</p>
          </div>
          <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-br opacity-10 ${balance > 0 ? 'from-amber-400 to-red-500' : 'from-emerald-400 to-teal-500'}`}></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 font-medium mb-1 md:mb-2 truncate">Balance Due</p>
                <p className={`text-lg sm:text-2xl md:text-3xl font-bold tracking-tight ${balance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  ₹{balance.toLocaleString()}
                </p>
              </div>
              {balance > 0 && (
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="mt-2 sm:mt-3 w-full py-1.5 sm:py-2 px-2 sm:px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] sm:text-xs md:text-sm font-semibold rounded-lg transition-colors border border-amber-200 shadow-sm flex items-center justify-center gap-1 sm:gap-2"
                >
                  <MdAccountBalanceWallet className="text-sm sm:text-base" />
                  <span>Settle</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("purchases")}
              className={`flex-1 py-3 px-2 md:px-6 text-[11px] sm:text-xs md:text-sm font-medium flex items-center justify-center gap-1.5 md:gap-2 transition-colors whitespace-nowrap ${activeTab === "purchases" ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <MdReceipt className="text-sm sm:text-base md:text-lg hidden sm:block" />
              Purchase History
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`flex-1 py-3 px-2 md:px-6 text-[11px] sm:text-xs md:text-sm font-medium flex items-center justify-center gap-1.5 md:gap-2 transition-colors whitespace-nowrap ${activeTab === "payments" ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <MdHistory className="text-sm sm:text-base md:text-lg hidden sm:block" />
              Payment History
            </button>
          </div>

          <div className="w-full">
            {activeTab === "purchases" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 capitalize tracking-wider">Date</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 capitalize tracking-wider">Quantity</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 capitalize tracking-wider">Price / KG</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 capitalize tracking-wider text-right">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {purchases.length === 0 ? (
                      <tr><td colSpan="4" className="px-2 sm:px-4 md:px-6 py-8 text-center text-gray-500">No purchases found</td></tr>
                    ) : purchases.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50/50">
                        <td className="px-2 sm:px-4 md:px-6 py-4 text-[11px] sm:text-xs md:text-sm text-gray-900">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 text-[11px] sm:text-xs md:text-sm font-medium text-gray-900">{p.quantity} KG</td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 text-[11px] sm:text-xs md:text-sm text-gray-500">₹{p.pricePerKg}</td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 text-[11px] sm:text-xs md:text-sm font-bold text-gray-900 text-right">₹{p.totalCost.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 capitalize tracking-wider">Date</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 capitalize tracking-wider">Method</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 capitalize tracking-wider">Notes</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 capitalize tracking-wider text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.length === 0 ? (
                      <tr><td colSpan="4" className="px-2 sm:px-4 md:px-6 py-8 text-center text-gray-500">No payments found</td></tr>
                    ) : payments.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50/50">
                        <td className="px-2 sm:px-4 md:px-6 py-4 text-[11px] sm:text-xs md:text-sm text-gray-900">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 text-[11px] sm:text-xs md:text-sm text-gray-900">
                          <span className={`px-2 py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-medium ${p.method === 'Online' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {p.method}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 text-[11px] sm:text-xs md:text-sm text-gray-500 max-w-[100px] truncate">{p.notes || "-"}</td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 text-[11px] sm:text-xs md:text-sm font-bold text-green-600 text-right">+ ₹{p.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        {isPaymentModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl ">
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-red-50 text-red-700">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <MdPayment /> Record Payment
                </h3>
                <button 
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-500"
                >
                  <MdClose className="text-xl" />
                </button>
              </div>
              
              <form onSubmit={handlePayment} className="p-5 space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center border border-gray-200 mb-4">
                  <span className="text-sm font-medium text-gray-600">Current Balance:</span>
                  <span className="font-bold text-lg text-red-600">₹{balance.toLocaleString()}</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-bold text-lg"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={paymentForm.method}
                    onChange={e => setPaymentForm({...paymentForm, method: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <input
                    type="text"
                    value={paymentForm.notes}
                    onChange={e => setPaymentForm({...paymentForm, notes: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    placeholder="Reference ID or remark"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !paymentForm.amount}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Payment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl ">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdDelete className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Vendor?</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete <span className="font-bold text-gray-800">{vendor.name}</span> completely? This action cannot be undone and will delete all purchase and payment history.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteVendor}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default VendorProfile

