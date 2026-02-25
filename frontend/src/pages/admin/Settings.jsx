"use client"

import { useState, useEffect } from "react"
import { MdSettings, MdCheckCircle, MdError, MdEco, MdSave, MdEdit, MdClose } from 'react-icons/md'
import api from "../../api/axios"
import { t } from "../../i18n/translations"
import { useLang } from "../../context/LanguageContext"
import T from "../../i18n/T"

export default function Settings() {
    const { lang } = useLang()
    const [activeTab, setActiveTab] = useState("pricing") // "pricing" or "business"
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
                    api.get("/imli-price"),
                    api.get("/")
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
            const response = await api.patch("/imli-price", { price: Number(price) })
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
            const response = await api.post("/saveSetting", { seller })
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

    const sidebarItems = [
        { id: 'pricing', label: 'Pricing', icon: MdEco },
        { id: 'business', label: 'Business Profile', icon: MdSettings },
    ]

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-3 md:p-8">
            <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 md:gap-4 bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="bg-orange-50 p-2.5 md:p-3 rounded-xl border border-orange-100">
                        <MdSettings className="text-xl md:text-2xl text-orange-600" />
                    </div>
                    <div>
                        <h1 className="text-lg md:text-2xl font-semibold text-gray-900"><T k="Settings" /></h1>
                        <p className="text-gray-400 text-xs md:text-sm font-medium">Manage configuration & pricing</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    {/* Sidebar — horizontal tabs on mobile, vertical on desktop */}
                    <div className="w-full md:w-64 shrink-0">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-1.5 md:p-2 flex md:flex-col gap-1">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id)
                                        setSuccessMessage("")
                                        setErrorMessage("")
                                    }}
                                    className={`flex-1 md:flex-none w-full flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl font-semibold text-xs md:text-sm transition-all duration-200 ${activeTab === item.id
                                        ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
                                        : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
                                        }`}
                                >
                                    <item.icon className="text-lg md:text-xl" />
                                    <T k={item.label} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Panel */}
                    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[300px] md:min-h-[500px]">
                        {pageLoading && (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 md:w-10 md:h-10 border-3 md:border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-orange-600 font-semibold text-sm animate-pulse"><T k="Loading..." /></p>
                                </div>
                            </div>
                        )}

                        <div className="p-4 md:p-8">
                            {successMessage && (
                                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm flex items-center gap-2.5 md:gap-3">
                                    <MdCheckCircle className="text-green-500 text-base md:text-lg shrink-0" />
                                    <p className="text-green-800 font-medium text-xs md:text-sm">{successMessage}</p>
                                </div>
                            )}

                            {errorMessage && (
                                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm flex items-center gap-2.5 md:gap-3">
                                    <MdError className="text-red-500 text-base md:text-lg shrink-0" />
                                    <p className="text-red-800 font-medium text-xs md:text-sm">{errorMessage}</p>
                                </div>
                            )}

                            {/* Conditional Rendering based on activeTab */}
                            {activeTab === 'pricing' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex items-center justify-between mb-5 md:mb-8">
                                        <div>
                                            <h2 className="text-base md:text-xl font-semibold text-gray-900 leading-tight">Imli Price Configuration</h2>
                                            <p className="text-gray-400 text-xs md:text-sm mt-0.5 md:mt-1 font-medium">Set the standard price for cleaned imli</p>
                                        </div>
                                        <button
                                            onClick={() => setIsPriceEditing(!isPriceEditing)}
                                            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-xl font-semibold text-xs md:text-sm flex items-center gap-1.5 md:gap-2 transition-all duration-200 ${isPriceEditing
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                                }`}
                                        >
                                            {isPriceEditing ? (
                                                <>
                                                    <MdClose className="text-base md:text-lg" />
                                                    <T k="Cancel" />
                                                </>
                                            ) : (
                                                <>
                                                    <MdEdit className="text-base md:text-lg" />
                                                    <T k="Edit" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <form onSubmit={handleUpdatePrice} className="max-w-md space-y-5 md:space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider ml-1">
                                                <T k="Price" /> (Per Cleaned Imli)
                                            </label>
                                            <div className="relative group">
                                                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-semibold transition-colors ${isPriceEditing ? 'text-orange-500' : 'text-gray-400'}`}>₹</span>
                                                <input
                                                    type="number"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    placeholder="e.g. 15"
                                                    style={{ fontSize: '16px' }}
                                                    className={`w-full pl-10 pr-4 py-3 md:py-4 bg-white border rounded-xl md:rounded-2xl text-base md:text-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/10 ${isPriceEditing
                                                        ? 'border-orange-500 shadow-sm'
                                                        : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    required
                                                    disabled={!isPriceEditing}
                                                />
                                            </div>
                                            <p className="text-[10px] md:text-xs text-gray-400 font-medium px-1">
                                                * Used for calculating all future payments to locals.
                                            </p>
                                        </div>

                                        {isPriceEditing && (
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full py-3 md:py-4 bg-orange-600 text-white rounded-xl md:rounded-2xl font-medium text-sm hover:bg-orange-700 transition-all duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                                            >
                                                {loading ? (
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <MdSave className="text-lg md:text-xl" />
                                                        <T k="Update Price" />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </form>
                                </div>
                            )}

                            {activeTab === 'business' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex items-center justify-between mb-5 md:mb-8">
                                        <div>
                                            <h2 className="text-base md:text-xl font-semibold text-gray-900 leading-tight"><T k="Business Settings" /></h2>
                                            <p className="text-gray-400 text-xs md:text-sm mt-0.5 md:mt-1 font-medium">Manage seller profile & address</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsSellerEditing(!isSellerEditing)}
                                            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-xl font-semibold text-xs md:text-sm flex items-center gap-1.5 md:gap-2 transition-all duration-200 ${isSellerEditing
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                                }`}
                                        >
                                            {isSellerEditing ? (
                                                <>
                                                    <MdClose className="text-base md:text-lg" />
                                                    <T k="Cancel" />
                                                </>
                                            ) : (
                                                <>
                                                    <MdEdit className="text-base md:text-lg" />
                                                    <T k="Edit" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <form onSubmit={handleSaveSeller} className="space-y-5 md:space-y-8">
                                        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                                            {/* Business Name */}
                                            <div className="space-y-1.5 md:space-y-2">
                                                <label className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider ml-1">
                                                    <T k="Business Name" />
                                                </label>
                                                <input
                                                    name="businessName"
                                                    value={seller.businessName}
                                                    onChange={handleSellerChange}
                                                    type="text"
                                                    style={{ fontSize: '16px' }}
                                                    className={`w-full px-4 md:px-5 py-2.5 md:py-3 border rounded-xl text-sm md:text-base font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/10 ${isSellerEditing
                                                        ? 'border-orange-500 bg-white'
                                                        : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    required
                                                    disabled={!isSellerEditing}
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div className="space-y-1.5 md:space-y-2">
                                                <label className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider ml-1">
                                                    <T k="Phone" />
                                                </label>
                                                <input
                                                    name="phone"
                                                    value={seller.phone}
                                                    onChange={handleSellerChange}
                                                    type="text"
                                                    style={{ fontSize: '16px' }}
                                                    className={`w-full px-4 md:px-5 py-2.5 md:py-3 border rounded-xl text-sm md:text-base font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/10 ${isSellerEditing
                                                        ? 'border-orange-500 bg-white'
                                                        : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    disabled={!isSellerEditing}
                                                />
                                            </div>

                                            {/* GSTIN */}
                                            <div className="space-y-1.5 md:space-y-2">
                                                <label className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider ml-1">
                                                    <T k="GSTIN" />
                                                </label>
                                                <input
                                                    name="gstin"
                                                    value={seller.gstin}
                                                    onChange={handleSellerChange}
                                                    type="text"
                                                    style={{ fontSize: '16px' }}
                                                    className={`w-full px-4 md:px-5 py-2.5 md:py-3 border rounded-xl text-sm md:text-base font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/10 ${isSellerEditing
                                                        ? 'border-orange-500 bg-white'
                                                        : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    required
                                                    disabled={!isSellerEditing}
                                                />
                                            </div>

                                            {/* State */}
                                            <div className="space-y-1.5 md:space-y-2">
                                                <label className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider ml-1">
                                                    <T k="State" />
                                                </label>
                                                <input
                                                    name="state"
                                                    value={seller.state}
                                                    onChange={handleSellerChange}
                                                    type="text"
                                                    style={{ fontSize: '16px' }}
                                                    className={`w-full px-4 md:px-5 py-2.5 md:py-3 border rounded-xl text-sm md:text-base font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/10 ${isSellerEditing
                                                        ? 'border-orange-500 bg-white'
                                                        : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    required
                                                    disabled={!isSellerEditing}
                                                />
                                            </div>

                                            {/* State Code */}
                                            <div className="space-y-1.5 md:space-y-2">
                                                <label className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider ml-1">
                                                    <T k="State Code" />
                                                </label>
                                                <input
                                                    name="stateCode"
                                                    value={seller.stateCode}
                                                    onChange={handleSellerChange}
                                                    type="text"
                                                    style={{ fontSize: '16px' }}
                                                    className={`w-full px-4 md:px-5 py-2.5 md:py-3 border rounded-xl text-sm md:text-base font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/10 ${isSellerEditing
                                                        ? 'border-orange-500 bg-white'
                                                        : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    required
                                                    disabled={!isSellerEditing}
                                                />
                                            </div>

                                            {/* Address */}
                                            <div className="md:col-span-2 space-y-1.5 md:space-y-2">
                                                <label className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider ml-1">
                                                    <T k="Address" />
                                                </label>
                                                <textarea
                                                    name="address"
                                                    value={seller.address}
                                                    onChange={handleSellerChange}
                                                    rows="3"
                                                    style={{ fontSize: '16px' }}
                                                    className={`w-full px-4 md:px-5 py-2.5 md:py-3 border rounded-xl text-sm md:text-base font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/10 ${isSellerEditing
                                                        ? 'border-orange-500 bg-white'
                                                        : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
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
                                                className="w-full py-3 md:py-4 bg-orange-600 text-white rounded-xl md:rounded-2xl font-medium text-sm hover:bg-orange-700 transition-all duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                                            >
                                                {sellerLoading ? (
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <MdSave className="text-lg md:text-xl" />
                                                        <T k="Update Business Details" />
                                                    </>
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


