"use client"

import { useState, useEffect } from 'react'
import { MdArrowForward, MdArrowBack, MdAdd, MdDelete, MdPerson, MdWarning } from 'react-icons/md'
import api from '../../api/axios'
import API from '../../api/endpoints'

const EMPTY_ROW = { product: "", quantity: "", unit: "", rate: "", weight: "", amount: "" }
//test
const UNIT_OPTIONS = [
    { value: "Ht", label: "Ht" },
    { value: "Ns", label: "Ns" },
    { value: "St", label: "St" },
    { value: "Htc", label: "Htc" },
    { value: "HT", label: "HT" },
    { value: "1kg Packet", label: "1kg Packet" },
]

const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.1rem 1.1rem',
}

export default function CleanedImliForm({ imliData, setImliData, onNext, onBack }) {
    const { senderName = "", rows = [{ ...EMPTY_ROW }] } = imliData

    // Track which rows are using manual/custom unit input
    const [manualUnitRows, setManualUnitRows] = useState({})

    const [availableStock, setAvailableStock] = useState(null)
    const [stockLoading, setStockLoading] = useState(true)

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const [localsRes, rawImliRes] = await Promise.all([
                    api.get(API.GET_LOCALS),
                    api.get(API.GET_RAW_IMLI)
                ]);

                let inProgressCleaned = 0;
                if (localsRes.data && localsRes.data.data) {
                    const locals = localsRes.data.data;
                    inProgressCleaned = locals.reduce((acc, local) => acc + (local.totalReturnedQuantity || 0), 0);
                }

                const historicalCleaned = rawImliRes.data?.data?.totalCleanedImli || 0;
                setAvailableStock(historicalCleaned + inProgressCleaned);
            } catch (error) {
                console.error("Error fetching available stock:", error);
                setAvailableStock(0);
            } finally {
                setStockLoading(false);
            }
        };
        fetchStock();
    }, []);

    const updateSenderName = (value) => {
        setImliData({ ...imliData, senderName: value, rows })
    }

    const updateRow = (index, field, value) => {
        const updated = rows.map((row, i) => {
            if (i !== index) return row
            const newRow = { ...row, [field]: value }

            // Auto-calculate amount = weight × rate
            if (field === "weight" || field === "rate") {
                const weight = parseFloat(field === "weight" ? value : row.weight) || 0
                const rate = parseFloat(field === "rate" ? value : row.rate) || 0
                newRow.amount = weight * rate > 0 ? (weight * rate).toString() : ""
            }

            return newRow
        })
        setImliData({ ...imliData, senderName, rows: updated })
    }

    const handleUnitSelect = (index, value) => {
        if (value === "__manual__") {
            // Switch to manual input mode
            setManualUnitRows((prev) => ({ ...prev, [index]: true }))
            updateRow(index, "product", "")
        } else {
            setManualUnitRows((prev) => ({ ...prev, [index]: false }))
            updateRow(index, "product", value)
        }
    }

    const handleManualUnitChange = (index, value) => {
        updateRow(index, "product", value)
    }

    const switchToDropdown = (index) => {
        setManualUnitRows((prev) => ({ ...prev, [index]: false }))
        updateRow(index, "product", "")
    }

    const addRow = () => {
        setImliData({ ...imliData, senderName, rows: [...rows, { ...EMPTY_ROW }] })
    }

    const removeRow = (index) => {
        if (rows.length <= 1) return
        setImliData({ ...imliData, senderName, rows: rows.filter((_, i) => i !== index) })
        // Clean up manual unit tracking
        setManualUnitRows((prev) => {
            const newState = { ...prev }
            delete newState[index]
            return newState
        })
    }

    const totalQuantity = rows.reduce((sum, r) => sum + (parseFloat(r.quantity) || 0), 0)
    const totalWeight = rows.reduce((sum, r) => sum + (parseFloat(r.weight) || 0), 0)
    const totalAmount = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)

    const isStockExceeded = !stockLoading && availableStock !== null && totalWeight > availableStock

    const isValid = senderName.trim() && rows.every(
        (r) => r.product && r.quantity && r.rate && r.weight && r.amount
    ) && totalWeight > 0 && !isStockExceeded

    return (
        <div className="space-y-5 md:space-y-6">
            {/* Section Title */}
            <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Cleaned Imli Bill</h3>
                <p className="text-gray-500 text-xs md:text-sm font-medium">Fill in sender and item details</p>
            </div>

            {/* Sender Name */}
            <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                    <MdPerson className="text-orange-500" />
                    Sender Name <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={senderName}
                    onChange={(e) => updateSenderName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
                    style={{ fontSize: '16px' }}
                    required
                />
            </div>

            {/* Show error if weight exceeds stock */}
            {isStockExceeded && (
                <div className="bg-red-50 text-red-700 p-3 sm:p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-200">
                    <div className="bg-red-100 p-1.5 rounded-lg shrink-0">
                        <MdWarning className="text-xl text-red-600" />
                    </div>
                    <p>Cannot bill more than available stock <span className="font-bold">({availableStock.toLocaleString("en-IN", { minimumFractionDigits: 2 })} kg available)</span>.</p>
                </div>
            )}

            {/* Items Table */}
            {/* ─── Desktop Table (hidden on mobile) ─── */}
            <div className="hidden md:block border border-gray-200 rounded-xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[1.8fr_1fr_1fr_1fr_1.2fr_auto] bg-orange-50 border-b border-orange-200">
                    <div className="px-4 py-3 text-xs font-bold text-orange-700 uppercase tracking-wide">Unit</div>
                    <div className="px-4 py-3 text-xs font-bold text-orange-700 uppercase tracking-wide">Quantity</div>
                    <div className="px-4 py-3 text-xs font-bold text-orange-700 uppercase tracking-wide">Rate (₹)</div>
                    <div className="px-4 py-3 text-xs font-bold text-orange-700 uppercase tracking-wide">Weight (kg)</div>
                    <div className="px-4 py-3 text-xs font-bold text-orange-700 uppercase tracking-wide">Amount (₹)</div>
                    <div className="px-2 py-3 w-10"></div>
                </div>

                {/* Table Rows */}
                {rows.map((row, index) => (
                    <div
                        key={index}
                        className={`grid grid-cols-[1.8fr_1fr_1fr_1fr_1.2fr_auto] items-center border-b border-gray-100 last:border-0 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }`}
                    >
                        {/* Unit - Dropdown or Manual Input */}
                        <div className="px-3 py-2">
                            {manualUnitRows[index] ? (
                                <div className="flex items-center gap-1">
                                    <input
                                        type="text"
                                        value={row.product}
                                        onChange={(e) => handleManualUnitChange(index, e.target.value)}
                                        placeholder="Type unit..."
                                        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => switchToDropdown(index)}
                                        className="text-xs text-gray-400 hover:text-orange-600 px-1.5 py-1 rounded transition-colors whitespace-nowrap"
                                        title="Switch to dropdown"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <select
                                    value={row.product}
                                    onChange={(e) => handleUnitSelect(index, e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none cursor-pointer"
                                    style={selectStyle}
                                >
                                    <option value="">Select</option>
                                    {UNIT_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                    <option value="__manual__">✏️ Other (type manually)</option>
                                </select>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="px-3 py-2">
                            <input
                                type="number"
                                value={row.quantity}
                                onChange={(e) => updateRow(index, "quantity", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                placeholder="0"
                                min="0"
                                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            />
                        </div>

                        {/* Rate */}
                        <div className="px-3 py-2">
                            <input
                                type="number"
                                value={row.rate}
                                onChange={(e) => updateRow(index, "rate", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                placeholder="0"
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            />
                        </div>

                        {/* Weight */}
                        <div className="px-3 py-2">
                            <input
                                type="number"
                                value={row.weight}
                                onChange={(e) => updateRow(index, "weight", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                placeholder="0"
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            />
                        </div>

                        {/* Amount (auto-calculated) */}
                        <div className="px-3 py-2">
                            <div className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700">
                                {row.amount ? `₹ ${parseFloat(row.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "₹ 0.00"}
                            </div>
                        </div>

                        {/* Delete button */}
                        <div className="px-2 py-2 flex justify-center">
                            {rows.length > 2 ? (
                                <button
                                    type="button"
                                    onClick={() => removeRow(index)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                                    title="Remove row"
                                >
                                    <MdDelete className="text-lg" />
                                </button>
                            ) : (
                                <div className="w-8 h-8" />
                            )}
                        </div>
                    </div>
                ))}

                {/* Totals Row */}
                <div className="grid grid-cols-[1.8fr_1fr_1fr_1fr_1.2fr_auto] items-center bg-orange-50/80 border-t-2 border-orange-200">
                    <div className="px-4 py-3 text-sm font-bold text-gray-700 uppercase">Total</div>
                    <div className="px-4 py-3 text-sm font-bold text-orange-700">{totalQuantity}</div>
                    <div className="px-4 py-3 text-sm font-bold text-gray-500">—</div>
                    <div className="px-4 py-3 text-sm font-bold text-orange-700">
                        {totalWeight.toLocaleString("en-IN", { minimumFractionDigits: 2 })} kg
                    </div>
                    <div className="px-4 py-3 text-sm font-bold text-orange-700">
                        ₹ {totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </div>
                    <div className="px-2 py-3 w-10"></div>
                </div>
            </div>

            {/* ─── Mobile Card Layout (hidden on desktop) ─── */}
            <div className="md:hidden space-y-4">
                {rows.map((row, index) => (
                    <div key={index} className={`pb-4 space-y-3 ${index > 0 ? 'pt-4 border-t border-gray-100' : ''}`}>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Item {index + 1}</span>
                            {rows.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeRow(index)}
                                    className="text-xs text-red-400 font-medium flex items-center gap-1 active:text-red-600 transition-colors"
                                >
                                    <MdDelete className="text-sm" />
                                    Remove
                                </button>
                            )}
                        </div>

                        {/* Unit */}
                        <div>
                            <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1.5 block">Unit</label>
                            {manualUnitRows[index] ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={row.product}
                                        onChange={(e) => handleManualUnitChange(index, e.target.value)}
                                        placeholder="Type unit..."
                                        className="flex-1 px-3 py-2.5 bg-gray-50 border-none rounded-lg text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                        style={{ fontSize: '16px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => switchToDropdown(index)}
                                        className="text-xs text-gray-400 hover:text-orange-600 px-2 py-1 rounded transition-colors"
                                        title="Switch to dropdown"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <select
                                    value={row.product}
                                    onChange={(e) => handleUnitSelect(index, e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50 border-none rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none cursor-pointer"
                                    style={{ ...selectStyle, fontSize: '16px' }}
                                >
                                    <option value="">Select Unit</option>
                                    {UNIT_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                    <option value="__manual__">✏️ Other (type manually)</option>
                                </select>
                            )}
                        </div>

                        {/* Quantity + Rate row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1.5 block">Quantity</label>
                                <input
                                    type="number"
                                    value={row.quantity}
                                    onChange={(e) => updateRow(index, "quantity", e.target.value)}
                                    onWheel={(e) => e.target.blur()}
                                    placeholder="0"
                                    min="0"
                                    className="w-full px-3 py-2.5 bg-gray-50 border-none rounded-lg text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    style={{ fontSize: '16px' }}
                                />
                            </div>
                            <div>
                                <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1.5 block">Rate (₹)</label>
                                <input
                                    type="number"
                                    value={row.rate}
                                    onChange={(e) => updateRow(index, "rate", e.target.value)}
                                    onWheel={(e) => e.target.blur()}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2.5 bg-gray-50 border-none rounded-lg text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    style={{ fontSize: '16px' }}
                                />
                            </div>
                        </div>

                        {/* Weight + Amount row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1.5 block">Weight (kg)</label>
                                <input
                                    type="number"
                                    value={row.weight}
                                    onChange={(e) => updateRow(index, "weight", e.target.value)}
                                    onWheel={(e) => e.target.blur()}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2.5 bg-gray-50 border-none rounded-lg text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    style={{ fontSize: '16px' }}
                                />
                            </div>
                            <div>
                                <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1.5 block">Amount (₹)</label>
                                <div className="w-full px-3 py-2.5 bg-orange-50/60 rounded-lg text-sm font-semibold text-gray-700 border border-orange-100" style={{ fontSize: '16px', minHeight: '42px', display: 'flex', alignItems: 'center' }}>
                                    {row.amount ? `₹ ${parseFloat(row.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "₹ 0.00"}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Mobile Totals */}
                <div className="bg-orange-50/70 rounded-xl p-3 flex items-center justify-between mt-2">
                    <div>
                        <p className="text-[11px] font-semibold text-orange-700 uppercase">Total</p>
                        <div className="flex gap-4 mt-0.5">
                            <div>
                                <span className="text-[9px] text-orange-600/70 font-semibold uppercase mr-1">Qty</span>
                                <span className="text-[10px] text-orange-700 font-bold">{totalQuantity}</span>
                            </div>
                            <div>
                                <span className="text-[9px] text-orange-600/70 font-semibold uppercase mr-1">Wt</span>
                                <span className="text-[10px] text-orange-700 font-bold">{totalWeight.toLocaleString("en-IN", { minimumFractionDigits: 2 })} kg</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-lg font-semibold text-orange-700">₹ {totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                </div>
            </div>

            {/* Add Row */}
            <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 px-4 py-2 rounded-lg border border-dashed border-orange-300 hover:bg-orange-50 transition-all duration-200 cursor-pointer"
            >
                <MdAdd className="text-lg" />
                Add Row
            </button>

            {/* Navigation — even buttons on mobile */}
            <div className="flex gap-3 pt-4 border-t border-gray-100 md:justify-end">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 md:flex-none py-3 md:px-6 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                    <MdArrowBack className="text-base" />
                    Back
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!isValid}
                    className="flex-1 md:flex-none py-3 md:px-8 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none text-sm"
                >
                    Preview
                    <MdArrowForward className="text-base" />
                </button>
            </div>
        </div>
    )
}
