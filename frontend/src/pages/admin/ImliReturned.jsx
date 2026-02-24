"use client"

import { useState, useEffect } from "react"
import { MdKeyboardReturn, MdSearch, MdPerson, MdScale, MdCancel, MdCheck, MdSchedule, MdLocationOn, MdInventory } from 'react-icons/md'
import api from "../../api/axios"
import toast from "react-hot-toast"
import SuccessModal from "../../components/common/SuccessModal"
import { useLang } from "../../context/LanguageContext"
import T from "../../i18n/T"

const ImliReturned = () => {
  const { lang } = useLang()
  const [formData, setFormData] = useState({
    LocalID: "",
    returnedQuantity: "",
  })
  const [allLocals, setAllLocals] = useState([])
  const [filteredLocals, setFilteredLocals] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedLocal, setSelectedLocal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchingLocals, setFetchingLocals] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lastReturnedData, setLastReturnedData] = useState(null)

  // Fetch all locals on component mount
  useEffect(() => {
    const fetchLocals = async () => {
      try {
        const response = await api.post("/return_local")
        console.log("Locals response:", response.data) // Debug log
        if (response.data && response.data.data) {
          setAllLocals(response.data.data)
          console.log("Locals set:", response.data.data) // Debug log
        }
      } catch (error) {
        toast.error("Failed to fetch locals data")
        console.error("Error fetching locals:", error)
      } finally {
        setFetchingLocals(false)
      }
    }

    fetchLocals()
  }, [])

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      LocalID: value,
    }))

    if (value.trim() === "") {
      setFilteredLocals([])
      setShowDropdown(false)
      setSelectedLocal(null)
    } else {
      // Filter locals based on LocalID or LocalName
      const filtered = allLocals.filter(
        (local) =>
          local.LocalID.toString().includes(value) ||
          local.LocalName.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredLocals(filtered)
      setShowDropdown(filtered.length > 0)
    }
  }

  // Handle local selection from dropdown
  const handleSelectLocal = (local) => {
    setSelectedLocal(local)
    setFormData((prev) => ({
      ...prev,
      LocalID: `${local.LocalID} - ${local.LocalName}`,
    }))
    setShowDropdown(false)
    setFilteredLocals([])
  }

  const handleQuantityChange = (e) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      returnedQuantity: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!selectedLocal) {
        toast.error("Please select a local")
        setLoading(false)
        return
      }

      if (!formData.returnedQuantity || parseFloat(formData.returnedQuantity) <= 0) {
        toast.error("Please enter valid quantity")
        setLoading(false)
        return
      }

      if (parseFloat(formData.returnedQuantity) > selectedLocal.totalAssignedQuantity) {
        toast.error(`Cannot return more than ${selectedLocal.totalAssignedQuantity} KG assigned`)
        setLoading(false)
        return
      }

      const returnedQuantity = parseFloat(formData.returnedQuantity)

      // Send data to backend
      const response = await api.post("/returnimli", {
        LocalID: selectedLocal.LocalID.toString(),
        returnedQuantity: returnedQuantity,
      })

      // Update the selectedLocal state dynamically
      setSelectedLocal((prev) => ({
        ...prev,
        totalReturnedQuantity: (prev.totalReturnedQuantity || 0) + returnedQuantity,
      }))

      // Update allLocals to reflect the change
      setAllLocals((prev) =>
        prev.map((local) =>
          local.LocalID === selectedLocal.LocalID
            ? { ...local, totalReturnedQuantity: (local.totalReturnedQuantity || 0) + returnedQuantity }
            : local
        )
      )

      setLastReturnedData({
        quantity: returnedQuantity,
        localName: selectedLocal.LocalName
      })
      setShowSuccessModal(true)

      setFormData({ LocalID: "", returnedQuantity: "" })
      setSelectedLocal(null)
      setShowDropdown(false)
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to return imli"
      toast.error(`${errorMsg}`)
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ LocalID: "", returnedQuantity: "" })
    setSelectedLocal(null)
    setShowDropdown(false)
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
                  <MdKeyboardReturn className="text-xl md:text-2xl text-orange-600" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900"><T k="Return Imli" /></h1>
                  <p className="text-gray-500 text-xs md:text-sm font-medium"><T k="Process cleaned imli returns from locals" /></p>
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
            {fetchingLocals ? (
              <div className="text-center py-12">
                <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100">
                  <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-500 font-medium"><T k="Loading locals data..." /></p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-8">
                {/* Local Search with Dropdown */}
                <div className="relative overflow-visible z-50">
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                    <MdSearch className="text-orange-500 text-lg" />
                    <span><T k="Select Local" /></span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by Local ID or Name (e.g., 202 or Faraaz)"
                      value={formData.LocalID}
                      onChange={handleSearchChange}
                      onFocus={() => filteredLocals.length > 0 && setShowDropdown(true)}
                      className="w-full px-4 py-3 pl-10 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
                      style={{ fontSize: '16px' }}
                    />
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  </div>
                  <p className="text-gray-400 text-xs mt-1.5 ml-1"><T k="Search for locals with assigned imli" /></p>

                  {/* Dropdown List */}
                  {showDropdown && filteredLocals.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {filteredLocals.map((local) => (
                        <div
                          key={local._id}
                          onClick={() => handleSelectLocal(local)}
                          className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors duration-150"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-1.5 rounded text-orange-600">
                              <MdPerson className="text-sm" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-sm">{local.LocalID} - {local.LocalName}</div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                Assigned: <span className="font-medium text-gray-700">{local.totalAssignedQuantity} KG</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Local Display */}
                {selectedLocal && (
                  <div className="p-4 md:p-5 bg-orange-50 rounded-lg border border-orange-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-full border border-orange-200 shadow-sm">
                        <MdCheck className="text-orange-600 text-lg" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold text-sm md:text-base">
                          {selectedLocal.LocalName}
                        </p>
                        <p className="text-gray-500 text-xs font-medium">ID: {selectedLocal.LocalID}</p>
                      </div>
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded border border-orange-200/50 shadow-sm ml-11 sm:ml-0">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mr-2"><T k="Assigned" /></span>
                      <span className="text-orange-600 font-bold text-base md:text-lg">
                        {selectedLocal.totalAssignedQuantity} <span className="text-xs text-gray-400 font-normal">KG</span>
                      </span>
                    </div>
                  </div>
                )}

                {/* Quantity Input */}
                {selectedLocal && (
                  <div className="relative">
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                      <MdScale className="text-orange-500 text-lg" />
                      <span><T k="Return Quantity" /></span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max={selectedLocal.totalAssignedQuantity}
                        placeholder="0.00"
                        value={formData.returnedQuantity}
                        onChange={handleQuantityChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
                        style={{ fontSize: '16px' }}
                        required
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-sm bg-gray-50 px-2 py-1 rounded border border-gray-200">
                        KG
                      </div>
                    </div>
                  </div>
                )}

                {/* Buttons */}
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
                    disabled={loading || !selectedLocal || !formData.returnedQuantity}
                    className="flex-1 px-4 py-3 md:py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <T k="Processing..." />
                      </>
                    ) : (
                      <>
                        <MdKeyboardReturn className="text-lg" />
                        <span><T k="Confirm Return" /></span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Return Successful!"
        message={`${lastReturnedData?.quantity} KG of Cleaned Imli has been successfully returned from ${lastReturnedData?.localName}.`}
        subMessage="The inventory and assignment records have been updated."
      />
    </div>
  )
}

export default ImliReturned
