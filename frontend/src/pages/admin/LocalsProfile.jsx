import { useState, useEffect } from "react"
import axios from "../../api/axios"
import { IoEye, IoPencil, IoAdd } from "react-icons/io5"
import LocalDetailsModal from "../../components/LocalDetailsModal"

const LocalsProfile = () => {
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
      <div className="p-8 bg-gray-100 ml-64 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <div className="text-2xl font-bold text-gray-700">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-100 ml-64 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchLocals}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-100 ml-64 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Locals Profile</h2>
          <button
            onClick={fetchLocals}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            aria-label="Refresh locals list"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by name, phone, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search locals by name, phone, or ID"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {filteredLocals.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-md">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">
            {searchTerm ? "No locals found matching your search" : "No locals found"}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-4 py-2 text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLocals.map((local, index) => (
                  <tr key={local._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {local.LocalID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {local.LocalName || "Unnamed Local"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {local.LocalPhone || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      <div title={local.LocalAddress || "N/A"}>
                        {local.LocalAddress || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="font-medium">{local.totalAssignedQuantity || 0}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          onClick={() => openModal(local)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                          title="View Details"
                        >
                          <IoEye className="w-3 h-3 mr-1" />
                          View
                        </button>
                        <button 
                          className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md text-xs font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                          title="Edit Local"
                        >
                          <IoPencil className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button 
                          className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          title="Assign Imli"
                        >
                          <IoAdd className="w-3 h-3 mr-1" />
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
        <div className="mt-8 bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {filteredLocals.length}
              </span>{" "}
              of <span className="font-bold text-gray-900">{locals.length}</span>{" "}
              total locals
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
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