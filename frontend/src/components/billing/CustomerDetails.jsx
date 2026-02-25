"use client"

import { MdPerson, MdHome, MdBadge, MdLocationOn, MdArrowForward, MdArrowBack } from 'react-icons/md'
import INDIAN_STATES from './indianStates'

export default function CustomerDetails({ formData, updateFormData, onNext, onBack }) {
    const customer = formData.customer || {}

    const handleChange = (field, value) => {
        const updated = { ...customer, [field]: value }

        // Auto-fill stateCode when state is selected
        if (field === "state") {
            const found = INDIAN_STATES.find(s => s.name === value)
            if (found) {
                updated.stateCode = found.code
            }
        }

        updateFormData({ customer: updated })
    }

    const isValid = customer.name && customer.address && customer.state && customer.stateCode

    return (
        <div className="space-y-5 md:space-y-8">
            {/* Section Title */}
            <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Customer Details</h3>
                <p className="text-gray-500 text-xs md:text-sm font-medium">Enter the buyer / bill-to information</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 md:space-y-5">
                {/* Customer Name */}
                <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                        <MdPerson className="text-orange-500" />
                        Customer Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={customer.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="e.g. Sheetal Industries"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
                        style={{ fontSize: '16px' }}
                        required
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                        <MdHome className="text-orange-500" />
                        Address <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        value={customer.address || ""}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Enter complete address with landmarks"
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium resize-none"
                        style={{ fontSize: '16px' }}
                        required
                    />
                </div>

                {/* GSTIN */}
                <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                        <MdBadge className="text-orange-500" />
                        GSTIN <span className="text-gray-400 text-xs font-normal normal-case">(Optional)</span>
                    </label>
                    <input
                        type="text"
                        value={customer.gstin || ""}
                        onChange={(e) => handleChange("gstin", e.target.value.toUpperCase())}
                        placeholder="e.g. 24BABPS6131G1ZX"
                        maxLength={15}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium uppercase"
                        style={{ fontSize: '16px' }}
                    />
                </div>

                {/* State + State Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                            <MdLocationOn className="text-orange-500" />
                            State <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={customer.state || ""}
                            onChange={(e) => handleChange("state", e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium appearance-none cursor-pointer"
                            style={{
                                fontSize: '16px',
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.75rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1.25rem 1.25rem',
                            }}
                            required
                        >
                            <option value="">Select State</option>
                            {/* Divider after Maharashtra */}
                            <option value={INDIAN_STATES[0].name}>
                                ★ {INDIAN_STATES[0].name} (Code: {INDIAN_STATES[0].code})
                            </option>
                            <option disabled>──────────────</option>
                            {INDIAN_STATES.slice(1).map((state) => (
                                <option key={state.code} value={state.name}>
                                    {state.name} (Code: {state.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                            <MdLocationOn className="text-orange-500" />
                            State Code
                        </label>
                        <input
                            type="text"
                            value={customer.stateCode || ""}
                            readOnly
                            placeholder="Auto-filled"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-base font-medium cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
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
                    Next
                    <MdArrowForward className="text-base" />
                </button>
            </div>
        </div>
    )
}
