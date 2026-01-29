"use client"

import { useState } from "react"
import { MdPersonAdd, MdCancel, MdCheckCircle, MdError, MdPerson, MdHome, MdPhone, MdPayment, MdSchedule } from 'react-icons/md'
import api from "../../api/axios"

export default function AddLocals() {
    const [formData, setFormData] = useState({
        LocalID: "",
        LocalName: "",
        LocalAddress: "",
        LocalPhone: "",
        LocalUPI: "",
    })

    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setSuccessMessage("")
        setErrorMessage("")

        try {
            const response = await api.post("/addLocal", formData)

            setSuccessMessage("✅ Local added successfully to the system")
            setFormData({
                LocalID: "",
                LocalName: "",
                LocalAddress: "",
                LocalPhone: "",
                LocalUPI: "",
            })

            console.log("Response:", response.data)
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || "Failed to add local. Please try again."
            )
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
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6 overflow-x-hidden">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden backdrop-blur-sm">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 px-8 py-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                    <MdPersonAdd className="text-2xl text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Add Local</h1>
                                    <p className="text-orange-100 text-sm font-medium">Register a new local worker</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                                <MdSchedule className="text-orange-100" />
                                <p className="text-orange-100 text-sm font-medium">
                                    {new Date().toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}{" "}
                                    • {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {successMessage && (
                            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500 p-2 rounded-lg">
                                        <MdCheckCircle className="text-white text-lg" />
                                    </div>
                                    <p className="text-green-800 font-semibold">{successMessage}</p>
                                </div>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-500 p-2 rounded-lg">
                                        <MdError className="text-white text-lg" />
                                    </div>
                                    <p className="text-red-800 font-semibold">{errorMessage}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="flex items-center gap-2 text-gray-800 font-semibold mb-3">
                                        <MdPerson className="text-orange-600" />
                                        Local ID
                                    </label>
                                    <input
                                        type="text"
                                        name="LocalID"
                                        value={formData.LocalID}
                                        onChange={handleChange}
                                        placeholder="Enter unique local ID"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all duration-200 shadow-sm hover:border-gray-300"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <label className="flex items-center gap-2 text-gray-800 font-semibold mb-3">
                                        <MdPerson className="text-blue-600" />
                                        Local Name
                                    </label>
                                    <input
                                        type="text"
                                        name="LocalName"
                                        value={formData.LocalName}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 shadow-sm hover:border-gray-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="flex items-center gap-2 text-gray-800 font-semibold mb-3">
                                    <MdHome className="text-green-600" />
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="LocalAddress"
                                    value={formData.LocalAddress}
                                    onChange={handleChange}
                                    placeholder="Enter complete address with landmarks"
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200 shadow-sm hover:border-gray-300"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="flex items-center gap-2 text-gray-800 font-semibold mb-3">
                                        <MdPhone className="text-purple-600" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="LocalPhone"
                                        value={formData.LocalPhone}
                                        onChange={handleChange}
                                        placeholder="Enter 10-digit mobile number"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all duration-200 shadow-sm hover:border-gray-300"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <label className="flex items-center gap-2 text-gray-800 font-semibold mb-3">
                                        <MdPayment className="text-indigo-600" />
                                        UPI ID
                                    </label>
                                    <input
                                        type="text"
                                        name="LocalUPI"
                                        value={formData.LocalUPI}
                                        onChange={handleChange}
                                        placeholder="username@upi or mobile@upi"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 shadow-sm hover:border-gray-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    <MdCancel className="text-lg" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:from-orange-300 disabled:to-orange-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-sm flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Adding Local...
                                        </>
                                    ) : (
                                        <>
                                            <MdPersonAdd className="text-lg" />
                                            Add Local
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
