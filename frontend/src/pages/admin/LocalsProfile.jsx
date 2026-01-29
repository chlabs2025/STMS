import { useState, useEffect } from "react"
import { MdPeople, MdRefresh, MdSearch, MdVisibility, MdAssignment, MdError, MdPersonAdd } from 'react-icons/md'
import axios from "../../api/axios"
import { IoEye, IoPencil, IoAdd } from "react-icons/io5"
import LocalDetailsModal from "../../components/LocalDetailsModal"

const LocalsProfile = ({ navigateToAssignImli }) => {
  const [locals, setLocals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredLocals, setFilteredLocals] = useState([])
  const [selectedLocal, setSelectedLocal] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchLocals()
  }, [])

  const fetchLocals = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.post("http://localhost:8000/api/getlocalData")
      if (response.data.data) {
        setLocals(response.data.data)
        setFilteredLocals(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching locals:", error)
      setError("Failed to load locals. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const filtered = locals.filter(
        (local) =>
          local.LocalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          local.LocalPhone?.toString().includes(searchTerm) ||
          local.LocalID?.toString().includes(searchTerm)
      )
      setFilteredLocals(filtered)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, locals])

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase()
    switch (statusLower) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const openModal = (local) => {
    setSelectedLocal(local)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedLocal(null)
    setIsModalOpen(false)
  }

  const handleDeleteLocal = (deletedLocalId) => {
    // Remove the deleted local from both locals and filteredLocals arrays
    const updatedLocals = locals.filter(local => local._id !== deletedLocalId)
    setLocals(updatedLocals)
    setFilteredLocals(updatedLocals)
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-screen flex items-center justify-center overflow-x-hidden">
        <div className="text-center">
          <div className="bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">Loading Locals...</div>
          <div className="text-gray-600">Please wait while we fetch the data</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-screen flex items-center justify-center overflow-x-hidden">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center border border-gray-200/50">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdError className="text-3xl text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Data</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={fetchLocals}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mx-auto"
          >
            <MdRefresh className="text-lg" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-screen overflow-x-hidden">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-gray-200/50">
              <MdPeople className="text-3xl text-gray-700" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Locals Profile</h2>
              <p className="text-gray-600 font-medium">Manage and view local worker information</p>
            </div>
          </div>
          <button
            onClick={fetchLocals}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center gap-2 self-start lg:self-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
            aria-label="Refresh locals list"
          >
            <MdRefresh className="text-lg" />
            Refresh
          </button>
        </div>
        
        {/* Search Bar with Count */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 mr-6">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <MdSearch className="text-blue-600 text-xl" />
              </div>
              <input
                type="text"
                placeholder="Search by name, phone, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search locals by name, phone, or ID"
                className="flex-1 border-none outline-none text-gray-900 placeholder-gray-400 bg-transparent text-lg font-medium"
              />
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-xl">
              <div className="text-sm text-gray-600 font-medium">
                <span className="font-bold text-gray-900">{filteredLocals.length}</span> locals
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredLocals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-200/50">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdSearch className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {searchTerm ? "No matching locals found" : "No locals available"}
          </h3>
          <p className="text-gray-500 text-lg mb-6">
            {searchTerm ? "Try adjusting your search criteria" : "Start by adding some locals to the system"}
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-2 border-gray-300 rounded-xl hover:from-gray-200 hover:to-gray-300 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Clear Search
            </button>
          ) : (
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto">
              <MdPersonAdd className="text-lg" />
              Add New Local
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Local
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Assigned Qty
                  </th>
                  <th className="px-4 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider pr-8">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredLocals.map((local, index) => (
                  <tr key={local._id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg ring-4 ring-blue-50">
                            <span className="text-lg font-bold text-white">
                              {(local.LocalName || "U").charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-bold text-gray-900 mb-1">
                            {local.LocalName || "Unnamed Local"}
                          </div>
                          <div className="text-sm text-gray-600 font-medium flex items-center gap-1">
                            <span>ID:</span>
                            <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-semibold text-gray-700">
                              {local.LocalID}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-900 mr-2">
                          {local.totalAssignedQuantity || 0}
                        </span>
                        <span className="text-sm text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded-md">KG</span>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 shadow-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-6 text-right pr-8">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          onClick={() => openModal(local)}
                          className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          title="View Details"
                        >
                          <MdVisibility className="w-4 h-4 mr-2" />
                          View
                        </button>
                        <button 
                          onClick={() => navigateToAssignImli && navigateToAssignImli(local)}
                          className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          title="Assign Imli"
                        >
                          <MdAssignment className="w-4 h-4 mr-2" />
                          Assign
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredLocals.length > 0 && (
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <MdPeople className="text-blue-600 text-lg" />
              </div>
              <p className="text-gray-700 font-medium">
                Showing{" "}
                <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                  {filteredLocals.length}
                </span>{" "}
                of <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{locals.length}</span>{" "}
                total locals
              </p>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-sm text-gray-600 hover:text-gray-900 font-semibold bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-all duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      )}

      {/* Local Details Modal */}
      <LocalDetailsModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        local={selectedLocal}
        onDelete={handleDeleteLocal}
      />
    </div>
  )
}

export default LocalsProfile;