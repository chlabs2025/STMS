"use client"

import { useState, useEffect } from "react"
import { MdPersonAdd, MdCancel, MdCheckCircle, MdError, MdPerson, MdHome, MdPhone, MdPayment, MdSchedule } from 'react-icons/md'
import api from "../../api/axios"
import { t } from "../../i18n/translations"
import { useLang } from "../../context/LanguageContext"
import T from "../../i18n/T"

export default function AddLocals() {
    const { lang } = useLang()

    const [formData, setFormData] = useState({
        LocalID: "",
        LocalName: "",
        LocalAddress: "",
        LocalPhone: "",
        upiId: "",
    })

    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [existingLocals, setExistingLocals] = useState([])
    const [idError, setIdError] = useState("")

    // Fetch existing locals on mount
    useEffect(() => {
        const fetchLocals = async () => {
            try {
                // Using the return_local endpoint to get all locals
                const response = await api.post("/return_local")
                if (response.data && response.data.data) {
                    setExistingLocals(response.data.data)
                }
            } catch (error) {
                console.error("Failed to fetch existing locals:", error)
            }
        }
        fetchLocals()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target

        // Real-time validation for LocalID
        if (name === "LocalID") {
            const isDuplicate = existingLocals.some(local => String(local.LocalID) === String(value))
            if (isDuplicate) {
                setIdError("⚠️ This Local ID is already taken. Please choose another.")
            } else {
                setIdError("")
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Final check before submission
        const isDuplicate = existingLocals.some(local => String(local.LocalID) === String(formData.LocalID))
        if (isDuplicate) {
            setErrorMessage("⚠️ Cannot add local: Local ID already exists.")
            return
        }

        setLoading(true)
        setSuccessMessage("")
        setErrorMessage("")

        try {
            const response = await api.post("/addLocal", formData)

            setSuccessMessage(` ${t("Local added successfully", lang)}`)
            setFormData({
                LocalID: "",
                LocalName: "",
                LocalAddress: "",
                LocalPhone: "",
                upiId: "",
            })
            // Refresh list of locals to include the new one
            const refreshResponse = await api.post("/return_local")
            if (refreshResponse.data && refreshResponse.data.data) {
                setExistingLocals(refreshResponse.data.data)
            }

            console.log("Response:", response.data)
        } catch (error) {
            if (error.response?.status === 409) {
                setErrorMessage(lang === "ur" ? "⚠️ مقامی آئی ڈی پہلے سے موجود ہے" : "⚠️ Local ID already exists.")
            } else {
                setErrorMessage(
                    error.response?.data?.message || t("Failed to add local. Please try again.", lang)
                )
            }
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setFormData({
            LocalID: "",
            LocalName: "",
            LocalAddress: "",
            LocalPhone: "",
            LocalUPI: "",
        })
        setSuccessMessage("")
        setErrorMessage("")
        setIdError("")
    }

    return (
        <div className="min-h-screen bg-white p-3 md:p-6 overflow-x-hidden">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-white px-4 md:px-8 py-4 md:py-6 md:border-b md:border-gray-100">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="bg-orange-50 p-2 md:p-3 rounded-lg md:border md:border-orange-100">
                                    <MdPersonAdd className="text-xl md:text-2xl text-orange-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-bold text-gray-900"><T k="Add Local" /></h1>
                                    <p className="text-gray-500 text-xs md:text-sm font-medium"><T k="Register a new local worker" /></p>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
                                <MdSchedule className="text-gray-400" />
                                <p className="text-gray-500 text-xs font-medium">
                                    {new Date().toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 md:px-8 py-5 md:py-8">
                        {successMessage && (
                            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm flex items-center gap-3">
                                <MdCheckCircle className="text-green-500 text-lg flex-shrink-0" />
                                <p className="text-green-800 font-medium text-sm">{successMessage}</p>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm flex items-center gap-3">
                                <MdError className="text-red-500 text-lg flex-shrink-0" />
                                <p className="text-red-800 font-medium text-sm">{errorMessage}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                <div className="relative">
                                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                                        <MdPerson className="text-orange-500" />
                                        <T k="Local ID" />
                                    </label>
                                    <input
                                        type="text"
                                        name="LocalID"
                                        value={formData.LocalID}
                                        onChange={handleChange}
                                        placeholder={t("Enter unique local ID", lang)}
                                        className={`w-full px-4 py-3 bg-white border ${idError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300 focus:ring-orange-500/20 focus:border-orange-500'} rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 text-base font-medium`}
                                        style={{ fontSize: '16px' }}
                                        required
                                    />
                                    {idError && (
                                        <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                                            <MdError className="text-sm" />
                                            {idError}
                                        </p>
                                    )}
                                </div>

                                <div className="relative">
                                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                                        <MdPerson className="text-orange-500" />
                                        <T k="Local Name" />
                                    </label>
                                    <input
                                        type="text"
                                        name="LocalName"
                                        value={formData.LocalName}
                                        onChange={handleChange}
                                        placeholder={t("Enter full name", lang)}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
                                        style={{ fontSize: '16px' }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                                    <MdHome className="text-orange-500" />
                                    <T k="Address" />
                                </label>
                                <input
                                    type="text"
                                    name="LocalAddress"
                                    value={formData.LocalAddress}
                                    onChange={handleChange}
                                    placeholder={t("Enter complete address with landmarks", lang)}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
                                    style={{ fontSize: '16px' }}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                <div className="relative">
                                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                                        <MdPhone className="text-orange-500" />
                                        <T k="Phone Number" />
                                    </label>
                                    <input
                                        type="tel"
                                        name="LocalPhone"
                                        value={formData.LocalPhone}
                                        onChange={handleChange}
                                        placeholder={t("Enter 10-digit mobile number", lang)}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
                                        style={{ fontSize: '16px' }}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                                        <MdPayment className="text-orange-500" />
                                        <T k="UPI ID (Optional)" />
                                    </label>
                                    <input
                                        type="text"
                                        name="upiId"
                                        value={formData.upiId}
                                        onChange={handleChange}
                                        placeholder={t("username@upi or mobile@upi", lang)}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
                                        style={{ fontSize: '16px' }}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-3 md:py-2.5 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm text-sm"
                                >
                                    <T k="Cancel" />
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !!idError}
                                    className="flex-1 px-4 py-3 md:py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 text-sm"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <T k="Adding Local..." />
                                        </>
                                    ) : (
                                        <>
                                            <MdPersonAdd className="text-lg" />
                                            <T k="Add Local" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
