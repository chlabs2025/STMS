"use client"

import { useState, useEffect } from "react"
import { MdArrowBack, MdPayment, MdHistory, MdReceipt, MdClose } from 'react-icons/md'
import api from "../../api/axios"
import API from "../../api/endpoints"
import toast from "react-hot-toast"
import { useLang } from "../../context/LanguageContext"
import T from "../../i18n/T"

const VendorProfile = ({ vendorId, onBack }) => {
  const { lang } = useLang()
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("purchases") // "purchases" or "payments"
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentForm, setPaymentForm] = useState({ amount: "", method: "Cash", notes: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-orange-600 transition-colors shadow-sm"
          >
            <MdArrowBack className="text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{vendor.name}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              Vendor ID: #{vendor.VendorID} {vendor.phone && `• ${vendor.phone}`}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500 capitalize tracking-wide mb-1">Total Purchases</p>
            <p className="text-2xl font-bold text-gray-900">₹{vendor.totalDebt.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">{vendor.totalRawImliSupplied} KG Raw Imli</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500 capitalize tracking-wide mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-green-600">₹{vendor.totalPaid.toLocaleString()}</p>
          </div>
          <div className={`p-5 rounded-xl border shadow-sm ${balance > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
            <p className={`text-sm font-medium capitalize tracking-wide mb-1 ${balance > 0 ? 'text-red-500' : 'text-gray-500'}`}>Balance Due</p>
            <p className={`text-2xl font-bold ${balance > 0 ? 'text-red-700' : 'text-gray-900'}`}>₹{balance.toLocaleString()}</p>
            {balance > 0 && (
              <button 
                onClick={() => setIsPaymentModalOpen(true)}
                className="mt-3 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <MdPayment /> Settle Payment
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("purchases")}
              className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === "purchases" ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <MdReceipt className="text-lg" />
              Purchase History
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === "payments" ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <MdHistory className="text-lg" />
              Payment History
            </button>
          </div>

          <div className="p-0">
            {activeTab === "purchases" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 capitalize tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 capitalize tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 capitalize tracking-wider">Price / KG</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 capitalize tracking-wider text-right">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {purchases.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No purchases found</td></tr>
                    ) : purchases.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-sm text-gray-900">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.quantity} KG</td>
                        <td className="px-6 py-4 text-sm text-gray-500">₹{p.pricePerKg}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">₹{p.totalCost.toLocaleString()}</td>
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
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 capitalize tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 capitalize tracking-wider">Method</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 capitalize tracking-wider">Notes</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 capitalize tracking-wider text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No payments found</td></tr>
                    ) : payments.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-sm text-gray-900">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.method === 'Online' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {p.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{p.notes || "-"}</td>
                        <td className="px-6 py-4 text-sm font-bold text-green-600 text-right">+ ₹{p.amount.toLocaleString()}</td>
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
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
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

      </div>
    </div>
  )
}

export default VendorProfile

