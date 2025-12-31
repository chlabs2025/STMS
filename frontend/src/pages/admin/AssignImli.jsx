"use client"

import { useState, useEffect } from "react"
import api from "../../api/axios"
import toast from "react-hot-toast"

const AssignImli = () => {
  const [formData, setFormData] = useState({
    LocalID: "",
    assignedQuantity: "",
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
      assignedQuantity: value,
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

      if (!formData.assignedQuantity || parseFloat(formData.assignedQuantity) <= 0) {
        toast.error("Please enter valid quantity")
        setLoading(false)
        return
      }

      // Send data exactly as backend expects
      const response = await api.post("/assignImli", {
        LocalID: selectedLocal.LocalID.toString(), // Send as String (backend expects String in DB)
        assignedQuantity: parseFloat(formData.assignedQuantity),
      })

      toast.success(`${formData.assignedQuantity} KG assigned to ${selectedLocal.LocalName}`)
      setFormData({ LocalID: "", assignedQuantity: "" })
      setSelectedLocal(null)
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to assign imli"
      toast.error(`${errorMsg}`)
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ LocalID: "", assignedQuantity: "" })
    setSelectedLocal(null)
    setShowDropdown(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Assign Imli</h1>
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
            {fetchingLocals ? (
              <div className="text-center py-8">
                <p className="text-gray-600 text-sm">Loading locals data...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Local Search with Dropdown */}
                <div className="relative">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Select Local</label>
                  <input
                    type="text"
                    placeholder="Search by Local ID or Name (e.g., 202 or Faraaz)"
                    value={formData.LocalID}
                    onChange={handleSearchChange}
                    onFocus={() => filteredLocals.length > 0 && setShowDropdown(true)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm transition"
                  />

                  {/* Dropdown List */}
                  {showDropdown && filteredLocals.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {filteredLocals.map((local) => (
                        <div
                          key={local._id}
                          onClick={() => handleSelectLocal(local)}
                          className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 text-sm"
                        >
                          <div className="font-semibold text-gray-900">{local.LocalID} - {local.LocalName}</div>
                          <div className="text-xs text-gray-500">{local.LocalAddress}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Local Display */}
                {selectedLocal && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Selected:</span> {selectedLocal.LocalID} - {selectedLocal.LocalName}
                    </p>
                  </div>
                )}

                {/* Quantity Input */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Quantity (KG)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter quantity in KG"
                    value={formData.assignedQuantity}
                    onChange={handleQuantityChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm transition"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
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
                        Assigning...
                      </>
                    ) : (
                      <>
                        <span>✓</span>
                        <span>Assign</span>
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

export default AssignImli
