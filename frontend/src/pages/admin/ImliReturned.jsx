"use client"

import { useState, useEffect } from "react"
import { MdKeyboardReturn, MdSearch, MdPerson, MdScale, MdCancel, MdCheck, MdSchedule, MdLocationOn, MdInventory } from 'react-icons/md'
import api from "../../api/axios"
import toast from "react-hot-toast"

const ImliReturned = () => {
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

  // Fetch all locals on component mount
  useEffect(() => {
    const fetchLocals = async () => {
      try {
        const response = await api.post("/getlocalData")
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
        totalAssignedQuantity: prev.totalAssignedQuantity - returnedQuantity,
      }))

      // Update allLocals to reflect the change
      setAllLocals((prev) =>
        prev.map((local) =>
          local.LocalID === selectedLocal.LocalID
            ? { ...local, totalAssignedQuantity: local.totalAssignedQuantity - returnedQuantity }
            : local
        )
      )

      toast.success(`${returnedQuantity} KG returned from ${selectedLocal.LocalName}`)
      setFormData({ LocalID: "", returnedQuantity: "" })
      setSelectedLocal(null)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <MdKeyboardReturn className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Return Imli</h1>
                  <p className="text-orange-100 text-sm font-medium">Process cleaned imli returns from locals</p>
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
            {fetchingLocals ? (
              <div className="text-center py-12">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 font-medium">Loading locals data...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Local Search with Dropdown */}
                <div className="relative overflow-visible z-50">
                  <label className="flex items-center gap-3 text-gray-800 font-semibold mb-4 text-lg">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MdSearch className="text-blue-600 text-xl" />
                    </div>
                    <span>Select Local</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by Local ID or Name (e.g., 202 or Faraaz)"
                      value={formData.LocalID}
                      onChange={handleSearchChange}
                      onFocus={() => filteredLocals.length > 0 && setShowDropdown(true)}
                      className="w-full px-6 py-4 pl-14 bg-gray-50 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 shadow-sm hover:border-gray-300 text-lg font-medium"
                    />
                    <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                  </div>
                  <p className="text-gray-500 text-sm mt-2 ml-1">Search for locals with assigned imli</p>

                  {/* Dropdown List */}
                  {showDropdown && filteredLocals.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto backdrop-blur-sm">
                      {filteredLocals.map((local) => (
                        <div
                          key={local._id}
                          onClick={() => handleSelectLocal(local)}
                          className="px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-500 p-2 rounded-lg">
                              <MdPerson className="text-white text-sm" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-lg">{local.LocalID} - {local.LocalName}</div>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <MdInventory className="text-xs" />
                                  Assigned: {local.totalAssignedQuantity} KG
                                </div>
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
                  <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <MdCheck className="text-white text-lg" />
                      </div>
                      <div className="flex-1">
                        <p className="text-green-800 font-semibold text-lg">
                          Selected: {selectedLocal.LocalID} - {selectedLocal.LocalName}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2">
                        <MdInventory className="text-green-600" />
                        <span className="text-green-800 font-semibold">
                          Total Assigned: {selectedLocal.totalAssignedQuantity} KG
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity Input */}
                {selectedLocal && (
                  <div className="relative">
                    <label className="flex items-center gap-3 text-gray-800 font-semibold mb-4 text-lg">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <MdScale className="text-purple-600 text-xl" />
                      </div>
                      <span>Return Quantity (KG)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max={selectedLocal.totalAssignedQuantity}
                        placeholder={`Enter quantity to return (Max: ${selectedLocal.totalAssignedQuantity} KG)`}
                        value={formData.returnedQuantity}
                        onChange={handleQuantityChange}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all duration-200 shadow-sm hover:border-gray-300 text-lg font-medium"
                        required
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                        KG
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-2 ml-1">
                      Maximum returnable: {selectedLocal.totalAssignedQuantity} KG
                    </p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
                  >
                    <MdCancel className="text-xl" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !selectedLocal || !formData.returnedQuantity}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-sm flex items-center justify-center gap-2 text-lg"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Returning...
                      </>
                    ) : (
                      <>
                        <MdKeyboardReturn className="text-xl" />
                        <span>Return Imli</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImliReturned
