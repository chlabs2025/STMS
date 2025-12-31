"use client"

import { useState } from "react"
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-white">Add Local</h1>
                            <p className="text-gray-300 text-xs">
                                {new Date().toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}{" "}
                                • {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {successMessage && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-lg">
                                <p className="text-green-700 font-medium text-sm">{successMessage}</p>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg">
                                <p className="text-red-700 font-medium text-sm">{errorMessage}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Local ID</label>
                                    <input
                                        type="text"
                                        name="LocalID"
                                        value={formData.LocalID}
                                        onChange={handleChange}
                                        placeholder="Local ID"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Local Name</label>
                                    <input
                                        type="text"
                                        name="LocalName"
                                        value={formData.LocalName}
                                        onChange={handleChange}
                                        placeholder="Local Name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Address</label>
                                <input
                                    type="text"
                                    name="LocalAddress"
                                    value={formData.LocalAddress}
                                    onChange={handleChange}
                                    placeholder="Enter full address"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Phone</label>
                                    <input
                                        type="tel"
                                        name="LocalPhone"
                                        value={formData.LocalPhone}
                                        onChange={handleChange}
                                        placeholder="Phone number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1.5 text-sm">UPI ID</label>
                                    <input
                                        type="text"
                                        name="LocalUPI"
                                        value={formData.LocalUPI}
                                        onChange={handleChange}
                                        placeholder="UPI ID"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors disabled:bg-gray-500 flex items-center justify-center gap-1.5"
                                >
                                    {loading ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <span>+</span>
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
