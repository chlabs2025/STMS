"use client"

import React, { useState, useEffect, useRef } from "react"
import { MdReceipt, MdCheckCircle, MdError, MdVisibility, MdFileDownload } from "react-icons/md"
import ProductSelect from "../../components/billing/ProductSelect"
import CustomerDetails from "../../components/billing/CustomerDetails"
import ItemDetails from "../../components/billing/ItemDetails"
import TransportDetails from "../../components/billing/TransportDetails"
import ReviewSubmit from "../../components/billing/ReviewSubmit"
import CleanedImliForm from "../../components/billing/CleanedImliForm"
import CleanedImliPreview from "../../components/billing/CleanedImliPreview"
import api from "../../api/axios"
import API from "../../api/endpoints"

// Steps for Tamarind Seeds (existing 5-step flow)
const TAMARIND_STEPS = [
  { id: 1, label: "Product" },
  { id: 2, label: "Customer" },
  { id: 3, label: "Items" },
  { id: 4, label: "Transport" },
  { id: 5, label: "Review" },
]

// Steps for Cleaned Imli (new 2-step flow)
const IMLI_STEPS = [
  { id: 1, label: "Product" },
  { id: 2, label: "Form" },
  { id: 3, label: "Preview" },
]

const EMPTY_ROW = { product: "", quantity: "", unit: "", rate: "", weight: "", amount: "" }

function Billing() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null) // { success, message }

  const [activeTab, setActiveTab] = useState("generate")
  const [historyData, setHistoryData] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [historyFilter, setHistoryFilter] = useState("all")

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true)
      const res = await api.get(API.GET_INVOICE_HISTORY)
      setHistoryData(res.data.data || [])
    } catch (error) {
      console.error("Failed to fetch history:", error)
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory()
    }
  }, [activeTab])

  const handleDownloadHistory = async (item) => {
    try {
      const endpoint = item.type === 'invoice' 
        ? API.GET_INVOICE_PDF(item._id) 
        : API.GET_SLIP_PDF(item._id);
        
      const response = await api.get(endpoint, { responseType: 'blob' });
      
      const contentDisposition = response.headers["content-disposition"]
      let filename = item.type === 'invoice' ? `${item.idNumber}.pdf` : `${item.idNumber}.pdf`
      if (contentDisposition) {
        const match = contentDisposition.match(/filename=(.+?)($|;)/)
        if (match) filename = match[1].replace(/"/g, "")
      }

      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert("Failed to download PDF.");
    }
  };

  const handleViewHistory = async (item) => {
    try {
      const endpoint = item.type === 'invoice' 
        ? API.GET_INVOICE_PDF(item._id) 
        : API.GET_SLIP_PDF(item._id);
        
      const response = await api.get(endpoint, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      window.open(url, "_blank")
    } catch (error) {
      alert("Failed to view PDF.");
    }
  };

  // Tamarind Seeds form data (existing)
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

  // Cleaned Imli form data (new)
  const [imliData, setImliData] = useState({
    senderName: "",
    rows: [{ ...EMPTY_ROW }],
  })

  const isImli = formData.productType === "cleaned_imli"
  const STEPS = isImli ? IMLI_STEPS : TAMARIND_STEPS
  const maxStep = STEPS.length

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  // ── Browser history integration for multi-step form ──
  const isStepPopState = useRef(false)

  // Push initial step into history when Billing mounts
  useEffect(() => {
    window.history.pushState({ billingStep: 1 }, "")
    return () => {
      // Clean up: no special cleanup needed
    }
  }, [])

  // Listen for popstate to handle back button within steps
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.billingStep !== undefined) {
        isStepPopState.current = true
        setCurrentStep(event.state.billingStep)
        window.scrollTo({ top: 0, left: 0, behavior: "instant" })
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const goNext = () => {
    const nextStep = Math.min(currentStep + 1, maxStep)
    setCurrentStep(nextStep)
    window.history.pushState({ billingStep: nextStep }, "")
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }
  const goBack = () => {
    if (currentStep > 1) {
      // Use browser history.back() which will trigger popstate
      window.history.back()
    }
  }

  // Scroll to top when submit result shows up
  useEffect(() => {
    if (submitResult) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    }
  }, [submitResult])

  // Tamarind Seeds submit (existing)
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitResult(null)

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
      const response = await api.post(API.GENERATE_INVOICE, payload, {
        responseType: "blob",
      })

      const contentDisposition = response.headers["content-disposition"]
      let filename = `Tamarind-Seed-Bill-${Date.now()}.pdf`
      if (contentDisposition) {
        const match = contentDisposition.match(/filename=(.+?)($|;)/)
        if (match) filename = match[1].replace(/"/g, "")
      }

      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setSubmitResult({
        success: true,
        message: "Invoice generated and downloaded successfully!",
      })
    } catch (error) {
      let errorMessage = "Failed to generate invoice. Please try again."
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text()
          const json = JSON.parse(text)
          errorMessage = json.message || errorMessage
        } catch { }
      } else {
        errorMessage = error.response?.data?.message || errorMessage
      }
      setSubmitResult({
        success: false,
        message: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cleaned Imli submit (new - placeholder, backend URL will be given later)
  const handleImliSubmit = async () => {
    setIsSubmitting(true)
    setSubmitResult(null)

    const totalWeight = imliData.rows.reduce((sum, r) => sum + (parseFloat(r.weight) || 0), 0)
    const totalAmount = imliData.rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)

    const payload = {
      senderName: imliData.senderName,
      productType: "cleaned_imli",
      items: imliData.rows.map((row) => ({
        product: row.product,
        quantity: parseFloat(row.quantity) || 0,
        unit: row.unit,
        rate: parseFloat(row.rate) || 0,
        weight: parseFloat(row.weight) || 0,
        amount: parseFloat(row.amount) || 0,
      })),
      totalWeight,
      totalAmount,
    }

    try {
      const response = await api.post(API.GENERATE_INVOICE, { ...payload, billType: "slip", receiverName: imliData.senderName, driverName: "" }, {
        responseType: "blob",
      })

      const contentDisposition = response.headers["content-disposition"]
      let filename = `Cleaned-Imli-Bill-${Date.now()}.pdf`
      if (contentDisposition) {
        const match = contentDisposition.match(/filename=(.+?)($|;)/)
        if (match) filename = match[1].replace(/"/g, "")
      }

      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setSubmitResult({
        success: true,
        message: "Bill generated and downloaded successfully!",
      })
    } catch (error) {
      let errorMessage = "Failed to generate bill. Please try again."
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text()
          const json = JSON.parse(text)
          errorMessage = json.message || errorMessage
        } catch { }
      } else {
        errorMessage = error.response?.data?.message || errorMessage
      }
      setSubmitResult({
        success: false,
        message: errorMessage,
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
    setImliData({
      senderName: "",
      rows: [{ ...EMPTY_ROW }],
    })
  }

  // Success / Error screen
  if (submitResult) {
    return (
      <div className="min-h-screen bg-white p-3 md:p-6 overflow-x-hidden">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-12 text-center">
            {submitResult.success ? (
              <>
                <div className="bg-green-50 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 border-2 border-green-200">
                  <MdCheckCircle className="text-3xl md:text-4xl text-green-500" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                  {isImli ? "Bill Generated!" : "Invoice Generated!"}
                </h2>
                <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">{submitResult.message}</p>
              </>
            ) : (
              <>
                <div className="bg-red-50 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 border-2 border-red-200">
                  <MdError className="text-3xl md:text-4xl text-red-500" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Something Went Wrong</h2>
                <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">{submitResult.message}</p>
              </>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReset}
                className="px-6 md:px-8 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all duration-200 shadow-sm text-sm md:text-base"
              >
                Create New {isImli ? "Bill" : "Invoice"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-3 md:p-6 overflow-x-hidden">
      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("generate")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === "generate" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Generate New
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === "history" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Billing History
          </button>
        </div>
      </div>

      {activeTab === "history" ? (
         <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-bold text-gray-900">Generated Bills & Slips</h2>
              <div className="flex bg-gray-50 p-1.5 rounded-lg border border-gray-100 self-start md:self-auto overflow-x-auto w-full md:w-auto">
                <button 
                  onClick={() => setHistoryFilter('all')}
                  className={`flex-1 md:flex-none whitespace-nowrap px-3 py-1.5 text-[11px] md:text-xs font-bold rounded-md transition-all outline-none ${historyFilter === 'all' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  All History
                </button>
                <button 
                  onClick={() => setHistoryFilter('invoice')}
                  className={`flex-1 md:flex-none whitespace-nowrap px-3 py-1.5 text-[11px] md:text-xs font-bold rounded-md transition-all outline-none ${historyFilter === 'invoice' ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Tamarind Seed
                </button>
                <button 
                  onClick={() => setHistoryFilter('slip')}
                  className={`flex-1 md:flex-none whitespace-nowrap px-3 py-1.5 text-[11px] md:text-xs font-bold rounded-md transition-all outline-none ${historyFilter === 'slip' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Cleaned Imli
                </button>
              </div>
            </div>
            
            {loadingHistory ? (
              <div className="py-10 text-center text-gray-500">Loading history...</div>
            ) : historyData.length === 0 ? (
              <div className="py-10 text-center text-gray-500">No billing history found.</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {historyData
                  .filter(item => historyFilter === "all" || item.type === historyFilter)
                  .map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 md:p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
                    {/* Top Row: Doc No, Date, and Type Badge */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-gray-900 font-bold text-sm md:text-base">
                          {item.idNumber}
                        </h3>
                        <span className="text-gray-400 text-xs font-medium block mt-0.5">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className={`px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full whitespace-nowrap ${item.type === 'invoice' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                          {item.type === 'invoice' ? 'Tamarind Seed Bill' : 'Cleaned Imli Bill'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Bottom Row: Party Name, Amount, and Actions */}
                    <div className="flex justify-between items-end mt-2 pt-3 border-t border-gray-50">
                      <div className="flex flex-col max-w-[50%]">
                        <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-0.5">Billed To</span>
                        <span className="text-gray-800 font-bold text-sm truncate">
                          {item.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewHistory(item)}
                          className="flex items-center gap-1.5 bg-blue-50 text-blue-600 outline-none hover:bg-blue-100 px-3 py-2 md:px-4 rounded-lg font-bold text-xs transition-colors shrink-0"
                        >
                          <MdVisibility className="text-[16px]" /> View
                        </button>
                        <button
                          onClick={() => handleDownloadHistory(item)}
                          className="flex items-center gap-1.5 bg-orange-50 text-orange-600 outline-none hover:bg-orange-100 px-3 py-2 md:px-4 rounded-lg font-bold text-xs transition-colors shrink-0"
                        >
                          <MdFileDownload className="text-[16px]" /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
         </div>
      ) : (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-white px-4 py-4 md:px-8 md:py-6 border-b border-gray-100">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="bg-orange-50 p-2.5 md:p-3 rounded-lg border border-orange-100">
                <MdReceipt className="text-xl md:text-2xl text-orange-600" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                  {isImli ? "Generate Bill" : "Generate Invoice"}
                </h1>
                <p className="text-gray-500 text-xs md:text-sm font-medium">
                  {isImli ? "Create a new cleaned imli bill" : "Create a new tax invoice"}
                </p>
              </div>
            </div>

            {/* Stepper Progress Bar - Only visible after step 1 */}
            {currentStep > 1 && (
              <div className="relative mt-4">
                {/* Connector lines — behind circles */}
                <div className="absolute top-3.5 md:top-[18px] left-0 right-0 flex items-center px-[10%] md:px-[10%] pointer-events-none" style={{ paddingLeft: `${100 / STEPS.length / 2}%`, paddingRight: `${100 / STEPS.length / 2}%` }}>
                  {STEPS.slice(0, -1).map((step, index) => (
                    <div key={index} className="flex-1">
                      <div className={`h-0.5 transition-all duration-300 ${currentStep > step.id ? "bg-orange-500" : "bg-gray-200"}`}></div>
                    </div>
                  ))}
                </div>

                {/* Step circles + labels — on top */}
                <div className="relative z-10 flex items-start">
                  {STEPS.map((step) => {
                    const isActive = currentStep === step.id
                    const isCompleted = currentStep > step.id
                    return (
                      <div key={step.id} className="flex flex-col items-center" style={{ width: `${100 / STEPS.length}%` }}>
                        <div
                          className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 ${isCompleted
                            ? "bg-orange-500 text-white shadow-sm"
                            : isActive
                              ? "bg-orange-500 text-white ring-4 ring-orange-500/20 shadow-md"
                              : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                            }`}
                        >
                          {isCompleted ? (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            step.id
                          )}
                        </div>
                        <span
                          className={`mt-1 md:mt-2 text-[10px] md:text-xs font-medium whitespace-nowrap ${isActive || isCompleted ? "text-orange-600" : "text-gray-400"
                            }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Step Content */}
          <div className="p-4 md:p-8">
            {/* Step 1 is always Product Select */}
            {currentStep === 1 && (
              <ProductSelect
                formData={formData}
                updateFormData={updateFormData}
                onNext={goNext}
              />
            )}

            {/* ---- TAMARIND SEEDS FLOW (steps 2-5) ---- */}
            {!isImli && currentStep === 2 && (
              <CustomerDetails
                formData={formData}
                updateFormData={updateFormData}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {!isImli && currentStep === 3 && (
              <ItemDetails
                formData={formData}
                updateFormData={updateFormData}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {!isImli && currentStep === 4 && (
              <TransportDetails
                formData={formData}
                updateFormData={updateFormData}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {!isImli && currentStep === 5 && (
              <ReviewSubmit
                formData={formData}
                onBack={goBack}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}

            {/* ---- CLEANED IMLI FLOW (steps 2-3) ---- */}
            {isImli && currentStep === 2 && (
              <CleanedImliForm
                imliData={imliData}
                setImliData={setImliData}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {isImli && currentStep === 3 && (
              <CleanedImliPreview
                imliData={imliData}
                onBack={goBack}
                onSubmit={handleImliSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  )
}

export default Billing