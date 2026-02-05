import { useState, useEffect } from "react"
import { MdPeople, MdRefresh, MdSearch, MdError, MdPayment, MdKeyboardArrowDown, MdKeyboardArrowUp, MdCheckCircle, MdMoney, MdPayment as MdOnlinePayment } from 'react-icons/md'
import axios from "../../api/axios"

const Payment = () => {
    const [locals, setLocals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredLocals, setFilteredLocals] = useState([])
    const [expandedLocalId, setExpandedLocalId] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState("Cash") // Default payment method
    const RATE_PER_UNIT = 15

    useEffect(() => {
        fetchLocals()
    }, [])

    const fetchLocals = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await axios.post("http://localhost:8000/api/getlocalData")
            if (response.data.data) {
                setLocals(response.data.data)
                setFilteredLocals(response.data.data)
            }
        } catch (error) {
            console.error("Error fetching locals:", error)
            setError("Failed to load locals. Please try again.")
        } finally {
            setLoading(false)
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

    const toggleExpand = (localId) => {
        if (expandedLocalId === localId) {
            setExpandedLocalId(null)
        } else {
            setExpandedLocalId(localId)
            setPaymentMethod("Cash") // Reset to Cash when expanding a new one
        }
    }

    const calculateTotal = (quantity) => {
        return (quantity || 0) * RATE_PER_UNIT
    }

    if (loading) {
        return (
            <div className="p-6 lg:p-8 bg-white min-h-screen flex items-center justify-center overflow-x-hidden">
                <div className="text-center">
                    <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-orange-200">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-2">Loading Payments...</div>
                    <div className="text-gray-600">Please wait while we fetch the data</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6 lg:p-8 bg-white min-h-screen flex items-center justify-center overflow-x-hidden">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-orange-200">
                    <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MdError className="text-3xl text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Data</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
                    <button
                        onClick={fetchLocals}
                        className="px-8 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200 shadow-md flex items-center justify-center gap-2 mx-auto border border-orange-600"
                    >
                        <MdRefresh className="text-lg" />
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 lg:p-8 bg-white min-h-screen overflow-x-hidden">
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-orange-500/30">
                            <MdPayment className="text-3xl text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900">Payment</h2>
                            <p className="text-gray-600 font-medium">Manage payments for locals</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchLocals}
                        className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 flex items-center gap-2 self-start lg:self-auto shadow-md font-semibold border border-orange-600"
                        aria-label="Refresh payments list"
                    >
                        <MdRefresh className="text-lg" />
                        Refresh
                    </button>
                </div>

                {/* Search Bar with Count */}
                <div className="bg-white rounded-2xl border border-orange-500/20 shadow-md p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 mr-6">
                            <div className="bg-orange-50 p-2.5 rounded-xl mr-4 border border-orange-100">
                                <MdSearch className="text-orange-600 text-xl" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, phone, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                aria-label="Search locals"
                                className="flex-1 border-none outline-none text-gray-900 placeholder-gray-400 bg-transparent text-base font-medium"
                            />
                        </div>
                        <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                            <div className="text-sm text-gray-700 font-medium">
                                <span className="font-bold text-orange-600">{filteredLocals.length}</span> locals
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {filteredLocals.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-orange-500/20">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MdSearch className="text-4xl text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {searchTerm ? "No matching locals found" : "No locals available"}
                    </h3>
                    <p className="text-gray-500 text-lg mb-6">
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
                <div className="space-y-6">
                    {filteredLocals.map((local) => {
                        const isExpanded = expandedLocalId === local._id
                        const cleanedQty = local.totalReturnedQuantity || 0
                        const assignedQty = local.totalAssignedQuantity || 0
                        const totalAmount = calculateTotal(cleanedQty)

                        return (
                            <div key={local._id} className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-orange-500 ring-1 ring-orange-500/20 shadow-orange-100 shadow-xl' : 'border-gray-200 hover:border-orange-300'}`}>
                                {/* Header Row */}
                                <div className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${isExpanded ? 'bg-orange-50/30' : 'bg-white hover:bg-gray-50'}`} onClick={() => toggleExpand(local._id)}>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-sm border-2 transition-all duration-300 ${isExpanded ? 'bg-orange-500 border-orange-400' : 'bg-white border-orange-500'}`}>
                                                <span className={`text-lg font-bold ${isExpanded ? 'text-white' : 'text-orange-600'}`}>
                                                    {(local.LocalName || "U").charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-gray-900">
                                                {local.LocalName || "Unnamed Local"}
                                            </div>
                                            <div className="mt-0.5 flex items-center gap-2">
                                                <span className="text-xs font-semibold text-gray-500">Local ID:</span>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
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

                                {/* Expanded Content */}
                                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-8 bg-white border-t border-gray-100">
                                        <div className="flex flex-col lg:flex-row justify-between gap-10">
                                            <div className="lg:w-2/3">
                                                <div className="mb-8 p-4 bg-orange-50/50 rounded-lg border-l-4 border-orange-500 text-gray-700 font-medium text-sm">
                                                    {(() => {
                                                        const date = local.updatedAt ? new Date(local.updatedAt) : new Date();
                                                        // Find the most recent Thursday
                                                        const day = date.getDay();
                                                        const diff = date.getDate() - day + (day >= 4 ? 4 : -3);
                                                        const start = new Date(date);
                                                        start.setDate(diff);

                                                        const end = new Date(start);
                                                        end.setDate(start.getDate() + 7);

                                                        const format = (d) => `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;

                                                        return `Period: Thursday ${format(start)} to ${format(end)}`;
                                                    })()}
                                                </div>

                                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                                    <table className="w-full text-left">
                                                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                                                            <tr>
                                                                <th className="px-6 py-4">Date</th>
                                                                <th className="px-6 py-4">Assigned Quantity</th>
                                                                <th className="px-6 py-4">Cleaned Qty.</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                                                            <tr className="hover:bg-gray-50/50 transition-colors">
                                                                <td className="px-6 py-4 font-medium">
                                                                    {local.updatedAt ? new Date(local.updatedAt).toLocaleDateString("en-GB", {
                                                                        day: "numeric",
                                                                        month: "short",
                                                                        year: "numeric"
                                                                    }) : "-"}
                                                                </td>
                                                                <td className="px-6 py-4">{assignedQty}</td>
                                                                <td className="px-6 py-4">{cleanedQty}</td>
                                                            </tr>
                                                            <tr className="bg-gray-50/50 text-gray-900 font-semibold">
                                                                <td className="px-6 py-4">Total :</td>
                                                                <td className="px-6 py-4">{assignedQty}</td>
                                                                <td className="px-6 py-4">{cleanedQty}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div className="lg:w-1/3 flex flex-col justify-between p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                                                <div className="flex justify-between items-center mb-8">
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Reference</span>
                                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-medium text-gray-600">238-92</span>
                                                </div>

                                                <div className="text-center mb-8 pb-8 border-b border-gray-100">
                                                    <div className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">Amount to Pay</div>
                                                    <div className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                                                        <span>{cleanedQty}</span>
                                                        <span className="text-gray-400 text-xl">×</span>
                                                        <span>{RATE_PER_UNIT}</span>
                                                        <span className="text-gray-400 text-xl">=</span>
                                                        <span className="text-orange-600">₹{totalAmount}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment Method</div>
                                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                                        <button
                                                            onClick={() => setPaymentMethod("Cash")}
                                                            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${paymentMethod === "Cash" ? 'bg-orange-50 border-orange-200 text-orange-700 ring-1 ring-orange-200' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                                        >
                                                            <MdMoney className={`text-lg ${paymentMethod === "Cash" ? 'text-orange-600' : 'text-gray-400'}`} />
                                                            Cash
                                                        </button>
                                                        <button
                                                            onClick={() => setPaymentMethod("Online")}
                                                            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${paymentMethod === "Online" ? 'bg-orange-50 border-orange-200 text-orange-700 ring-1 ring-orange-200' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                                        >
                                                            <MdOnlinePayment className={`text-lg ${paymentMethod === "Online" ? 'text-orange-600' : 'text-gray-400'}`} />
                                                            Online
                                                        </button>
                                                    </div>

                                                    <button className="w-full py-3.5 bg-green-600 text-white rounded-lg font-semibold text-base hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2 active:bg-green-800">
                                                        <MdCheckCircle className="text-xl" />
                                                        Confirm & Pay
                                                    </button>
                                                </div>
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
