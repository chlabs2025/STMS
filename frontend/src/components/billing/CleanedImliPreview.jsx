"use client"

import { MdArrowBack, MdSend, MdPerson, MdReceipt } from 'react-icons/md'

export default function CleanedImliPreview({ imliData, onBack, onSubmit, isSubmitting }) {
    const { senderName = "", rows = [] } = imliData

    const totalWeight = rows.reduce((sum, r) => sum + (parseFloat(r.weight) || 0), 0)
    const totalAmount = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)

    return (
        <div className="space-y-5 md:space-y-8">
            {/* Section Title */}
            <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Preview Bill</h3>
                <p className="text-gray-500 text-xs md:text-sm font-medium">Review all details before submitting</p>
            </div>

            {/* Sender Info */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                    <MdPerson className="text-orange-600" />
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Sender</span>
                </div>
                <div className="p-5">
                    <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500 font-medium">Name</span>
                        <span className="text-sm font-semibold text-gray-900">{senderName || "—"}</span>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                    <MdReceipt className="text-orange-600" />
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Items</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-orange-50/60 border-b border-orange-200">
                                <th className="px-3 md:px-5 py-3 text-left font-bold text-orange-700 uppercase tracking-wide text-[10px] md:text-xs">#</th>
                                <th className="px-3 md:px-5 py-3 text-left font-bold text-orange-700 uppercase tracking-wide text-[10px] md:text-xs">Unit</th>
                                <th className="px-3 md:px-5 py-3 text-left font-bold text-orange-700 uppercase tracking-wide text-[10px] md:text-xs">Qty</th>
                                <th className="px-3 md:px-5 py-3 text-left font-bold text-orange-700 uppercase tracking-wide text-[10px] md:text-xs">Rate</th>
                                <th className="px-3 md:px-5 py-3 text-left font-bold text-orange-700 uppercase tracking-wide text-[10px] md:text-xs">Weight</th>
                                <th className="px-3 md:px-5 py-3 text-right font-bold text-orange-700 uppercase tracking-wide text-[10px] md:text-xs">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index} className={`border-b border-gray-100 last:border-0 ${index % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                                    <td className="px-3 md:px-5 py-3 font-semibold text-gray-400 text-xs md:text-sm">{index + 1}</td>
                                    <td className="px-3 md:px-5 py-3 font-semibold text-gray-900 text-xs md:text-sm">{row.product || "—"}</td>
                                    <td className="px-3 md:px-5 py-3 font-medium text-gray-700 text-xs md:text-sm">
                                        {row.quantity || "0"}
                                    </td>
                                    <td className="px-3 md:px-5 py-3 font-medium text-gray-700 text-xs md:text-sm">
                                        ₹ {parseFloat(row.rate || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-3 md:px-5 py-3 font-medium text-gray-700 text-xs md:text-sm">
                                        {parseFloat(row.weight || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-3 md:px-5 py-3 font-semibold text-gray-900 text-right text-xs md:text-sm">
                                        ₹ {parseFloat(row.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-orange-50/80 border-t-2 border-orange-200">
                                <td className="px-3 md:px-5 py-3 font-bold text-gray-700 uppercase text-xs md:text-sm" colSpan={4}>Total</td>
                                <td className="px-3 md:px-5 py-3 font-bold text-orange-700 text-xs md:text-sm">
                                    {totalWeight.toLocaleString("en-IN", { minimumFractionDigits: 2 })} kg
                                </td>
                                <td className="px-3 md:px-5 py-3 font-bold text-orange-700 text-right text-xs md:text-sm">
                                    ₹ {totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Grand Total Card */}
            <div className="bg-orange-50 rounded-xl border-2 border-orange-200 p-4 md:p-6 flex items-center justify-between">
                <div>
                    <p className="text-xs md:text-sm font-bold text-orange-700 uppercase tracking-wide">Grand Total</p>
                    <p className="text-[10px] md:text-xs text-orange-600/70 font-medium mt-0.5">Total weight: {totalWeight.toLocaleString("en-IN", { minimumFractionDigits: 2 })} kg</p>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-orange-600">
                    ₹ {totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                    <MdArrowBack className="text-lg" />
                    Back
                </button>
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-sm flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Submitting...
                        </>
                    ) : (
                        <>
                            <MdSend className="text-lg" />
                            Submit Bill
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
