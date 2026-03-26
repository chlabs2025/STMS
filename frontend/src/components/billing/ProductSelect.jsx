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
        // Directly advance to the next step
        onNext()
    }

    return (
        <div className="space-y-5 md:space-y-8">
            {/* Section Title */}
            <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Select Product</h3>
                <p className="text-gray-500 text-xs md:text-sm font-medium">Choose the product type for this invoice</p>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {products.map((product) => {
                    const Icon = product.icon
                    return (
                        <button
                            key={product.id}
                            type="button"
                            onClick={() => handleSelect(product)}
                            className="relative p-4 md:p-6 rounded-xl border-2 text-left transition-all duration-200 group cursor-pointer border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm"
                        >
                            <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-colors bg-gray-100 group-hover:bg-orange-100">
                                <Icon className="text-xl md:text-2xl text-gray-500 group-hover:text-orange-600" />
                            </div>

                            <h4 className="text-base md:text-lg font-bold mb-1 text-gray-900">
                                {product.label}
                            </h4>
                            <p className="text-sm font-medium text-gray-500">
                                {product.description}
                            </p>
                            <div className="mt-3 inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-500">
                                HSN: {product.hsn}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
