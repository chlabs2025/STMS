"use client"

import { useState, useEffect } from "react"
import { MdSettings, MdCheckCircle, MdError, MdEco, MdSave, MdEdit, MdClose } from 'react-icons/md'
import api from "../../api/axios"
import API from "../../api/endpoints"
import { t } from "../../i18n/translations"
import { useLang } from "../../context/LanguageContext"
import T from "../../i18n/T"

export default function Settings({ activeTab: initialTab }) {
    const { lang } = useLang()
    const [activeTab, setActiveTab] = useState(initialTab || "pricing")
    const [price, setPrice] = useState("")
    const [seller, setSeller] = useState({
        businessName: "",
        address: "",
        gstin: "",
        state: "",
        stateCode: "",
        phone: ""
    })
    const [loading, setLoading] = useState(false)
    const [sellerLoading, setSellerLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const [isPriceEditing, setIsPriceEditing] = useState(false)
    const [isSellerEditing, setIsSellerEditing] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")


    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [priceRes, sellerRes] = await Promise.all([
                    api.get(API.IMLI_PRICE),
                    api.get(API.GET_SETTINGS)
                ])

                if (priceRes.data?.success) {
                    setPrice(priceRes.data.data.price.toString())
                }

                if (sellerRes.data?.success && sellerRes.data.data.seller) {
                    setSeller(sellerRes.data.data.seller)
                }
            } catch (error) {
                console.error("Error fetching settings:", error)
            } finally {
                setPageLoading(false)
            }
        }

        fetchSettings()
    }, [])


    useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab)
        }
    }, [initialTab])


    const handleUpdatePrice = async (e) => {
        e.preventDefault()
        if (!price || isNaN(price)) {
            setErrorMessage(t("Please enter a valid price", lang))
            return
        }

        setLoading(true)
        setSuccessMessage("")
        setErrorMessage("")

        try {
            const response = await api.patch(API.IMLI_PRICE, { price: Number(price) })
            setSuccessMessage(t("Price updated successfully", lang))
            setIsPriceEditing(false)
            console.log("Response:", response.data)
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || t("Failed to update price. Please try again.", lang)
            )
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveSeller = async (e) => {
        e.preventDefault()
        setSellerLoading(true)
        setSuccessMessage("")
        setErrorMessage("")

        try {
            const response = await api.post(API.SAVE_SETTINGS, { seller })
            setSuccessMessage(t("Business details updated successfully", lang))
            setIsSellerEditing(false)
            console.log("Response:", response.data)
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || t("Failed to update business details", lang)
            )
            console.error("Error:", error)
        } finally {
            setSellerLoading(false)
        }
    }

    const handleSellerChange = (e) => {
        const { name, value } = e.target
        setSeller(prev => ({ ...prev, [name]: value }))
    }

    const tabs = [
        { id: 'pricing', label: 'Pricing', icon: MdEco },
        { id: 'business', label: 'Business Profile', icon: MdSettings },
    ]

    return (
        <div className="min-h-full bg-[#F8FAFC] p-3 md:p-6 overflow-x-hidden">
            <div className="max-w-3xl mx-auto mb-6">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => { setActiveTab("pricing"); setSuccessMessage(""); setErrorMessage(""); }}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === "pricing" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        <T k="Pricing" />
                    </button>
                    <button
                        onClick={() => { setActiveTab("business"); setSuccessMessage(""); setErrorMessage(""); }}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === "business" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        <T k="Business Profile" />
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto flex flex-col gap-6">
                
                {/* Content Panel */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative flex flex-col min-h-[450px] transition-all duration-300">
                    <div className="flex-1 relative">
                        {pageLoading && (
                            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 md:w-10 md:h-10 border-3 md:border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-orange-600 font-semibold text-sm animate-pulse"><T k="Loading..." /></p>
                                </div>
                            </div>
                        )}

                        <div className="p-6 md:p-10 lg:p-12">
                            {/* Status Messages overlay */}
                            <div className="z-40 pointer-events-none mb-6">
                                {successMessage && (
                                    <div className="pointer-events-auto p-4 bg-green-50/95 border border-green-200 rounded-xl shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <MdCheckCircle className="text-green-500 text-lg shrink-0" />
                                        <p className="text-green-900 text-xs md:text-sm font-bold">{successMessage}</p>
                                    </div>
                                )}
                                {errorMessage && (
                                    <div className="pointer-events-auto p-4 bg-red-50/95 border border-red-200 rounded-xl shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <MdError className="text-red-500 text-lg shrink-0" />
                                        <p className="text-red-900 text-xs md:text-sm font-bold">{errorMessage}</p>
                                    </div>
                                )}
                            </div>

                            {activeTab === 'pricing' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                                        <div>
                                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Imli Price Configuration</h2>
                                            <p className="text-gray-400 text-xs md:text-sm mt-1 font-semibold uppercase tracking-wider">Set standard price for cleaned imli</p>
                                        </div>
                                        <button
                                            onClick={() => setIsPriceEditing(!isPriceEditing)}
                                            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-300 active:scale-95 ${isPriceEditing
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                                                : 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-100'
                                                }`}
                                        >
                                            {isPriceEditing ? (
                                                <><MdClose className="text-lg" /><T k="Cancel" /></>
                                            ) : (
                                                <><MdEdit className="text-lg" /><T k="Edit" /></>
                                            )}
                                        </button>
                                    </div>

                                    <form onSubmit={handleUpdatePrice} className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                                <T k="Price" /> (Per Cleaned Imli)
                                            </label>
                                            <div className="relative group max-w-xs">
                                                <span className={`absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold transition-colors ${isPriceEditing ? 'text-orange-500' : 'text-gray-300'}`}>₹</span>
                                                <input
                                                    type="number"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    onWheel={(e) => e.target.blur()}
                                                    placeholder="e.g. 15"
                                                    className={`w-full pl-12 pr-6 py-4 md:py-5 bg-white border rounded-2xl text-xl font-bold transition-all duration-500 focus:outline-none focus:ring-8 focus:ring-orange-500/5 ${isPriceEditing
                                                        ? 'border-orange-500 shadow-xl shadow-orange-500/10'
                                                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                    required
                                                    disabled={!isPriceEditing}
                                                />
                                            </div>
                                            <p className="text-xs md:text-sm text-gray-400 font-semibold px-1 mt-3 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                                Used for calculating all future payments to locals.
                                            </p>
                                        </div>

                                        {isPriceEditing && (
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full max-w-xs py-4 md:py-5 bg-orange-600 text-white rounded-2xl font-bold text-sm hover:bg-orange-700 transition-all duration-300 disabled:bg-gray-200 disabled:cursor-not-allowed shadow-xl shadow-orange-600/20 flex items-center justify-center gap-3 active:scale-95"
                                            >
                                                {loading ? (
                                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <><MdSave className="text-xl" /><T k="Update Price" /></>
                                                )}
                                            </button>
                                        )}
                                    </form>
                                </div>
                            )}

                            {activeTab === 'business' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                                        <div>
                                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight"><T k="Business Settings" /></h2>
                                            <p className="text-gray-400 text-xs md:text-sm mt-1 font-semibold uppercase tracking-wider">Manage seller profile & address</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsSellerEditing(!isSellerEditing)}
                                            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-300 active:scale-95 ${isSellerEditing
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                                                : 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-100'
                                                }`}
                                        >
                                            {isSellerEditing ? (
                                                <><MdClose className="text-lg" /><T k="Cancel" /></>
                                            ) : (
                                                <><MdEdit className="text-lg" /><T k="Edit" /></>
                                            )}
                                        </button>
                                    </div>

                                    <form onSubmit={handleSaveSeller} className="space-y-8 md:space-y-12">
                                        <div className="grid md:grid-cols-2 gap-8 md:gap-x-12 md:gap-y-10">
                                            {/* Business Name */}
                                            <div className="space-y-2.5">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                                    <T k="Business Name" />
                                                </label>
                                                <input
                                                    name="businessName"
                                                    value={seller.businessName}
                                                    onChange={handleSellerChange}
                                                    type="text"
                                                    className={`w-full px-5 py-3.5 border rounded-xl text-base font-bold transition-all duration-300 focus:outline-none focus:ring-8 focus:ring-orange-500/5 ${isSellerEditing
                                                        ? 'border-orange-500 bg-white shadow-lg shadow-orange-500/5'
                                                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                    required
                                                    disabled={!isSellerEditing}
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div className="space-y-2.5">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                                    <T k="Phone" />
                                                </label>
                                                <input
                                                    name="phone"
                                                    value={seller.phone}
                                                    onChange={handleSellerChange}
                                                    type="text"
                                                    className={`w-full px-5 py-3.5 border rounded-xl text-base font-bold transition-all duration-300 focus:outline-none focus:ring-8 focus:ring-orange-500/5 ${isSellerEditing
                                                        ? 'border-orange-500 bg-white shadow-lg shadow-orange-500/5'
                                                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                    disabled={!isSellerEditing}
                                                />
                                            </div>

                                            {/* GSTIN */}
                                            <div className="space-y-2.5">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                                    <T k="GSTIN" />
                                                </label>
                                                <input
                                                    name="gstin"
                                                    value={seller.gstin}
                                                    onChange={handleSellerChange}
                                                    type="text"
                                                    className={`w-full px-5 py-3.5 border rounded-xl text-base font-bold transition-all duration-300 focus:outline-none focus:ring-8 focus:ring-orange-500/5 ${isSellerEditing
                                                        ? 'border-orange-500 bg-white shadow-lg shadow-orange-500/5'
                                                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                    required
                                                    disabled={!isSellerEditing}
                                                />
                                            </div>

                                            {/* State */}
                                            <div className="space-y-2.5">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                                    <T k="State" />
                                                </label>
                                                <input
                                                    name="state"
                                                    value={seller.state}
                                                    onChange={handleSellerChange}
                                                    type="text"
                                                    className={`w-full px-5 py-3.5 border rounded-xl text-base font-bold transition-all duration-300 focus:outline-none focus:ring-8 focus:ring-orange-500/5 ${isSellerEditing
                                                        ? 'border-orange-500 bg-white shadow-lg shadow-orange-500/5'
                                                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                    required
                                                    disabled={!isSellerEditing}
                                                />
                                            </div>

                                            {/* State Code */}
                                            <div className="space-y-2.5">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                                    <T k="State Code" />
                                                </label>
                                                <input
                                                    name="stateCode"
                                                    value={seller.stateCode}
                                                    onChange={handleSellerChange}
                                                    type="text"
                                                    className={`w-full px-5 py-3.5 border rounded-xl text-base font-bold transition-all duration-300 focus:outline-none focus:ring-8 focus:ring-orange-500/5 ${isSellerEditing
                                                        ? 'border-orange-500 bg-white shadow-lg shadow-orange-500/5'
                                                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                    required
                                                    disabled={!isSellerEditing}
                                                />
                                            </div>

                                            {/* Address */}
                                            <div className="md:col-span-2 space-y-2.5">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                                    <T k="Address" />
                                                </label>
                                                <textarea
                                                    name="address"
                                                    value={seller.address}
                                                    onChange={handleSellerChange}
                                                    rows="4"
                                                    className={`w-full px-5 py-4 border rounded-xl text-base font-bold transition-all duration-300 focus:outline-none focus:ring-8 focus:ring-orange-500/5 ${isSellerEditing
                                                        ? 'border-orange-500 bg-white shadow-lg shadow-orange-500/5'
                                                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                    required
                                                    disabled={!isSellerEditing}
                                                ></textarea>
                                            </div>
                                        </div>

                                        {isSellerEditing && (
                                            <button
                                                type="submit"
                                                disabled={sellerLoading}
                                                className="w-full py-4 md:py-5 bg-orange-600 text-white rounded-2xl font-bold text-sm hover:bg-orange-700 transition-all duration-300 disabled:bg-gray-200 disabled:cursor-not-allowed shadow-xl shadow-orange-600/20 flex items-center justify-center gap-3 active:scale-95"
                                            >
                                                {sellerLoading ? (
                                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <><MdSave className="text-xl" /><T k="Update Business Details" /></>
                                                )}
                                            </button>
                                        )}
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
