"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { 
    MdPayment, 
    MdRefresh, 
    MdSearch, 
    MdError, 
    MdKeyboardArrowDown, 
    MdKeyboardArrowUp, 
    MdCheckCircle, 
    MdMoney, 
    MdPayment as MdOnlinePayment, 
    MdHistory, 
    MdFilterList, 
    MdClose 
} from 'react-icons/md'

import api from "../../api/axios"
import API from "../../api/endpoints"
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
    const [selectedRowId, setSelectedRowId] = useState(null)
    const [dateFilter, setDateFilter] = useState({ from: "", to: "" })
    const localRefs = useRef({})

    const fetchLocals = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true)
            setError(null)
            const response = await api.post(API.GET_LOCALS)
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
    }, [])

    useEffect(() => {
        fetchLocals()
    }, [fetchLocals])

    useEffect(() => {
        if (expandedLocalId && localRefs.current[expandedLocalId]) {
            const timer = setTimeout(() => {
                localRefs.current[expandedLocalId]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                })
            }, 100)
            return () => clearTimeout(timer)
        }
    }, [expandedLocalId])

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

    const fetchAssignmentHistory = useCallback(async (localID) => {
        try {
            setHistoryLoading(true)
            const response = await api.get(API.ASSIGNMENT_HISTORY, { params: { localID } })
            setAssignmentHistory(response.data?.data || [])
        } catch (error) {
            console.error("Error fetching assignment history:", error)
            setAssignmentHistory([])
        } finally {
            setHistoryLoading(false)
        }
    }, [])

    const fetchOrderReference = useCallback(async (localID, assignmentIds = null) => {
        try {
            setOrderLoading(true)
            setOrderData(null)
            setPaymentResult(null)
            setPaymentError(null)
            const payload = { localID: String(localID) }
            if (assignmentIds && assignmentIds.length > 0) {
                payload.assignmentIds = assignmentIds
            }
            const response = await api.post(API.ORDER_REFERENCE, payload)
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
    }, [])

    const toggleExpand = (local) => {
        if (expandedLocalId === local._id) {
            setExpandedLocalId(null)
            setOrderData(null)
            setPaymentResult(null)
            setPaymentError(null)
            setSelectedRowId(null)
        } else {
            setExpandedLocalId(local._id)
            setPaymentMethod("Cash")
            setPaymentResult(null)
            setPaymentError(null)
            setActiveTab("payment")
            setAssignmentHistory([])
            setSelectedRowId(null)
            setOrderData(null)
            fetchAssignmentHistory(local.LocalID)
        }
    }

    const handleRowClick = useCallback((entry, localID) => {
        if (entry.isPaid || !entry.isReturned) return
        
        if (selectedRowId === entry._id) {
            setSelectedRowId(null)
            setOrderData(null)
            setPaymentError(null)
            return
        }
        
        const unpaidRows = assignmentHistory.filter(a => a.isReturned && !a.isPaid)
        const clickedIdx = unpaidRows.findIndex(a => a._id === entry._id)
        if (clickedIdx === -1) return
        
        const selectedRows = unpaidRows.slice(0, clickedIdx + 1)
        // Collect unique batchIds since multiple rows can belong to the same batch
        const uniqueBatchIds = [...new Set(selectedRows.map(b => b.batchId || b._id))]
        setSelectedRowId(entry._id)
        fetchOrderReference(localID, uniqueBatchIds)
    }, [selectedRowId, assignmentHistory, fetchOrderReference])

    const handleConfirmPayment = useCallback(async (localId) => {
        if (!orderData) return
        try {
            setPaymentLoading(true)
            setPaymentError(null)
            setPaymentResult(null)
            const payload = {
                localId: localId,
                method: paymentMethod
            }
            if (orderData.assignmentIds && orderData.assignmentIds.length > 0) {
                payload.assignmentIds = orderData.assignmentIds
            } else if (orderData.assignmentId) {
                payload.assignmentIds = [orderData.assignmentId]
            }
            const response = await api.post(API.CONFIRM_PAYMENT, payload)
            setPaymentResult(response.data.data)
            
            if (paymentMethod === "Cash") {
                setSelectedRowId(null)
                await fetchLocals(true)
                await fetchAssignmentHistory(localId)
            }
        } catch (error) {
            setPaymentError(error.response?.data?.message || "Payment failed. Please try again.")
        } finally {
            setPaymentLoading(false)
        }
    }, [orderData, paymentMethod, fetchLocals, fetchAssignmentHistory])

    const handleOnlineStatus = useCallback(async (localId, newStatus) => {
        try {
            setPaymentLoading(true)
            setPaymentError(null)
            const payload = {
                localId: localId,
                method: "Online",
                status: newStatus
            }
            if (orderData?.assignmentIds && orderData.assignmentIds.length > 0) {
                payload.assignmentIds = orderData.assignmentIds
            } else if (orderData?.assignmentId) {
                payload.assignmentIds = [orderData.assignmentId]
            }
            const response = await api.post(API.CONFIRM_PAYMENT, payload)
            setPaymentResult(response.data.data)
            if (newStatus === "SUCCESS") {
                setSelectedRowId(null)
            }
            await fetchLocals(true)
            await fetchAssignmentHistory(localId)
        } catch (error) {
            setPaymentError(error.response?.data?.message || "Status update failed.")
        } finally {
            setPaymentLoading(false)
        }
    }, [fetchLocals, fetchAssignmentHistory, orderData])

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
        <div className="p-3 md:p-6 lg:p-8 bg-white h-full min-h-full flex flex-col overflow-hidden font-sans">
            <div className="bg-white rounded-xl border border-orange-500/20 shadow-sm p-3 md:p-4 mb-4 md:mb-6">
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3">
                    <div className="bg-white p-2 md:p-2.5 rounded-lg shadow-sm border border-orange-500/30 flex-shrink-0">
                        <MdPayment className="text-xl md:text-2xl text-orange-600" />
                    </div>
                    <div className="flex items-center flex-1 min-w-0 bg-gray-50 rounded-lg px-2.5 md:px-3 py-1.5 md:py-2">
                        <MdSearch className="text-orange-600 text-lg md:text-xl mr-1.5 md:mr-2 flex-shrink-0" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search name, phone, ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search payments"
                            className="flex-1 min-w-0 border-none outline-none text-gray-900 placeholder-gray-400 bg-transparent text-sm md:text-base font-medium"
                            style={{ fontSize: '16px' }}
                        />
                    </div>
                    <button
                        onClick={fetchLocals}
                        className="px-2.5 md:px-5 py-1.5 md:py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center gap-1.5 md:gap-2 shadow-sm font-medium border border-orange-600 text-sm flex-shrink-0 outline-none"
                        aria-label="Refresh payments list"
                    >
                        <MdRefresh className="text-lg" />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
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
                <div className="flex-1 overflow-y-auto min-h-0 pr-1 md:pr-2">
                    <div className="space-y-3 md:space-y-6">
                        {filteredLocals.map((local) => {
                        const isExpanded = expandedLocalId === local._id

                        return (
                            <div 
                                key={local._id} 
                                ref={el => localRefs.current[local._id] = el}
                                className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-orange-500 ring-1 ring-orange-500/20 shadow-orange-100 shadow-xl' : 'border-gray-200 hover:border-orange-300'}`}
                            >
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

                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'opacity-100 min-h-[400px]' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-4 md:p-8 bg-white border-t border-gray-50">
                                        <div className="relative">
                                            {/* Payment Tab Content */}
                                            <div className={`transition-all duration-300 ease-in-out ${activeTab === 'payment' ? 'opacity-100 visible translate-y-0 relative' : 'opacity-0 invisible -translate-y-2 absolute inset-0 pointer-events-none'}`}>
                                                {orderLoading && !orderData ? (
                                                    <div className="flex items-center justify-center py-12">
                                                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                                        <span className="ml-3 text-gray-600 font-medium">Loading order details...</span>
                                                    </div>
                                                ) : (() => {
                                                    const filtered = assignmentHistory.filter(entry => {
                                                        if (!dateFilter.from && !dateFilter.to) return true
                                                        const date = new Date(entry.createdAt)
                                                        date.setHours(0,0,0,0)
                                                        if (dateFilter.from) {
                                                            const fromDate = new Date(dateFilter.from)
                                                            fromDate.setHours(0,0,0,0)
                                                            if (date < fromDate) return false
                                                        }
                                                        if (dateFilter.to) {
                                                            const toDate = new Date(dateFilter.to)
                                                            toDate.setHours(0,0,0,0)
                                                            if (date > toDate) return false
                                                        }
                                                        return true
                                                    })

                                                    const totalAssigned = filtered.reduce((s, e) => s + (e.quantity || 0), 0)
                                                    const totalCleaned = filtered.reduce((s, e) => s + (e.cleanedQuantity || 0), 0)

                                                    const unpaidBatches = filtered.filter(a => a.isReturned && !a.isPaid)
                                                    const clickedIdx = unpaidBatches.findIndex(a => a._id === selectedRowId)
                                                    const selectedIds = clickedIdx !== -1 ? unpaidBatches.slice(0, clickedIdx + 1).map(b => b._id) : []

                                                    // Construct rendering list with paid separators
                                                    const renderItems = []
                                                    let currentGroupId = null
                                                    let groupAssigned = 0
                                                    let groupCleaned = 0
                                                    let lastMatchingDate = null
                                                    let groupAmount = 0
                                                    let groupRate = 0

                                                    filtered.forEach((item) => {
                                                        if (item.isPaid && item.paymentLogId) {
                                                            if (currentGroupId !== item.paymentLogId) {
                                                                if (currentGroupId !== null) {
                                                                    renderItems.push({
                                                                        isSeparator: true,
                                                                        key: `sep-${currentGroupId}`,
                                                                        assigned: groupAssigned,
                                                                        cleaned: groupCleaned,
                                                                        date: lastMatchingDate,
                                                                        totalAmount: groupAmount || (groupCleaned * groupRate)
                                                                    })
                                                                }
                                                                currentGroupId = item.paymentLogId
                                                                groupAssigned = 0
                                                                groupCleaned = 0
                                                                groupAmount = item.totalAmount || 0
                                                                groupRate = item.rate || 0
                                                            }
                                                            groupAssigned += (item.quantity || 0)
                                                            groupCleaned += (item.cleanedQuantity || 0)
                                                            lastMatchingDate = item.paymentDate || item.createdAt
                                                            renderItems.push(item)
                                                        } else {
                                                            if (currentGroupId !== null) {
                                                                renderItems.push({
                                                                    isSeparator: true,
                                                                    key: `sep-${currentGroupId}`,
                                                                    assigned: groupAssigned,
                                                                    cleaned: groupCleaned,
                                                                    date: lastMatchingDate,
                                                                    totalAmount: groupAmount || (groupCleaned * groupRate)
                                                                })
                                                                currentGroupId = null
                                                            }
                                                            renderItems.push(item)
                                                        }
                                                    })

                                                    if (currentGroupId !== null) {
                                                        renderItems.push({
                                                            isSeparator: true,
                                                            key: `sep-${currentGroupId}`,
                                                            assigned: groupAssigned,
                                                            cleaned: groupCleaned,
                                                            date: lastMatchingDate,
                                                            totalAmount: groupAmount || (groupCleaned * groupRate)
                                                        })
                                                    }

                                                    return (
                                                        <div className="space-y-4">
                                                            {/* Date Filter Bar with inline Totals */}
                                                            <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 capitalize tracking-wider">
                                                                    <MdFilterList className="text-orange-500 text-sm" />
                                                                    <span>Filter by Date:</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <input 
                                                                        type="date" 
                                                                        value={dateFilter.from} 
                                                                        onChange={e => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
                                                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                                                        className="px-2 py-1 text-xs border border-gray-200 rounded-lg outline-none bg-white text-gray-700 focus:border-orange-500 cursor-pointer"
                                                                    />
                                                                    <span className="text-xs text-gray-400 font-bold">to</span>
                                                                    <input 
                                                                        type="date" 
                                                                        value={dateFilter.to} 
                                                                        onChange={e => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
                                                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                                                        className="px-2 py-1 text-xs border border-gray-200 rounded-lg outline-none bg-white text-gray-700 focus:border-orange-500 cursor-pointer"
                                                                    />
                                                                    {(dateFilter.from || dateFilter.to) && (
                                                                        <button 
                                                                            onClick={() => setDateFilter({ from: "", to: "" })}
                                                                            className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                                                                            title="Clear Filter"
                                                                        >
                                                                            <MdClose className="text-xs" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <div className="ml-auto flex items-center gap-4 text-xs font-semibold">
                                                                    <div className="text-right">
                                                                        <span className="text-gray-400 capitalize mr-1">Assigned:</span>
                                                                        <span className="text-blue-700 font-bold">{totalAssigned} KG</span>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className="text-gray-400 capitalize mr-1">Returned:</span>
                                                                        <span className="text-green-700 font-bold">{totalCleaned} KG</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col lg:flex-row justify-between gap-5 md:gap-10">
                                                                {/* Scrollable Table / Card Section */}
                                                                <div className="lg:w-2/3">
                                                                    {filtered.length === 0 ? (
                                                                        <div className="p-8 text-center text-gray-400 font-medium bg-white rounded-xl border border-gray-200">
                                                                            {historyLoading ? "Loading..." : "No records matching filter"}
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            {/* Desktop Table View */}
                                                                            <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white">
                                                                                <div className="max-h-[360px] overflow-y-auto">
                                                                                    <table className="w-full text-left border-collapse table-fixed">
                                                                                        <thead className="bg-gray-50 text-gray-600 capitalize text-xs font-semibold tracking-wider sticky top-0 z-10">
                                                                                            <tr>
                                                                                                <th className="px-4 py-3 w-[28%]">Date & Time</th>
                                                                                                <th className="px-4 py-3 w-[16%]">Assigned</th>
                                                                                                <th className="px-4 py-3 w-[16%]">Cleaned</th>
                                                                                                <th className="px-4 py-3 w-[18%]">Status</th>
                                                                                                <th className="px-4 py-3 w-[22%] text-right pr-4">Action</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                                                                                            {renderItems.map((item) => {
                                                                                                if (item.isSeparator) {
                                                                                                    return (
                                                                                                        <tr key={item.key} className="bg-green-50/70 border-y-2 border-green-200">
                                                                                                            <td className="px-4 py-2.5 font-bold text-green-700">
                                                                                                                <div>Total Paid</div>
                                                                                                                <div className="text-[10px] text-green-600 font-semibold">{new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                                                                                                            </td>
                                                                                                            <td className="px-4 py-2.5 font-bold text-green-700">{item.assigned} KG</td>
                                                                                                            <td className="px-4 py-2.5 font-bold text-green-700">{item.cleaned} KG</td>
                                                                                                            <td className="px-4 py-2.5">
                                                                                                                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">Payment Done</span>
                                                                                                            </td>
                                                                                                            <td className="px-4 py-2.5 text-right flex justify-end items-center pr-4">
                                                                                                                <span className="text-green-700 font-black text-base md:text-lg">Paid: ₹{item.totalAmount}</span>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                }

                                                                                                const entry = item
                                                                                                const isSelected = selectedIds.includes(entry._id)
                                                                                                const isPaid = entry.isPaid

                                                                                                let rowBg = "bg-white hover:bg-gray-50/50"
                                                                                                let textColor = "text-gray-700"
                                                                                                if (isPaid) {
                                                                                                    rowBg = "bg-gray-50/60 hover:bg-gray-50"
                                                                                                    textColor = "text-gray-600"
                                                                                                } else if (isSelected) {
                                                                                                    rowBg = "bg-orange-50/50 border-l-4 border-l-orange-500"
                                                                                                    textColor = "text-gray-900"
                                                                                                }

                                                                                                // Determine batch grouping
                                                                                                let isFirstInBatch = true;
                                                                                                let batchGroup = [entry];
                                                                                                if (entry.isBatch) {
                                                                                                    batchGroup = renderItems.filter(x => x.batchId === entry.batchId && !x.isSeparator);
                                                                                                    isFirstInBatch = batchGroup[0]._id === entry._id;
                                                                                                }
                                                                                                
                                                                                                // Use the max cleaned quantity for the batch
                                                                                                const displayCleanedQuantity = entry.isBatch 
                                                                                                    ? Math.max(...batchGroup.map(x => x.cleanedQuantity || 0))
                                                                                                    : entry.cleanedQuantity;

                                                                                                return (
                                                                                                    <tr 
                                                                                                        key={entry._id} 
                                                                                                        onClick={() => handleRowClick(entry, local.LocalID)}
                                                                                                        className={`transition-colors border-b border-gray-100 cursor-pointer ${rowBg} ${textColor}`}
                                                                                                    >
                                                                                                        <td className="px-4 py-3 font-medium">
                                                                                                            <div>{new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                                                                                                            <div className="text-[11px] text-gray-400 mt-0.5">{new Date(entry.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
                                                                                                        </td>
                                                                                                        <td className="px-4 py-3 text-gray-700">
                                                                                                            {entry.quantity ? `${entry.quantity} KG` : "—"}
                                                                                                        </td>
                                                                                                        {isFirstInBatch && (
                                                                                                            <>
                                                                                                                <td className="px-4 py-3 font-semibold text-gray-700 relative align-middle" rowSpan={batchGroup.length}>
                                                                                                                    {batchGroup.length > 1 && (
                                                                                                                        <div className="absolute left-0 top-3 bottom-3 w-3 border-l-[3px] border-y-[3px] border-gray-300/70 rounded-l-lg pointer-events-none"></div>
                                                                                                                    )}
                                                                                                                    <div className={batchGroup.length > 1 ? "pl-5" : ""}>
                                                                                                                        {displayCleanedQuantity ? `${displayCleanedQuantity} KG` : "—"}
                                                                                                                    </div>
                                                                                                                </td>
                                                                                                                <td className="px-4 py-3 align-middle" rowSpan={batchGroup.length}>
                                                                                                                    {isPaid ? (
                                                                                                                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">Payment Done</span>
                                                                                                                    ) : isSelected ? (
                                                                                                                        batchGroup.some(g => g._id === selectedRowId) ? (
                                                                                                                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-700 border border-orange-200 animate-pulse">Paying...</span>
                                                                                                                        ) : (
                                                                                                                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-50 text-orange-600 border border-orange-100">Selected</span>
                                                                                                                        )
                                                                                                                    ) : entry.isReturned ? (
                                                                                                                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700 border border-red-100">Unpaid</span>
                                                                                                                    ) : (
                                                                                                                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-50 text-gray-400 border border-gray-100">Pending Return</span>
                                                                                                                    )}
                                                                                                                </td>
                                                                                                                <td className="px-4 py-3 text-right pr-4 align-middle" rowSpan={batchGroup.length}>
                                                                                                                    {!isPaid && entry.isReturned && (
                                                                                                                        <div>
                                                                                                                            {selectedRowId ? (
                                                                                                                                batchGroup.some(g => g._id === selectedRowId) ? (
                                                                                                                                    <button className="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-sm">Paying</button>
                                                                                                                                ) : isSelected ? (
                                                                                                                                    <span className="text-xs text-orange-500 font-semibold">—</span>
                                                                                                                                ) : (
                                                                                                                                    <button onClick={(e) => { e.stopPropagation(); handleRowClick(entry, local.LocalID); }} className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">Pay</button>
                                                                                                                                )
                                                                                                                            ) : (
                                                                                                                                <button onClick={(e) => { e.stopPropagation(); handleRowClick(entry, local.LocalID); }} className="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-orange-600 transition-colors">Pay</button>
                                                                                                                            )}
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                                </td>
                                                                                                            </>
                                                                                                        )}
                                                                                                    </tr>
                                                                                                )
                                                                                            })}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>

                                                                            {/* Mobile Card Layout */}
                                                                            <div className="md:hidden space-y-2 max-h-[360px] overflow-y-auto pr-1">
                                                                                {renderItems.map((item) => {
                                                                                    if (item.isSeparator) {
                                                                                        return (
                                                                                            <div key={item.key} className="bg-green-50 border-2 border-green-200 rounded-xl p-3 flex flex-col gap-2">
                                                                                                <div className="flex justify-between items-center">
                                                                                                    <div>
                                                                                                        <p className="text-xs font-bold text-green-800 capitalize">Total Paid</p>
                                                                                                        <p className="text-[10px] text-green-600 mt-0.5">{new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                                                                                                    </div>
                                                                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">Payment Done</span>
                                                                                                </div>
                                                                                                <div className="flex justify-between items-center pt-2 border-t border-green-100">
                                                                                                    <div className="flex gap-4">
                                                                                                        <div>
                                                                                                            <p className="text-[9px] text-green-600 font-bold capitalize">Assigned</p>
                                                                                                            <p className="text-sm font-bold text-green-800">{item.assigned} KG</p>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <p className="text-[9px] text-green-600 font-bold capitalize">Returned</p>
                                                                                                            <p className="text-sm font-bold text-green-800">{item.cleaned} KG</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <span className="text-green-700 font-black text-sm pr-1">Paid: ₹{item.totalAmount}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    }

                                                                                    const entry = item
                                                                                    const isSelected = selectedIds.includes(entry._id)
                                                                                    const isPaid = entry.isPaid

                                                                                    return (
                                                                                        <div 
                                                                                            key={entry._id} 
                                                                                            onClick={() => handleRowClick(entry, local.LocalID)}
                                                                                            className={`rounded-xl p-3 border flex flex-col gap-2 transition-all cursor-pointer ${isPaid ? 'bg-gray-50/60 border-gray-100' : isSelected ? 'bg-orange-50/50 border-orange-200 ring-1 ring-orange-500/10' : 'bg-white border-gray-100 hover:border-orange-200'}`}
                                                                                        >
                                                                                            <div className="flex justify-between items-center">
                                                                                                <div>
                                                                                                    <p className="text-xs font-bold text-gray-900">{new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                                                                                                    <p className="text-[10px] text-gray-400 mt-0.5">{new Date(entry.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</p>
                                                                                                </div>
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold capitalize ${entry.type === "assign" ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-green-50 text-green-700 border border-green-100"}`}>
                                                                                                        {entry.type === "assign" ? "Assign" : "Return"}
                                                                                                    </span>
                                                                                                    {isPaid ? (
                                                                                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-700 border border-gray-200 capitalize">Paid</span>
                                                                                                    ) : isSelected ? (
                                                                                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-orange-100 text-orange-700 border border-orange-200 capitalize animate-pulse">Paying</span>
                                                                                                    ) : (
                                                                                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-50 text-red-700 border border-red-100 capitalize">Unpaid</span>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                                                                                <div>
                                                                                                    <p className="text-[9px] text-gray-400 font-bold capitalize">{entry.cleanedQuantity ? "Cleaned Quantity" : "Assigned Quantity"}</p>
                                                                                                    <p className="text-sm font-bold text-gray-900">{entry.cleanedQuantity ? `${entry.cleanedQuantity} KG` : `${entry.quantity} KG`}</p>
                                                                                                </div>
                                                                                                {!isPaid && entry.isReturned && (
                                                                                                    <div>
                                                                                                        {selectedRowId ? (
                                                                                                            entry._id === selectedRowId ? (
                                                                                                                <button className="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-sm">Paying...</button>
                                                                                                            ) : isSelected ? (
                                                                                                                <span className="text-xs text-orange-500 font-semibold">—</span>
                                                                                                            ) : (
                                                                                                                <button onClick={(e) => { e.stopPropagation(); handleRowClick(entry, local.LocalID); }} className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50">Pay</button>
                                                                                                            )
                                                                                                        ) : (
                                                                                                            <button onClick={(e) => { e.stopPropagation(); handleRowClick(entry, local.LocalID); }} className="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-orange-600">Pay</button>
                                                                                                        )}
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>

                                                                {/* Payment Confirmation Panel */}
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
                                                                                    <div className="flex gap-2">
                                                                                        <button onClick={() => handleOnlineStatus(local.LocalID, "SUCCESS")} disabled={paymentLoading} className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-1 text-sm">
                                                                                            <MdCheckCircle className="text-lg" /> Received
                                                                                        </button>
                                                                                        <button onClick={() => handleOnlineStatus(local.LocalID, "REJECTED")} disabled={paymentLoading} className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-1 text-sm">
                                                                                            <MdClose className="text-lg" /> Reject
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
                                                                                    <button onClick={() => { setPaymentResult(null); setPaymentError(null); fetchOrderReference(local.LocalID, selectedRowId ? selectedIds : null); }} className="w-full mt-2 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-sm">Retry Payment</button>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    ) : orderData ? (
                                                                        <>
                                                                            <div className="flex justify-between items-center mb-8">
                                                                                <span className="text-xs font-semibold text-gray-500 capitalize tracking-wider">Order Reference</span>
                                                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-medium text-gray-600">{orderData.orderReference?.slice(-6) || "—"}</span>
                                                                            </div>
                                                                            <div className="text-center mb-5 md:mb-8 pb-5 md:pb-8 border-b border-gray-100">
                                                                                <div className="text-gray-500 text-xs font-medium mb-2 capitalize tracking-wide">Amount to Pay</div>
                                                                                <div className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center gap-1.5 md:gap-2 flex-wrap">
                                                                                    <span>{orderData.quantity}</span>
                                                                                    <span className="text-gray-400 text-lg md:text-xl">×</span>
                                                                                    <span>{orderData.price_per_cleaned_imli}</span>
                                                                                    <span className="text-gray-400 text-lg md:text-xl">=</span>
                                                                                    <span className="text-orange-600">₹{orderData.total}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="space-y-4">
                                                                                <div className="text-xs font-semibold text-gray-500 capitalize tracking-wider mb-2 md:mb-3">Payment Method</div>
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
                                                                        <div className="text-center py-8 text-gray-400">
                                                                            <div className="bg-gray-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                                                                                <MdPayment className="text-2xl text-gray-300" />
                                                                            </div>
                                                                            <p className="font-medium text-sm">{paymentError || "Select a row and click Pay to proceed"}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })()}
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
                </div>
            )}
        </div>
    )
}

export default Payment
