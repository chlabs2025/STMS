"use client"

import { MdEco, MdGrain, MdArrowForward } from 'react-icons/md'

const products = [
    {
        id: "tamarind_seeds",
        label: "Tamarind Seeds",
        description: "Raw tamarind seeds for processing",
        icon: MdGrain,
        hsn: "121190",
    },
    {
        id: "cleaned_imli",
        label: "Cleaned Imli",
        description: "Processed and cleaned tamarind",
        icon: MdEco,
        hsn: "08109090",
    },
]

export default function ProductSelect({ formData, updateFormData, onNext }) {
    const selected = formData.productType

    const handleSelect = (product) => {
        updateFormData({
            productType: product.id,
            description: product.label,
            hsn: product.hsn,
        })
    }

    return (
        <div className="space-y-8">
            {/* Section Title */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Select Product</h3>
                <p className="text-gray-500 text-sm font-medium">Choose the product type for this invoice</p>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {products.map((product) => {
                    const Icon = product.icon
                    const isSelected = selected === product.id
                    return (
                        <button
                            key={product.id}
                            type="button"
                            onClick={() => handleSelect(product)}
                            className={`relative p-6 rounded-xl border-2 text-left transition-all duration-200 group cursor-pointer ${isSelected
                                    ? "border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 shadow-md"
                                    : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm"
                                }`}
                        >
                            {/* Selected Check */}
                            {isSelected && (
                                <div className="absolute top-4 right-4 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}

                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${isSelected ? "bg-orange-500" : "bg-gray-100 group-hover:bg-orange-100"
                                }`}>
                                <Icon className={`text-2xl ${isSelected ? "text-white" : "text-gray-500 group-hover:text-orange-600"}`} />
                            </div>

                            <h4 className={`text-lg font-bold mb-1 ${isSelected ? "text-orange-700" : "text-gray-900"}`}>
                                {product.label}
                            </h4>
                            <p className={`text-sm font-medium ${isSelected ? "text-orange-600/80" : "text-gray-500"}`}>
                                {product.description}
                            </p>
                            <div className={`mt-3 inline-block px-3 py-1 rounded-lg text-xs font-semibold ${isSelected ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"
                                }`}>
                                HSN: {product.hsn}
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!selected}
                    className="px-8 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all duration-200 shadow-sm flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    Next
                    <MdArrowForward className="text-lg" />
                </button>
            </div>
        </div>
    )
}
