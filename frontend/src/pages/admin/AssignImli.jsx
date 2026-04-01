"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MdAssignment, MdSearch, MdPerson, MdScale, MdCancel, MdCheck, MdSchedule, MdLocationOn } from 'react-icons/md'
import api from "../../api/axios"
import API from "../../api/endpoints"
import toast from "react-hot-toast"
import { useLang } from "../../context/LanguageContext"
import T from "../../i18n/T"

const AssignImli = ({ prefilledLocalId, prefilledLocal }) => {
  const { lang } = useLang()
  const [formData, setFormData] = useState({
    LocalID: "",
    assignedQuantity: "",
  })
  const [allLocals, setAllLocals] = useState([])
  const [filteredLocals, setFilteredLocals] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const quantityInputRef = useRef(null)
  const dropdownRef = useRef(null)
  const [selectedLocal, setSelectedLocal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchingLocals, setFetchingLocals] = useState(true)

  // Fetch all locals on component mount
  const fetchLocals = useCallback(async () => {
    try {
      const response = await api.post(API.GET_LOCALS)
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
  }, [])

  useEffect(() => {
    fetchLocals()
  }, [fetchLocals])

  // Handle prefilled local data
  useEffect(() => {
    if (prefilledLocal && prefilledLocalId) {
      setSelectedLocal(prefilledLocal)
      setFormData({
        LocalID: `${prefilledLocal.LocalID} - ${prefilledLocal.LocalName}`,
        assignedQuantity: "",
      })
      setShowDropdown(false)
      setFilteredLocals([])
    }
  }, [prefilledLocal, prefilledLocalId])

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
      setHighlightedIndex(-1)
    } else {
      // Filter locals based on LocalID or LocalName
      const filtered = allLocals.filter(
        (local) =>
          local.LocalID.toString().includes(value) ||
          local.LocalName.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredLocals(filtered)
      setShowDropdown(filtered.length > 0)
      setHighlightedIndex(-1)
    }
  }

  const handleKeyDown = (e) => {
    if (!showDropdown || filteredLocals.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev < filteredLocals.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredLocals.length) {
        handleSelectLocal(filteredLocals[highlightedIndex]);
      } else if (filteredLocals.length > 0) {
        handleSelectLocal(filteredLocals[0]);
      }
    }
  }

  // Scroll to highlighted item in dropdown
  useEffect(() => {
    if (showDropdown && highlightedIndex >= 0 && dropdownRef.current) {
      const parent = dropdownRef.current;
      const child = parent.children[highlightedIndex];
      if (child) {
        const parentRect = parent.getBoundingClientRect();
        const childRect = child.getBoundingClientRect();
        if (childRect.bottom > parentRect.bottom) {
          parent.scrollTop += childRect.bottom - parentRect.bottom;
        } else if (childRect.top < parentRect.top) {
          parent.scrollTop -= parentRect.top - childRect.top;
        }
      }
    }
  }, [highlightedIndex, showDropdown])

  // Handle local selection from dropdown
  const handleSelectLocal = (local) => {
    setSelectedLocal(local)
    setFormData((prev) => ({
      ...prev,
      LocalID: `${local.LocalID} - ${local.LocalName}`,
    }))
    setShowDropdown(false)
    setFilteredLocals([])
    setHighlightedIndex(-1)
    
    // Auto focus and scroll to quantity input after state updates
    setTimeout(() => {
      if (quantityInputRef.current) {
        quantityInputRef.current.focus()
        quantityInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 50)
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
      const response = await api.post(API.ASSIGN_IMLI, {
        LocalID: selectedLocal.LocalID.toString(), // Send as String (backend expects String in DB)
        assignedQuantity: parseFloat(formData.assignedQuantity),
      })

      toast.success(`${formData.assignedQuantity} KG of Raw Imli has been successfully assigned to ${selectedLocal.LocalName}.`)

      // Reset form but keep modal open
      setFormData({ LocalID: "", assignedQuantity: "" })
      setSelectedLocal(null)
      setShowDropdown(false)
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to assign imli"
      toast.error(`${errorMsg}`)
      console.error("Error:", error)
      console.error("Response status:", error.response?.status)
      console.error("Response data:", JSON.stringify(error.response?.data))
      console.error("Sent payload:", JSON.stringify({ LocalID: selectedLocal?.LocalID, assignedQuantity: formData.assignedQuantity }))
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
    <div className="min-h-screen bg-white p-3 md:p-6 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-200 overflow-hidden">


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
                <div className="relative">
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
                      onKeyDown={handleKeyDown}
                      onFocus={() => filteredLocals.length > 0 && setShowDropdown(true)}
                      className="w-full px-4 py-3 pl-10 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
                      style={{ fontSize: '16px' }}
                    />
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  </div>
                  <p className="text-gray-400 text-xs mt-1.5 ml-1"><T k="Start typing to search for local workers" /></p>

                  {/* Dropdown List */}
                  {showDropdown && filteredLocals.length > 0 && (
                    <div 
                      ref={dropdownRef}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                    >
                      {filteredLocals.map((local, index) => (
                        <div
                          key={local._id}
                          onClick={() => handleSelectLocal(local)}
                          className={`px-4 py-3 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors duration-150 ${
                            highlightedIndex === index ? 'bg-orange-100' : 'hover:bg-orange-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-1.5 rounded text-orange-600">
                              <MdPerson className="text-sm" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-sm">{local.LocalID} - {local.LocalName}</div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                <MdLocationOn className="text-xs" />
                                {local.LocalAddress}
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
                  <div className="p-4 md:p-5 bg-orange-50 rounded-lg border border-orange-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-full border border-orange-200 shadow-sm">
                        <MdCheck className="text-orange-600 text-lg" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold text-sm md:text-base">
                          {selectedLocal.LocalName}
                        </p>
                        <p className="text-gray-500 text-xs font-medium flex items-center gap-1">
                          <MdLocationOn className="text-xs" />
                          {selectedLocal.LocalAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity Input */}
                <div className="relative">
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                    <MdScale className="text-orange-500 text-lg" />
                    <span><T k="Quantity" /></span>
                  </label>
                  <div className="relative">
                    <input
                      ref={quantityInputRef}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.assignedQuantity}
                      onChange={handleQuantityChange}
                      onWheel={(e) => e.target.blur()}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
                      style={{ fontSize: '16px' }}
                      required
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-sm bg-gray-50 px-2 py-1 rounded border border-gray-200">
                      KG
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs mt-1.5 ml-1"><T k="Enter the amount of raw imli to assign" /></p>
                </div>

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
                    disabled={loading || !selectedLocal || !formData.assignedQuantity}
                    className="flex-1 px-4 py-3 md:py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <T k="Assigning..." />
                      </>
                    ) : (
                      <>
                        <MdCheck className="text-lg" />
                        <span><T k="Assign" /></span>
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
