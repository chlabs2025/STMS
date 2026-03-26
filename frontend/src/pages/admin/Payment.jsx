"use client"

import { useState, useEffect } from "react"
import { MdPayment, MdRefresh, MdSearch, MdError, MdKeyboardArrowDown, MdKeyboardArrowUp, MdCheckCircle, MdMoney, MdPayment as MdOnlinePayment, MdHistory } from 'react-icons/md'

import api from "../../api/axios"
import PaymentLogs from "./PaymentLogs"


const Payment = () => {
    const [locals, setLocals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredLocals, setFilteredLocals] = useState([])
    const [expandedLocalId, setExpandedLocalId] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState("Cash")
    const [orderData, setOrderData] = useState(null)
    const [orderLoading, setOrderLoading] = useState(false)
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [paymentResult, setPaymentResult] = useState(null)
    const [paymentError, setPaymentError] = useState(null)
    const [activeTab, setActiveTab] = useState("payment")
    const [assignmentHistory, setAssignmentHistory] = useState([])
    const [historyLoading, setHistoryLoading] = useState(false)


    useEffect(() => {
        fetchLocals()
    }, [])

    const fetchLocals = async (silent = false) => {
        try {
            if (!silent) setLoading(true)
            setError(null)
            const response = await api.post("/return_local")
            if (response.data.data) {
                setLocals(response.data.data)
                setFilteredLocals(response.data.data)
            }
        } catch (error) {
            console.error("Error fetching locals:", error)
            if (!silent) setError("Failed to load locals. Please try again.")
        } finally {
            if (!silent) setLoading(false)
        }
    }

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            const filtered = locals.filter(
                (local) =>
                    local.LocalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    local.LocalPhone?.toString().includes(searchTerm) ||
                    local.LocalID?.toString().includes(searchTerm)
            )
            setFilteredLocals(filtered)
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [searchTerm, locals])

    const fetchAssignmentHistory = async (localID) => {
        try {
            setHistoryLoading(true)
            const response = await api.get("/assignment-history", { params: { localID } })
            setAssignmentHistory(response.data?.data || [])
        } catch (error) {
            console.error("Error fetching assignment history:", error)
            setAssignmentHistory([])
        } finally {
            setHistoryLoading(false)
        }
    }

    const fetchOrderReference = async (localID) => {
        try {
            setOrderLoading(true)
            setOrderData(null)
            setPaymentResult(null)
            setPaymentError(null)
            const response = await api.post("/order-reference", { localID: String(localID) })
            setOrderData(response.data.data)
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to fetch order details"
            if (msg.includes("No pending")) {
                setOrderData(null)
                setPaymentError("No pending returns for this local")
            } else {
                setPaymentError(msg)
            }
        } finally {
            setOrderLoading(false)
        }
    }

    const toggleExpand = (local) => {
        if (expandedLocalId === local._id) {
            setExpandedLocalId(null)
            setOrderData(null)
            setPaymentResult(null)
            setPaymentError(null)
        } else {
            setExpandedLocalId(local._id)
            setPaymentMethod("Cash")
            setPaymentResult(null)
            setPaymentError(null)
            setActiveTab("payment")
            setAssignmentHistory([])
            fetchOrderReference(local.LocalID)
            fetchAssignmentHistory(local.LocalID)
        }
    }


    const handleConfirmPayment = async (localId) => {
        if (!orderData) return
        try {
            setPaymentLoading(true)
            setPaymentError(null)
            setPaymentResult(null)
            const response = await api.post("/confirm-payment", {
                localId: localId,
                method: paymentMethod,
                // Online Step 1: no status sent → backend creates PENDING
                // Cash: no status needed → backend always SUCCESS
            })
            setPaymentResult(response.data.data)
            // Cash ke baad silent refresh + collapse
            if (paymentMethod === "Cash") {
                await fetchLocals(true)
            }
        } catch (error) {
            setPaymentError(error.response?.data?.message || "Payment failed. Please try again.")
        } finally {
            setPaymentLoading(false)
        }
    }

    // Online Step 2: Admin confirms SUCCESS or REJECTED
    const handleOnlineStatus = async (localId, newStatus) => {
        try {
            setPaymentLoading(true)
            setPaymentError(null)
            const response = await api.post("/confirm-payment", {
                localId: localId,
                method: "Online",
                status: newStatus,
            })
            setPaymentResult(response.data.data)
            await fetchLocals(true)
        } catch (error) {
            setPaymentError(error.response?.data?.message || "Status update failed.")
        } finally {
            setPaymentLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="p-3 md:p-6 lg:p-8 bg-white min-h-screen flex items-center justify-center overflow-x-hidden">
                <div className="text-center">
                    <div className="bg-orange-50 w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm border border-orange-200">
                        <div className="w-8 h-8 md:w-12 md:h-12 border-3 md:border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-gray-800 mb-1 md:mb-2">Loading Payments...</div>
                    <div className="text-gray-600 text-sm md:text-base">Please wait while we fetch the data</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-3 md:p-6 lg:p-8 bg-white min-h-screen flex items-center justify-center overflow-x-hidden">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md text-center border border-orange-200 mx-3">
                    <div className="bg-red-50 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <MdError className="text-2xl md:text-3xl text-red-600" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Error Loading Data</h3>
                    <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">{error}</p>
                    <button
                        onClick={fetchLocals}
                        className="px-6 md:px-8 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200 shadow-md flex items-center justify-center gap-2 mx-auto border border-orange-600 text-sm md:text-base"
                    >
                        <MdRefresh className="text-lg" />
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-3 md:p-6 lg:p-8 bg-white min-h-screen overflow-x-hidden">
            <div className="mb-4 md:mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 md:mb-6 gap-3 md:gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="bg-white p-2 md:p-3 rounded-xl shadow-sm border border-orange-500/30">
                            <MdPayment className="text-2xl md:text-3xl text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-4xl font-bold text-gray-900">Payment</h2>
                            <p className="text-gray-600 font-medium text-xs md:text-base">Manage payments for locals</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchLocals}
                        className="px-4 md:px-6 py-2 md:py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 flex items-center gap-2 self-start lg:self-auto shadow-md font-semibold border border-orange-600 text-sm"
                        aria-label="Refresh payments list"
                    >
                        <MdRefresh className="text-lg" />
                        Refresh
                    </button>
                </div>

                {/* Search Bar with Count */}
                <div className="bg-white rounded-2xl border border-orange-500/20 shadow-md p-3 md:p-4 mb-4 md:mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 mr-3 md:mr-6">
                            <div className="bg-orange-50 p-2 md:p-2.5 rounded-xl mr-3 md:mr-4 border border-orange-100">
                                <MdSearch className="text-orange-600 text-lg md:text-xl" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, phone, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                aria-label="Search locals"
                                className="flex-1 border-none outline-none text-gray-900 placeholder-gray-400 bg-transparent text-sm md:text-base font-medium"
                                style={{ fontSize: '16px' }}
                            />
                        </div>
                        <div className="bg-orange-50 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-orange-100 flex-shrink-0">
                            <div className="text-xs md:text-sm text-gray-700 font-medium">
                                <span className="font-bold text-orange-600">{filteredLocals.length}</span> <span className="hidden sm:inline">locals</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {filteredLocals.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 md:p-12 text-center shadow-lg border border-orange-500/20">
                    <div className="bg-gray-50 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <MdSearch className="text-3xl md:text-4xl text-gray-300" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                        {searchTerm ? "No matching locals found" : "No locals available"}
                    </h3>
                    <p className="text-gray-500 text-sm md:text-lg mb-4 md:mb-6">
                        {searchTerm ? "Try adjusting your search criteria" : "Start by adding some locals to the system"}
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="px-6 py-3 bg-white text-orange-600 border-2 border-orange-500 rounded-xl hover:bg-orange-50 transition-all duration-200 font-semibold shadow-sm"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3 md:space-y-6">
                    {filteredLocals.map((local) => {
                        const isExpanded = expandedLocalId === local._id
                        const cleanedQty = local.totalReturnedQuantity || 0
                        const assignedQty = local.totalAssignedQuantity || 0

                        return (
                            <div key={local._id} className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-orange-500 ring-1 ring-orange-500/20 shadow-orange-100 shadow-xl' : 'border-gray-200 hover:border-orange-300'}`}>
                                {/* Header Row */}
                                <div className={`p-2.5 md:p-3 flex items-center justify-between cursor-pointer transition-colors ${isExpanded ? 'bg-orange-50/30' : 'bg-white hover:bg-gray-50'}`} onClick={() => toggleExpand(local)}>
                                    <div className="flex items-center space-x-2.5 md:space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className={`h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center shadow-sm border-2 transition-all duration-300 ${isExpanded ? 'bg-orange-500 border-orange-400' : 'bg-white border-orange-500'}`}>
                                                <span className={`text-base md:text-lg font-bold ${isExpanded ? 'text-white' : 'text-orange-600'}`}>
                                                    {(local.LocalName || "U").charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm md:text-lg font-bold text-gray-900">
                                                {local.LocalName || "Unnamed Local"}
                                            </div>
                                            <div className="mt-0.5 flex items-center gap-1.5 md:gap-2">
                                                <span className="text-[10px] md:text-xs font-semibold text-gray-500">ID:</span>
                                                <span className="px-1.5 md:px-2 py-0.5 rounded-md text-[9px] md:text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                                                    {local.LocalID}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 border ${isExpanded
                                            ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-orange-300 hover:text-orange-600'
                                            }`}
                                    >
                                        <span className="text-sm">Pay</span>
                                        {isExpanded ? <MdKeyboardArrowUp className="text-lg" /> : <MdKeyboardArrowDown className="text-lg" />}
                                    </button>
                                </div>

                                {/* Tab Navigation */}
                                {isExpanded && (
                                    <div className="px-4 md:px-8 pt-4 bg-white border-t border-gray-100 flex gap-4 md:gap-8">
                                        <button
                                            onClick={() => setActiveTab("payment")}
                                            className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'payment' ? 'text-orange-600 border-orange-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <MdPayment />
                                                <span>Payment</span>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("history")}
                                            className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'history' ? 'text-orange-600 border-orange-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <MdHistory />
                                                <span>History</span>
                                            </div>
                                        </button>
                                    </div>
                                )}

                                {/* Expanded Content Area */}
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'opacity-100 min-h-[400px]' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-4 md:p-8 bg-white border-t border-gray-50">
                                        <div className="relative">
                                            {/* Payment Tab Content */}
                                            <div className={`transition-all duration-300 ease-in-out ${activeTab === 'payment' ? 'opacity-100 visible translate-y-0 relative' : 'opacity-0 invisible -translate-y-2 absolute inset-0 pointer-events-none'}`}>
                                                {orderLoading ? (
                                                    <div className="flex items-center justify-center py-12">
                                                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                                        <span className="ml-3 text-gray-600 font-medium">Loading order details...</span>
                                                    </div>
                                                ) : paymentError && !orderData && !paymentResult ? (
                                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                                                        <p className="text-yellow-800 font-medium">{paymentError}</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col lg:flex-row justify-between gap-5 md:gap-10">
                                                        <div className="lg:w-2/3">
                                                            <div className="mb-4 md:mb-8 p-3 md:p-4 bg-orange-50/50 rounded-xl border border-orange-100 flex items-center gap-3">
                                                                <div className="bg-orange-500 text-white rounded-lg p-2 flex-shrink-0">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">Weekly Period</p>
                                                                    {(() => {
                                                                        const date = local.updatedAt ? new Date(local.updatedAt) : new Date();
                                                                        const day = date.getDay();
                                                                        const diff = date.getDate() - day + (day >= 4 ? 4 : -3);
                                                                        const start = new Date(date);
                                                                        start.setDate(diff);
                                                                        const end = new Date(start);
                                                                        end.setDate(start.getDate() + 6);
                                                                        const fmt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                                                                        return (
                                                                            <p className="text-sm md:text-base font-bold text-gray-800 mt-0.5">
                                                                                {fmt(start)} <span className="text-orange-400 mx-1">→</span> {fmt(end)}
                                                                            </p>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            </div>

                                                            {/* Desktop Table */}
                                                            <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200">
                                                                <table className="w-full text-left">
                                                                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                                                                        <tr>
                                                                            <th className="px-6 py-4">Date & Time</th>
                                                                            <th className="px-6 py-4">Assigned Quantity</th>
                                                                            <th className="px-6 py-4">Cleaned Qty.</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                                                                        {assignmentHistory.length > 0 ? (
                                                                            assignmentHistory.map((entry, idx) => (
                                                                                <tr key={entry._id || idx} className="hover:bg-gray-50/50 transition-colors">
                                                                                    <td className="px-6 py-4 font-medium">
                                                                                        <div>{new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                                                                                        <div className="text-xs text-gray-400 mt-0.5">{new Date(entry.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
                                                                                    </td>
                                                                                    <td className="px-6 py-4">{entry.assignedQuantity}</td>
                                                                                    <td className="px-6 py-4 text-gray-400">—</td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr className="hover:bg-gray-50/50 transition-colors">
                                                                                <td className="px-6 py-4 font-medium text-gray-400" colSpan="3">
                                                                                    {historyLoading ? "Loading..." : "No assignment records found"}
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                        <tr className="bg-orange-50/50 text-gray-900 font-semibold border-t-2 border-orange-200">
                                                                            <td className="px-6 py-4">Total</td>
                                                                            <td className="px-6 py-4">{assignedQty} KG</td>
                                                                            <td className="px-6 py-4 text-green-700">{cleanedQty} KG</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {/* Mobile cards */}
                                                            <div className="md:hidden space-y-2">
                                                                {assignmentHistory.length > 0 ? (
                                                                    assignmentHistory.map((entry, idx) => (
                                                                        <div key={entry._id || idx} className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                                                                            <div>
                                                                                <p className="text-sm font-bold text-gray-900">
                                                                                    {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                                                                </p>
                                                                                <p className="text-[11px] text-gray-400 mt-0.5">
                                                                                    {new Date(entry.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                                                                                </p>
                                                                            </div>
                                                                            <div className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                                                                                <span className="text-base font-bold text-blue-700">{entry.assignedQuantity} KG</span>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                                                                        <p className="text-sm text-gray-400">{historyLoading ? "Loading..." : "No assignment records"}</p>
                                                                    </div>
                                                                )}
                                                                {/* Total Summary */}
                                                                <div className="bg-orange-50 rounded-xl p-3 border border-orange-200 flex items-center justify-between mt-1">
                                                                    <span className="text-sm font-bold text-gray-900">Total</span>
                                                                    <div className="flex gap-4">
                                                                        <div className="text-center">
                                                                            <p className="text-[10px] text-gray-500 font-bold uppercase">Assigned</p>
                                                                            <p className="text-base font-bold text-blue-700">{assignedQty} KG</p>
                                                                        </div>
                                                                        <div className="text-center">
                                                                            <p className="text-[10px] text-gray-500 font-bold uppercase">Cleaned</p>
                                                                            <p className="text-base font-bold text-green-700">{cleanedQty} KG</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="lg:w-1/3 flex flex-col justify-between p-4 md:p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                                                            {paymentResult ? (
                                                                <div className="text-center space-y-4">
                                                                    {paymentResult.status === "PENDING" ? (
                                                                        <>
                                                                            <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                                                                <MdOnlinePayment className="text-4xl text-yellow-500" />
                                                                            </div>
                                                                            <h3 className="text-base md:text-lg font-bold text-gray-900">Scan QR to Pay</h3>
                                                                            <p className="text-xl md:text-2xl font-bold text-orange-600">₹{paymentResult.total}</p>
                                                                            {paymentResult.qr && (
                                                                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                                                    <img src={paymentResult.qr} alt="UPI QR Code" className="w-44 h-44 mx-auto rounded-lg" />
                                                                                    <p className="text-xs text-gray-600 mt-2 font-mono">{paymentResult.upiId}</p>
                                                                                </div>
                                                                            )}
                                                                            {paymentError && (
                                                                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                                                    <p className="text-red-700 text-sm font-medium">{paymentError}</p>
                                                                                </div>
                                                                            )}
                                                                            <div className="grid grid-cols-2 gap-3 pt-2">
                                                                                <button onClick={() => handleOnlineStatus(local.LocalID, "REJECTED")} disabled={paymentLoading} className="py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">✕ Reject</button>
                                                                                <button onClick={() => handleOnlineStatus(local.LocalID, "SUCCESS")} disabled={paymentLoading} className="py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1">
                                                                                    {paymentLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><MdCheckCircle className="text-lg" />Confirm</>}
                                                                                </button>
                                                                            </div>
                                                                        </>
                                                                    ) : paymentResult.status === "SUCCESS" ? (
                                                                        <>
                                                                            <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                                                                <MdCheckCircle className="text-4xl text-green-500" />
                                                                            </div>
                                                                            <h3 className="text-lg md:text-xl font-bold text-gray-900">Payment Successful!</h3>
                                                                            <div className="space-y-2 text-sm">
                                                                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Amount</span><span className="font-bold text-green-600">₹{paymentResult.total}</span></div>
                                                                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Method</span><span className="font-semibold">{paymentResult.method}</span></div>
                                                                                <div className="flex justify-between py-2"><span className="text-gray-500">Total Paid</span><span className="font-bold text-orange-600">₹{paymentResult.localTotalPaid}</span></div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                                                                <MdError className="text-4xl text-red-500" />
                                                                            </div>
                                                                            <h3 className="text-lg md:text-xl font-bold text-gray-900">Payment Rejected</h3>
                                                                            <div className="space-y-2 text-sm">
                                                                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Amount</span><span className="font-bold text-red-600">₹{orderData?.total || "—"}</span></div>
                                                                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Method</span><span className="font-semibold">{paymentResult.method}</span></div>
                                                                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Status</span><span className="font-bold text-red-600">REJECTED</span></div>
                                                                                <div className="flex justify-between py-2"><span className="text-gray-500">Deduction</span><span className="font-semibold text-gray-700">No amount deducted</span></div>
                                                                            </div>
                                                                            <button onClick={() => { setPaymentResult(null); setPaymentError(null); fetchOrderReference(local.LocalID); }} className="w-full mt-2 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-sm">Retry Payment</button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            ) : orderData ? (
                                                                <>
                                                                    <div className="flex justify-between items-center mb-8">
                                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Reference</span>
                                                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-medium text-gray-600">{orderData.orderReference?.slice(-6) || "—"}</span>
                                                                    </div>
                                                                    <div className="text-center mb-5 md:mb-8 pb-5 md:pb-8 border-b border-gray-100">
                                                                        <div className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">Amount to Pay</div>
                                                                        <div className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center gap-1.5 md:gap-2 flex-wrap">
                                                                            <span>{orderData.quantity}</span>
                                                                            <span className="text-gray-400 text-lg md:text-xl">×</span>
                                                                            <span>{orderData.price_per_cleaned_imli}</span>
                                                                            <span className="text-gray-400 text-lg md:text-xl">=</span>
                                                                            <span className="text-orange-600">₹{orderData.total}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-4">
                                                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 md:mb-3">Payment Method</div>
                                                                        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
                                                                            <button onClick={() => setPaymentMethod("Cash")} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${paymentMethod === "Cash" ? 'bg-orange-50 border-orange-200 text-orange-700 ring-1 ring-orange-200' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}><MdMoney className={`text-lg ${paymentMethod === "Cash" ? 'text-orange-600' : 'text-gray-400'}`} />Cash</button>
                                                                            <button onClick={() => setPaymentMethod("Online")} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${paymentMethod === "Online" ? 'bg-orange-50 border-orange-200 text-orange-700 ring-1 ring-orange-200' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}><MdOnlinePayment className={`text-lg ${paymentMethod === "Online" ? 'text-orange-600' : 'text-gray-400'}`} />Online</button>
                                                                        </div>
                                                                        {paymentError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-3"><p className="text-red-700 text-sm font-medium">{paymentError}</p></div>}
                                                                        <button onClick={() => handleConfirmPayment(local.LocalID)} disabled={paymentLoading || !orderData.total} className="w-full py-3.5 bg-green-600 text-white rounded-lg font-semibold text-base hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2 active:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed">
                                                                            {paymentLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Processing...</> : <><MdCheckCircle className="text-xl" />Confirm & Pay ₹{orderData.total}</>}
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="text-center py-8 text-gray-400"><p className="font-medium">No pending payment</p></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* History Tab Content */}
                                            <div className={`transition-all duration-300 ease-in-out ${activeTab === 'history' ? 'opacity-100 visible translate-y-0 relative' : 'opacity-0 invisible translate-y-2 absolute inset-0 pointer-events-none'}`}>
                                                {isExpanded && <PaymentLogs localID={local.LocalID} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Payment