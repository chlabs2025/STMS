import { useState, useEffect } from "react"
import { MdArrowBack, MdPhone, MdLocationOn, MdPayment, MdEdit, MdCheck, MdCancel, MdAssignment, MdInventory, MdHistory, MdFilterList, MdClose } from "react-icons/md"
import api from "../../api/axios"
import API from "../../api/endpoints"
import toast from "react-hot-toast"
import moment from "moment"
import T from "../../i18n/T"

const LocalDetailPage = ({ local, onBack, navigateToAssignImli }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    LocalName: "",
    LocalPhone: "",
    LocalAddress: "",
    upiId: ""
  })
  const [assignmentHistory, setAssignmentHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [activeTab, setActiveTab] = useState("activity")
  const [paymentLogs, setPaymentLogs] = useState([])
  const [loadingPayments, setLoadingPayments] = useState(false)
  const [showDateFilter, setShowDateFilter] = useState(false)
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" })

  const filterByDate = (items, dateField = 'createdAt') => {
    if (!dateFilter.from && !dateFilter.to) return items
    return items.filter(item => {
      const d = new Date(item[dateField])
      d.setHours(0, 0, 0, 0)
      if (dateFilter.from) {
        const from = new Date(dateFilter.from)
        from.setHours(0, 0, 0, 0)
        if (d < from) return false
      }
      if (dateFilter.to) {
        const to = new Date(dateFilter.to)
        to.setHours(0, 0, 0, 0)
        if (d > to) return false
      }
      return true
    })
  }

  useEffect(() => {
    if (local) {
      setFormData({
        LocalName: local.LocalName || "",
        LocalPhone: local.LocalPhone || "",
        LocalAddress: local.LocalAddress || "",
        upiId: local.upiId || (local.payment && local.payment.localUPI) || ""
      })
      fetchAssignmentHistory()
    }
  }, [local])

  const fetchAssignmentHistory = async () => {
    if (!local?.LocalID) return
    try {
      setLoadingHistory(true)
      const res = await api.get(`${API.ASSIGNMENT_HISTORY}?localID=${local.LocalID}`)
      if (res.data && res.data.data) {
        setAssignmentHistory(res.data.data)
      }
    } catch (error) {
      console.error("Error fetching history:", error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const fetchPaymentLogs = async () => {
    if (!local?.LocalID) return
    try {
      setLoadingPayments(true)
      const res = await api.get(API.PAYMENT_LOGS, { params: { localID: local.LocalID } })
      if (res.data && res.data.data) {
        setPaymentLogs(res.data.data)
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setPaymentLogs([])
      }
      console.error("Error fetching payment logs:", error)
    } finally {
      setLoadingPayments(false)
    }
  }

  useEffect(() => {
    if (activeTab === "payments" && paymentLogs.length === 0) {
      fetchPaymentLogs()
    }
  }, [activeTab])

  const handleUpdate = async () => {
    try {
      setIsUpdating(true)
      const res = await api.post(API.UPDATE_LOCAL, {
        localId: local._id,
        ...formData
      })

      // Mutate local object so the UI reflects the change
      local.LocalName = formData.LocalName
      local.LocalPhone = formData.LocalPhone
      local.LocalAddress = formData.LocalAddress
      local.upiId = formData.upiId
      if (local.payment) {
        local.payment.localUPI = formData.upiId
      }

      setIsEditing(false)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating local:", error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (!local) return null

  // Compute summary stats from assignment history
  const totalAssigned = assignmentHistory.filter(item => !item.isReturned && !(item.cleanedQuantity > 0)).reduce((sum, item) => sum + (item.quantity || 0), 0)
  const totalReturned = assignmentHistory.reduce((sum, item) => sum + (item.cleanedQuantity || 0), 0)
  const pendingCount = assignmentHistory.filter(item => !item.isReturned && !(item.cleanedQuantity > 0)).length

  return (
    <div className="min-h-full bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-5 md:space-y-6">

        {/* ─── Header ─── */}
        <div className="flex flex-row items-center justify-between gap-3 md:gap-4 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
            <button
              onClick={onBack}
              className="hidden sm:block p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-orange-600 transition-colors shadow-sm flex-shrink-0 mt-1 sm:mt-0"
            >
              <MdArrowBack className="text-xl" />
            </button>
            <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold text-lg md:text-xl flex-shrink-0">
                {(formData.LocalName || local.LocalName || "U").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    name="LocalName"
                    value={formData.LocalName}
                    onChange={handleChange}
                    className="w-full px-2 py-1 bg-white border border-orange-200 rounded text-lg sm:text-xl md:text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-1"
                  />
                ) : (
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight truncate">
                    {formData.LocalName || local.LocalName || "Unnamed"}
                  </h1>
                )}
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5 truncate">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">
                    ID: {local.LocalID}
                  </span>
                  <span className="inline-flex items-center gap-1 flex-shrink-0">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span className="text-xs font-medium text-green-700"><T k="Active" /></span>
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <MdEdit className="text-sm sm:text-base" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-1 flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <MdCheck className="text-sm sm:text-base" />
                  <span className="hidden sm:inline">Save</span>
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      LocalName: local.LocalName || "",
                      LocalPhone: local.LocalPhone || "",
                      LocalAddress: local.LocalAddress || "",
                      upiId: local.upiId || (local.payment && local.payment.localUPI) || ""
                    })
                  }}
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-1 flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <MdCancel className="text-sm sm:text-base" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── Profile Details Card ─── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-shrink-0">
          <div className="p-4 md:p-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                  <MdPhone className="text-blue-600 text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-400 font-semibold tracking-wider mb-1">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="LocalPhone"
                      value={formData.LocalPhone}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold text-gray-900"
                      style={{ fontSize: '16px' }}
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">{local.LocalPhone || "N/A"}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 border border-purple-100">
                  <MdLocationOn className="text-purple-600 text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-400 font-semibold tracking-wider mb-1">Address</p>
                  {isEditing ? (
                    <textarea
                      name="LocalAddress"
                      value={formData.LocalAddress}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-semibold text-gray-900 resize-none"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">{local.LocalAddress || "N/A"}</p>
                  )}
                </div>
              </div>

              {/* UPI ID */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 border border-green-100">
                  <MdPayment className="text-green-600 text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-400 font-semibold tracking-wider mb-1">Upi Id</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-sm font-semibold text-gray-900"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">{local.upiId || (local.payment && local.payment.localUPI) || "N/A"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Summary Row (if available) */}
            {local.payment && !isEditing && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold tracking-wider mb-1">Upi Amount</p>
                    <p className="text-sm font-bold text-blue-600">₹{local.payment.UPIAmount || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold tracking-wider mb-1">Cash Amount</p>
                    <p className="text-sm font-bold text-green-600">₹{local.payment.cashAmount || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Stats Summary ─── */}
        {!loadingHistory && assignmentHistory.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
            <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 font-medium mb-1 md:mb-2 truncate">Currently Assigned</p>
              <p className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{totalAssigned}<span className="text-[10px] sm:text-xs md:text-sm font-normal text-gray-500 ml-1">kg</span></p>
            </div>
            <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 font-medium mb-1 md:mb-2 truncate">Total Returned</p>
              <p className="text-lg sm:text-2xl md:text-3xl font-bold text-green-600 tracking-tight">{totalReturned}<span className="text-[10px] sm:text-xs md:text-sm font-normal text-gray-500 ml-1">kg</span></p>
            </div>
            <div className={`p-2 sm:p-4 rounded-xl border shadow-sm flex flex-col justify-center ${pendingCount > 0 ? 'bg-amber-50 border-amber-100' : 'bg-white border-gray-100'}`}>
              <p className={`text-[10px] sm:text-xs md:text-sm font-medium mb-1 md:mb-2 truncate ${pendingCount > 0 ? 'text-amber-600' : 'text-gray-500'}`}>Pending</p>
              <p className={`text-lg sm:text-2xl md:text-3xl font-bold tracking-tight ${pendingCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>{pendingCount}</p>
            </div>
          </div>
        )}

        {/* ─── Tabs + Content ─── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab Bar */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex-1 py-3 px-2 md:px-4 text-[11px] sm:text-xs md:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === "activity"
                  ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/30"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <MdInventory className="text-sm sm:text-base md:text-lg hidden sm:block" />
              Activity Log
              {assignmentHistory.length > 0 && (
                <span className={`text-[9px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full ${
                  activeTab === "activity" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
                }`}>{assignmentHistory.length}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`flex-1 py-3 px-2 md:px-4 text-[11px] sm:text-xs md:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === "payments"
                  ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/30"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <MdHistory className="text-sm sm:text-base md:text-lg hidden sm:block" />
              Payment History
            </button>
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className={`px-3 sm:px-4 flex items-center justify-center border-l border-gray-200 transition-colors ${
                showDateFilter || dateFilter.from || dateFilter.to
                  ? "text-orange-600 bg-orange-50"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
              title="Filter by date"
            >
              <MdFilterList className="text-base sm:text-lg" />
            </button>
          </div>

          {/* Date Filter Row */}
          {showDateFilter && (
            <div className="px-4 md:px-6 py-2.5 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center gap-2 flex-shrink-0 overflow-hidden">
              <span className="text-xs font-medium text-gray-500 flex-shrink-0">From</span>
              <input
                type="date"
                value={dateFilter.from}
                onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-orange-300 text-gray-700 min-w-0 flex-shrink"
              />
              <span className="text-xs text-gray-400 flex-shrink-0">to</span>
              <input
                type="date"
                value={dateFilter.to}
                onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-orange-300 text-gray-700 min-w-0 flex-shrink"
              />
              {(dateFilter.from || dateFilter.to) && (
                <button
                  onClick={() => setDateFilter({ from: "", to: "" })}
                  className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  title="Clear filter"
                >
                  <MdClose className="text-sm" />
                </button>
              )}
            </div>
          )}

          {/* Tab Content */}
          <div className="w-full">
            {activeTab === "activity" ? (
              // ─── Activity Log Tab ───
              loadingHistory ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                </div>
              ) : assignmentHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <MdAssignment className="text-4xl mb-3 text-gray-300" />
                  <p className="text-sm font-medium">No activity logs found</p>
                  <p className="text-xs text-gray-400 mt-1">Assignments will appear here once created</p>
                </div>
              ) : (
                <>
                  {/* Table View (Desktop & Mobile) */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="border-b border-gray-100">
                          <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 tracking-wider">Date</th>
                          <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 tracking-wider">Assigned</th>
                          <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 tracking-wider">Returned</th>
                          <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 tracking-wider text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filterByDate(assignmentHistory).map((item, idx) => {
                          const isReturned = item.isReturned || item.cleanedQuantity > 0
                          return (
                            <tr key={item._id || idx} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-2 sm:px-4 md:px-6 py-3 md:py-4">
                                <div className="text-[11px] sm:text-xs md:text-sm font-medium text-gray-900 whitespace-nowrap">
                                  {moment(item.createdAt).format('DD MMM YYYY')}
                                </div>
                                <div className="text-[9px] sm:text-[10px] md:text-[11px] text-gray-400 mt-0.5 whitespace-nowrap">
                                  {moment(item.createdAt).format('h:mm A')}
                                </div>
                              </td>
                              <td className="px-2 sm:px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                                <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-gray-900">
                                  {item.quantity ? `${item.quantity} kg` : "—"}
                                </span>
                              </td>
                              <td className="px-2 sm:px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                                <span className={`text-[11px] sm:text-xs md:text-sm font-semibold ${isReturned ? 'text-green-600' : 'text-gray-400'}`}>
                                  {item.cleanedQuantity ? `${item.cleanedQuantity} kg` : (item.isReturned ? "0 kg" : "—")}
                                </span>
                              </td>
                              <td className="px-2 sm:px-4 md:px-6 py-3 md:py-4 text-right whitespace-nowrap">
                                <span className={`inline-flex items-center px-1.5 sm:px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[9px] sm:text-[10px] md:text-[11px] font-semibold ${
                                  isReturned 
                                    ? 'bg-green-50 text-green-700 border border-green-200' 
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mr-1 sm:mr-1.5 ${isReturned ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                  {isReturned ? "Returned" : "Pending"}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )
            ) : (
              // ─── Payment History Tab ───
              loadingPayments ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                </div>
              ) : paymentLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <MdHistory className="text-4xl mb-3 text-gray-300" />
                  <p className="text-sm font-medium">No payment records found</p>
                  <p className="text-xs text-gray-400 mt-1">Payments will appear here once confirmed</p>
                </div>
              ) : (
                <>
                  {/* Summary bar */}
                  <div className="px-5 md:px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                    <span className="text-xs font-semibold text-gray-500 tracking-wider">{filterByDate(paymentLogs).length} {filterByDate(paymentLogs).length === 1 ? 'payment' : 'payments'}</span>
                    <span className="text-sm font-bold text-green-600">Total: ₹{filterByDate(paymentLogs).reduce((s, l) => s + (l.totalAmount || 0), 0).toLocaleString()}</span>
                  </div>

                  {/* Table View (Desktop & Mobile) */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="border-b border-gray-100">
                          <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 tracking-wider">Date</th>
                          <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 tracking-wider">Cleaned</th>
                          <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 tracking-wider">Rate</th>
                          <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 tracking-wider">Amount</th>
                          <th className="px-2 sm:px-4 md:px-6 py-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 tracking-wider text-right">Method</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filterByDate(paymentLogs).map((log, idx) => (
                          <tr key={log._id || idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-2 sm:px-4 md:px-6 py-3 md:py-3.5 whitespace-nowrap">
                              <div className="text-[11px] sm:text-xs md:text-sm font-medium text-gray-900">{moment(log.createdAt).format('DD MMM YYYY')}</div>
                              <div className="text-[9px] sm:text-[10px] md:text-[11px] text-gray-400 mt-0.5">{moment(log.createdAt).format('h:mm A')}</div>
                            </td>
                            <td className="px-2 sm:px-4 md:px-6 py-3 md:py-3.5 text-[11px] sm:text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">{log.cleanedQty} kg</td>
                            <td className="px-2 sm:px-4 md:px-6 py-3 md:py-3.5 text-[11px] sm:text-xs md:text-sm text-gray-500 whitespace-nowrap">₹{log.rate}/kg</td>
                            <td className="px-2 sm:px-4 md:px-6 py-3 md:py-3.5 text-[11px] sm:text-xs md:text-sm font-bold text-green-600 whitespace-nowrap">₹{log.totalAmount?.toLocaleString()}</td>
                            <td className="px-2 sm:px-4 md:px-6 py-3 md:py-3.5 text-right whitespace-nowrap">
                              <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-[11px] font-semibold ${
                                log.paymentMethod === 'Cash' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {log.paymentMethod}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default LocalDetailPage
