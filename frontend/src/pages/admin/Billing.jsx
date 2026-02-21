"use client"

import { useState } from "react"
import { MdReceipt, MdCheckCircle, MdError } from "react-icons/md"
import ProductSelect from "../../components/billing/ProductSelect"
import CustomerDetails from "../../components/billing/CustomerDetails"
import ItemDetails from "../../components/billing/ItemDetails"
import TransportDetails from "../../components/billing/TransportDetails"
import ReviewSubmit from "../../components/billing/ReviewSubmit"
import api from "../../api/axios"

const STEPS = [
  { id: 1, label: "Product" },
  { id: 2, label: "Customer" },
  { id: 3, label: "Items" },
  { id: 4, label: "Transport" },
  { id: 5, label: "Review" },
]

function Billing() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null) // { success, message }

  const [formData, setFormData] = useState({
    productType: "",
    description: "",
    hsn: "",
    customer: {
      name: "",
      address: "",
      gstin: "",
      state: "",
      stateCode: "",
    },
    item: {
      quantity: "",
      unit: "",
      rate: "",
      amount: 0,
      gstPercent: "",
      igst: 0,
      cgst: 0,
      sgst: 0,
    },
    transport: {
      destination: "",
      vehicleNo: "",
    },
  })

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 5))
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitResult(null)

    // Build the payload matching the backend schema
    const payload = {
      customer: formData.customer,
      transport: formData.transport,
      items: [
        {
          description: formData.description,
          hsn: formData.hsn,
          quantity: parseFloat(formData.item.quantity) || 0,
          unit: formData.item.unit,
          rate: parseFloat(formData.item.rate) || 0,
          amount: formData.item.amount || 0,
          gstPercent: parseFloat(formData.item.gstPercent) || 0,
          igst: formData.item.igst || 0,
          cgst: formData.item.cgst || 0,
          sgst: formData.item.sgst || 0,
        },
      ],
      subtotal: formData.item.amount || 0,
      cgstTotal: formData.item.cgst || 0,
      sgstTotal: formData.item.sgst || 0,
      igstTotal: formData.item.igst || 0,
      grandTotal:
        (formData.item.amount || 0) +
        (formData.item.igst || 0) +
        (formData.item.cgst || 0) +
        (formData.item.sgst || 0),
    }

    try {
      const response = await api.post("/generate-invoice", payload)
      setSubmitResult({
        success: true,
        message: "Invoice generated successfully!",
        data: response.data,
      })
    } catch (error) {
      setSubmitResult({
        success: false,
        message: error.response?.data?.message || "Failed to generate invoice. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setCurrentStep(1)
    setSubmitResult(null)
    setFormData({
      productType: "",
      description: "",
      hsn: "",
      customer: { name: "", address: "", gstin: "", state: "", stateCode: "" },
      item: { quantity: "", unit: "", rate: "", amount: 0, gstPercent: "", igst: 0, cgst: 0, sgst: 0 },
      transport: { destination: "", vehicleNo: "" },
    })
  }

  // Success / Error screen
  if (submitResult) {
    return (
      <div className="min-h-screen bg-white p-6 overflow-x-hidden">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            {submitResult.success ? (
              <>
                <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200">
                  <MdCheckCircle className="text-4xl text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Invoice Generated!</h2>
                <p className="text-gray-600 mb-8">{submitResult.message}</p>
              </>
            ) : (
              <>
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-200">
                  <MdError className="text-4xl text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Something Went Wrong</h2>
                <p className="text-gray-600 mb-8">{submitResult.message}</p>
              </>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all duration-200 shadow-sm"
              >
                Create New Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6 overflow-x-hidden">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-white px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                <MdReceipt className="text-2xl text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Generate Invoice</h1>
                <p className="text-gray-500 text-sm font-medium">Create a new tax invoice</p>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                return (
                  <div key={step.id} className="flex items-center flex-1 last:flex-none">
                    {/* Step circle + label */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${isCompleted
                            ? "bg-orange-500 text-white shadow-sm"
                            : isActive
                              ? "bg-orange-500 text-white ring-4 ring-orange-500/20 shadow-md"
                              : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                          }`}
                      >
                        {isCompleted ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          step.id
                        )}
                      </div>
                      <span
                        className={`mt-2 text-xs font-semibold whitespace-nowrap ${isActive || isCompleted ? "text-orange-600" : "text-gray-400"
                          }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Connector line */}
                    {index < STEPS.length - 1 && (
                      <div className="flex-1 mx-3 mt-[-1.25rem]">
                        <div className={`h-0.5 transition-all duration-300 ${currentStep > step.id ? "bg-orange-500" : "bg-gray-200"
                          }`}></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="p-8">
            {currentStep === 1 && (
              <ProductSelect
                formData={formData}
                updateFormData={updateFormData}
                onNext={goNext}
              />
            )}
            {currentStep === 2 && (
              <CustomerDetails
                formData={formData}
                updateFormData={updateFormData}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {currentStep === 3 && (
              <ItemDetails
                formData={formData}
                updateFormData={updateFormData}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {currentStep === 4 && (
              <TransportDetails
                formData={formData}
                updateFormData={updateFormData}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {currentStep === 5 && (
              <ReviewSubmit
                formData={formData}
                onBack={goBack}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Billing