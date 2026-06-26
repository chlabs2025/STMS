"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { MdStore, MdAdd, MdClose, MdSearch, MdChevronRight, MdAccountBalanceWallet } from 'react-icons/md'
import api from "../../api/axios"
import API from "../../api/endpoints"
import toast from "react-hot-toast"
import T from "../../i18n/T"
import VendorProfile from "./VendorProfile"

const Vendors = () => {
  const [vendors, setVendors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newVendor, setNewVendor] = useState({ name: "", phone: "", address: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedVendorId, setSelectedVendorId] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const urlVendorId = searchParams.get('vendorId')

  useEffect(() => {
    if (urlVendorId && urlVendorId !== selectedVendorId) {
      setSelectedVendorId(urlVendorId)
    } else if (!urlVendorId && selectedVendorId) {
      setSelectedVendorId(null)
    }
  }, [urlVendorId, selectedVendorId])

  const fetchVendors = async () => {
    try {
      setIsLoading(true)
      const res = await api.get(API.GET_VENDORS)
      setVendors(res.data.data || [])
    } catch (error) {
      toast.error("Failed to fetch vendors")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  const handleAddVendor = async (e) => {
    e.preventDefault()
    if (!newVendor.name) {
      toast.error("Vendor name is required")
      return
    }

    try {
      setIsSubmitting(true)
      await api.post(API.ADD_VENDOR, newVendor)
      toast.success("Vendor added successfully")
      setIsAddModalOpen(false)
      setNewVendor({ name: "", phone: "", address: "" })
      fetchVendors()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add vendor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.phone && v.phone.includes(searchTerm))
  )

  if (selectedVendorId) {
    return (
      <VendorProfile
        vendorId={selectedVendorId}
        onBack={() => {
          setSelectedVendorId(null)
          searchParams.delete('vendorId')
          setSearchParams(searchParams)
          fetchVendors()
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="relative flex-1 w-full max-w-md">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              autoFocus
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <MdAdd className="text-xl" />
            <span><T k="Add Vendor" /></span>
          </button>
        </div>

        {/* Vendors Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdStore className="text-3xl text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No vendors found</h3>
            <p className="text-gray-500 text-sm">Add a new vendor to start tracking raw material purchases.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map(vendor => {
              const balance = vendor.totalDebt - vendor.totalPaid;
              return (
                <div
                  key={vendor._id}
                  onClick={() => {
                    setSelectedVendorId(vendor._id)
                    setSearchParams({ vendorId: vendor._id })
                  }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                          {vendor.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors">{vendor.name}</h3>
                          <p className="text-xs text-gray-500">{vendor.phone || "No phone"}</p>
                        </div>
                      </div>
                      <MdChevronRight className="text-gray-400 text-xl group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-50">
                      <div>
                        <p className="text-xs text-gray-500 font-medium capitalize tracking-wider mb-1">Purchases</p>
                        <p className="font-semibold text-gray-900">₹{vendor.totalDebt.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium capitalize tracking-wider mb-1">Balance Due</p>
                        <p className={`font-semibold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{balance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  {balance > 0 && (
                    <div className="bg-red-50/50 px-5 py-3 border-t border-red-100 flex items-center gap-2">
                      <MdAccountBalanceWallet className="text-red-500" />
                      <span className="text-xs font-medium text-red-700">Payment pending</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Add Vendor Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl ">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <MdStore className="text-orange-600" />
                  Add New Vendor
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                >
                  <MdClose className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleAddVendor} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name *</label>
                  <input
                    type="text"
                    value={newVendor.name}
                    onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    placeholder="Enter vendor name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newVendor.phone}
                    onChange={e => setNewVendor({ ...newVendor, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={newVendor.address}
                    onChange={e => setNewVendor({ ...newVendor, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none h-24"
                    placeholder="Enter address"
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newVendor.name}
                    className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Saving..." : "Save Vendor"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Vendors

