"use client"

import { MdLocalShipping, MdArrowForward, MdArrowBack } from 'react-icons/md'

export default function TransportDetails({ formData, updateFormData, onNext, onBack }) {
    const transport = formData.transport || {}

    const handleChange = (field, value) => {
        updateFormData({
            transport: { ...transport, [field]: value },
        })
    }

    const isValid = transport.destination && transport.vehicleNo

    return (
        <div className="space-y-5 md:space-y-8">
            {/* Section Title */}
            <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Transport Details</h3>
                <p className="text-gray-500 text-xs md:text-sm font-medium">Enter dispatching and vehicle information</p>
            </div>

            {/* Transport Icon Banner */}
            <div className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-orange-50/60 rounded-xl border border-orange-200">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <MdLocalShipping className="text-white text-2xl" />
                </div>
                <div>
                    <p className="text-sm font-bold text-orange-700">Dispatch Information</p>
                    <p className="text-xs text-orange-600/70 font-medium">Vehicle and destination details for the invoice</p>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 md:space-y-5">
                {/* Destination */}
                <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                        Destination <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={transport.destination || ""}
                        onChange={(e) => handleChange("destination", e.target.value)}
                        placeholder="e.g. UMBERGAON"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
                        style={{ fontSize: '16px' }}
                        required
                    />
                </div>

                {/* Vehicle Number */}
                <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                        Vehicle Number <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={transport.vehicleNo || ""}
                        onChange={(e) => handleChange("vehicleNo", e.target.value.toUpperCase())}
                        placeholder="e.g. MH41AU6346"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium uppercase"
                        style={{ fontSize: '16px' }}
                        required
                    />
                </div>
            </div>

            {/* Navigation */}
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
                    Next
                    <MdArrowForward className="text-base" />
                </button>
            </div>
        </div>
    )
}
