import { useState, useEffect } from "react"
import { MdPeople, MdRefresh, MdSearch, MdVisibility, MdAssignment, MdError, MdPersonAdd } from 'react-icons/md'
import api from "../../api/axios"
import { IoEye, IoPencil, IoAdd } from "react-icons/io5"
import LocalDetailsModal from "../../components/LocalDetailsModal"
import { useLang } from "../../context/LanguageContext"
import T from "../../i18n/T"

const LocalsProfile = ({ navigateToAssignImli }) => {
  const { lang } = useLang()
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
      const response = await api.post("/return_local")
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
      <div className="p-3 md:p-6 lg:p-8 bg-white min-h-screen flex items-center justify-center overflow-x-hidden">
        <div className="text-center">
          <div className="bg-orange-50 w-16 md:w-24 h-16 md:h-24 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm border border-orange-200">
            <div className="w-8 md:w-12 h-8 md:h-12 border-3 md:border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-gray-800 mb-1 md:mb-2"><T k="Loading Locals..." /></div>
          <div className="text-gray-600 text-sm md:text-base"><T k="Please wait while we fetch the data" /></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-3 md:p-6 lg:p-8 bg-white min-h-screen flex items-center justify-center overflow-x-hidden">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md text-center border border-orange-200 mx-3">
          <div className="bg-red-50 w-14 md:w-16 h-14 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <MdError className="text-2xl md:text-3xl text-red-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3"><T k="Error Loading Data" /></h3>
          <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base leading-relaxed">{error}</p>
          <button
            onClick={fetchLocals}
            className="px-6 md:px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 mx-auto text-sm md:text-base"
          >
            <MdRefresh className="text-lg" />
            <T k="Try Again" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 md:p-6 lg:p-8 bg-white min-h-screen overflow-x-hidden">
      <div className="mb-4 md:mb-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 md:mb-6 gap-3 md:gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-white p-2 md:p-3 rounded-lg shadow-sm border border-orange-500/30">
              <MdPeople className="text-2xl md:text-3xl text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900"><T k="Locals Profile" /></h2>
              <p className="text-gray-600 font-medium text-xs md:text-base"><T k="Manage and view local worker information" /></p>
            </div>
          </div>
          <button
            onClick={fetchLocals}
            className="px-4 md:px-6 py-2 md:py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center gap-2 self-start lg:self-auto shadow-sm font-medium border border-orange-600 text-sm"
            aria-label="Refresh locals list"
          >
            <MdRefresh className="text-lg" />
            <T k="Refresh" />
          </button>
        </div>

        {/* Search Bar with Count */}
        <div className="bg-white rounded-xl border border-orange-500/20 shadow-sm p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center flex-1">
              <div className="bg-orange-50 p-2 md:p-2.5 rounded-lg mr-3 md:mr-4 border border-orange-100">
                <MdSearch className="text-orange-600 text-lg md:text-xl" />
              </div>
              <input
                type="text"
                placeholder="Search by name, phone, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search locals by name, phone, or ID"
                className="flex-1 border-none outline-none text-gray-900 placeholder-gray-400 bg-transparent text-sm md:text-base font-medium"
                style={{ fontSize: '16px' }}
              />
            </div>
            <div className="bg-orange-50 px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-orange-100 flex-shrink-0">
              <div className="text-xs md:text-sm text-gray-700 font-medium">
                <span className="font-bold text-orange-600">{filteredLocals.length}</span> <span className="hidden sm:inline"><T k="locals" /></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredLocals.length === 0 ? (
        <div className="bg-white rounded-xl p-8 md:p-12 text-center shadow-sm border border-orange-500/20">
          <div className="bg-gray-50 w-16 md:w-20 h-16 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <MdSearch className="text-3xl md:text-4xl text-gray-300" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
            {searchTerm ? <T k="No matching locals found" /> : <T k="No locals available" />}
          </h3>
          <p className="text-gray-500 text-sm md:text-lg mb-4 md:mb-6">
            {searchTerm ? <T k="Try adjusting your search criteria" /> : <T k="Start by adding some locals to the system" />}
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="px-6 py-2.5 bg-white text-orange-600 border border-orange-500 rounded-lg hover:bg-orange-50 transition-all duration-200 font-medium shadow-sm text-sm"
            >
              <T k="Clear Search" />
            </button>
          ) : (
            <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 font-medium shadow-sm flex items-center gap-2 mx-auto text-sm">
              <MdPersonAdd className="text-lg" />
              <T k="Add New Local" />
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ─── Desktop Table (hidden on mobile) ─── */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <T k="Local" />
                    </th>
                    <th className="px-4 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      <T k="Status" />
                    </th>
                    <th className="px-4 py-5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider pr-6 whitespace-nowrap">
                      <T k="Actions" />
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredLocals.map((local, index) => (
                    <tr key={local._id} className="hover:bg-orange-50/30 transition-all duration-200 group">
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full border border-orange-200 bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-lg">
                              {(local.LocalName || "U").charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-base font-bold text-gray-900 mb-0.5">
                              {local.LocalName || "Unnamed Local"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <span>ID:</span>
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-medium text-gray-600">
                                {local.LocalID}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                          <T k="Active" />
                        </span>
                      </td>
                      <td className="px-4 py-5 text-right pr-6">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => openModal(local)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 focus:outline-none transition-all duration-200 shadow-sm"
                            title="View Details"
                          >
                            <MdVisibility className="w-4 h-4 mr-2" />
                            <T k="View" />
                          </button>
                          <button
                            onClick={() => navigateToAssignImli && navigateToAssignImli(local)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none transition-all duration-200 shadow-sm"
                            title="Assign Imli"
                          >
                            <MdAssignment className="w-4 h-4 mr-2" />
                            <T k="Assign" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─── Mobile Card List (hidden on desktop) ─── */}
          <div className="md:hidden space-y-2.5">
            {filteredLocals.map((local) => (
              <div
                key={local._id}
                className="bg-white rounded-xl border border-gray-100 p-4 active:bg-gray-50 transition-colors"
              >
                {/* Top row: Avatar + Name + Status */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-11 w-11 rounded-full border border-orange-200 bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-base flex-shrink-0">
                    {(local.LocalName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900 truncate">
                      {local.LocalName || "Unnamed Local"}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <span>ID:</span>
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-medium text-gray-600">
                        {local.LocalID}
                      </span>
                      <span className="inline-flex items-center ml-1.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                        <span className="text-green-700 text-[10px] font-medium"><T k="Active" /></span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom row: Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(local)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg active:bg-gray-100 transition-colors"
                  >
                    <MdVisibility className="text-sm" />
                    <T k="View" />
                  </button>
                  <button
                    onClick={() => navigateToAssignImli && navigateToAssignImli(local)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-white bg-blue-600 rounded-lg active:bg-blue-700 transition-colors"
                  >
                    <MdAssignment className="text-sm" />
                    <T k="Assign" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {filteredLocals.length > 0 && (
        <div className="mt-4 md:mt-8 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-orange-50 p-1.5 md:p-2 rounded-lg">
                <MdPeople className="text-orange-600 text-base md:text-lg" />
              </div>
              <p className="text-gray-600 font-medium text-xs md:text-sm">
                Showing{" "}
                <span className="font-bold text-gray-900 bg-gray-100 px-1.5 md:px-2 py-0.5 rounded">
                  {filteredLocals.length}
                </span>{" "}
                of <span className="font-bold text-gray-900 bg-gray-100 px-1.5 md:px-2 py-0.5 rounded">{locals.length}</span>{" "}
                <T k="total locals" />
              </p>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-xs md:text-sm text-gray-600 hover:text-gray-900 font-medium bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-all duration-200"
              >
                <T k="Clear Search" />
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
