"use client"

import { MdInventory, MdArrowForward, MdArrowBack, MdCalculate } from 'react-icons/md'
import { SELLER_STATE } from './indianStates'

const UNITS = ["kgs", "pcs", "bags", "quintals", "tons", "liters"]

export default function ItemDetails({ formData, updateFormData, onNext, onBack }) {
    const item = formData.item || {}
    const customerState = formData.customer?.state || ""
    const isInterstate = customerState && customerState !== SELLER_STATE

    const handleChange = (field, value) => {
        const updated = { ...item, [field]: value }

        // Recalculate when quantity, rate, or gstPercent change
        const quantity = parseFloat(field === "quantity" ? value : updated.quantity) || 0
        const rate = parseFloat(field === "rate" ? value : updated.rate) || 0
        const gstPercent = parseFloat(field === "gstPercent" ? value : updated.gstPercent) || 0

        const amount = quantity * rate
        const gstAmount = (amount * gstPercent) / 100

        updated.amount = Math.round(amount * 100) / 100

        if (isInterstate) {
            // Interstate => IGST only
            updated.igst = Math.round(gstAmount * 100) / 100
            updated.cgst = 0
            updated.sgst = 0
        } else {
            // Intrastate => CGST + SGST (split equally)
            updated.igst = 0
            updated.cgst = Math.round((gstAmount / 2) * 100) / 100
            updated.sgst = Math.round((gstAmount / 2) * 100) / 100
        }

        updateFormData({ item: updated })
    }

    const isValid = item.quantity && item.unit && item.rate && item.gstPercent !== undefined && item.gstPercent !== ""

    const totalWithGst = (item.amount || 0) + (item.igst || 0) + (item.cgst || 0) + (item.sgst || 0)

    return (
        <div className="space-y-8">
            {/* Section Title */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Item Details</h3>
                <p className="text-gray-500 text-sm font-medium">Enter quantity, rate, and GST for the selected product</p>
            </div>

            {/* Product Info Badge */}
            <div className="flex items-center gap-3 p-4 bg-orange-50/60 rounded-xl border border-orange-200">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <MdInventory className="text-white text-xl" />
                </div>
                <div>
                    <p className="text-sm font-bold text-orange-700">{formData.description || "—"}</p>
                    <p className="text-xs text-orange-600/70 font-medium">HSN: {formData.hsn || "—"}</p>
                </div>
                <div className="ml-auto">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${isInterstate ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {isInterstate ? "Interstate → IGST" : "Intrastate → CGST + SGST"}
                    </span>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
                {/* Quantity + Unit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                            Quantity <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            value={item.quantity || ""}
                            onChange={(e) => handleChange("quantity", e.target.value)}
                            placeholder="e.g. 15300"
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
                            required
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                            Unit <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={item.unit || ""}
                            onChange={(e) => handleChange("unit", e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium appearance-none cursor-pointer"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.75rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1.25rem 1.25rem',
                            }}
                            required
                        >
                            <option value="">Select Unit</option>
                            {UNITS.map((u) => (
                                <option key={u} value={u}>{u}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Rate + GST % */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                            Rate (₹ per unit) <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            value={item.rate || ""}
                            onChange={(e) => handleChange("rate", e.target.value)}
                            placeholder="e.g. 32.00"
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
                            required
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                            GST % <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            value={item.gstPercent ?? ""}
                            onChange={(e) => handleChange("gstPercent", e.target.value)}
                            placeholder="e.g. 5"
                            min="0"
                            max="28"
                            step="0.01"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
                            required
                        />
                    </div>
                </div>

                {/* Auto-calculated Summary */}
                {item.amount > 0 && (
                    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-3 bg-gray-100/80 border-b border-gray-200 flex items-center gap-2">
                            <MdCalculate className="text-orange-600" />
                            <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Auto-Calculated</span>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 font-medium">Taxable Amount</span>
                                <span className="text-base font-bold text-gray-900">₹ {item.amount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                            </div>
                            {isInterstate ? (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 font-medium">IGST ({item.gstPercent}%)</span>
                                    <span className="text-base font-bold text-blue-600">₹ {item.igst?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 font-medium">CGST ({(item.gstPercent / 2).toFixed(1)}%)</span>
                                        <span className="text-base font-bold text-green-600">₹ {item.cgst?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 font-medium">SGST ({(item.gstPercent / 2).toFixed(1)}%)</span>
                                        <span className="text-base font-bold text-green-600">₹ {item.sgst?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </>
                            )}
                            <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-800">Grand Total</span>
                                <span className="text-xl font-bold text-orange-600">₹ {totalWithGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                >
                    <MdArrowBack className="text-lg" />
                    Back
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!isValid}
                    className="px-8 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all duration-200 shadow-sm flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    Next
                    <MdArrowForward className="text-lg" />
                </button>
            </div>
        </div>
    )
}
