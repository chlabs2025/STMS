import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { MdPeople, MdRefresh, MdSearch, MdVisibility, MdAssignment, MdError, MdPersonAdd, MdDelete, MdWarning } from 'react-icons/md'
import api from "../../api/axios"
import API from "../../api/endpoints"
import { useLang } from "../../context/LanguageContext"
import T from "../../i18n/T"
import toast from "react-hot-toast"
import { TableSkeleton, ListItemSkeleton } from "../../components/Skeletons"
import LocalDetailPage from "./LocalDetailPage"

const LocalsProfile = ({ navigateToAssignImli, onPageChange, prefilledLocalId }) => {
  // eslint-disable-next-line no-unused-vars
  const { lang } = useLang()
  const [locals, setLocals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredLocals, setFilteredLocals] = useState([])
  const [selectedLocal, setSelectedLocal] = useState(null)
  const [localToDelete, setLocalToDelete] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const hasPrefilledRef = useRef(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const urlLocalId = searchParams.get('localId')

  useEffect(() => {
    fetchLocals()
  }, [])

  useEffect(() => {
    if (locals.length > 0) {
      if (urlLocalId) {
        const local = locals.find(l => l.LocalID?.toString() === urlLocalId || l._id === urlLocalId)
        if (local && (!selectedLocal || selectedLocal.LocalID !== local.LocalID)) {
          setSelectedLocal(local)
        }
      } else if (prefilledLocalId && !hasPrefilledRef.current) {
        const local = locals.find(l => l.LocalID === prefilledLocalId || l._id === prefilledLocalId)
        if (local) {
          setSelectedLocal(local)
          setSearchParams({ localId: local.LocalID })
          hasPrefilledRef.current = true
        }
      } else if (!urlLocalId && selectedLocal) {
        setSelectedLocal(null)
      }
    }
  }, [locals, urlLocalId, prefilledLocalId, selectedLocal, setSearchParams])

  const fetchLocals = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.post(API.GET_LOCALS)
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

  // eslint-disable-next-line no-unused-vars
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

  const openDetailPage = (local) => {
    setSelectedLocal(local)
    setSearchParams({ localId: local.LocalID })
  }

  const handleDeleteLocal = (deletedLocalId) => {
    // Remove the deleted local from both locals and filteredLocals arrays
    const updatedLocals = locals.filter(local => local._id !== deletedLocalId)
    setLocals(updatedLocals)
    setFilteredLocals(updatedLocals)
  }

  const openDeleteModal = (local, e) => {
    e.stopPropagation()
    setLocalToDelete(local)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setLocalToDelete(null)
    setIsDeleteModalOpen(false)
  }

  const confirmDeleteLocal = async () => {
    if (!localToDelete) return;
    setIsDeleting(true);
    try {
      await api.post(API.DELETE_LOCAL, { LocalID: localToDelete.LocalID });
      toast.success("Local deleted successfully");
      handleDeleteLocal(localToDelete._id);
      closeDeleteModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete local");
    } finally {
      setIsDeleting(false);
    }
  }

  // ─── Show full detail page when a local is selected ───
  if (selectedLocal) {
    return (
      <LocalDetailPage
        local={selectedLocal}
        onBack={() => {
          setSelectedLocal(null)
          searchParams.delete('localId')
          setSearchParams(searchParams)
          fetchLocals()
        }}
        navigateToAssignImli={navigateToAssignImli}
      />
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
    <div className="p-3 md:p-6 lg:p-8 bg-white flex flex-col">
      {/* Search Bar with Icon & Refresh */}
      <div className="bg-white rounded-xl border border-orange-500/20 shadow-sm p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3">
          {/* Icon */}
          <div className="bg-white p-2 md:p-2.5 rounded-lg shadow-sm border border-orange-500/30 flex-shrink-0">
            <MdPeople className="text-xl md:text-2xl text-orange-600" />
          </div>
          {/* Search Input */}
          <div className="flex items-center flex-1 min-w-0 bg-gray-50 rounded-lg px-2.5 md:px-3 py-1.5 md:py-2">
            <MdSearch className="text-orange-600 text-lg md:text-xl mr-1.5 md:mr-2 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search locals"
              className="flex-1 min-w-0 border-none outline-none text-gray-900 placeholder-gray-400 bg-transparent text-sm md:text-base font-medium"
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchLocals}
            className="px-2.5 md:px-5 py-1.5 md:py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center gap-1.5 md:gap-2 shadow-sm font-medium border border-orange-600 text-sm flex-shrink-0 outline-none"
            aria-label="Refresh locals list"
          >
            <MdRefresh className="text-lg" />
            <span className="hidden sm:inline"><T k="Refresh" /></span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 pr-1 md:pr-2">
          <TableSkeleton rows={6} columns={3} headers={['Local', 'Status', 'Actions']} />
          <ListItemSkeleton count={6} />
        </div>
      ) : filteredLocals.length === 0 ? (
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
            <button
              onClick={() => onPageChange && onPageChange('addLocals')}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 font-medium shadow-sm flex items-center gap-2 mx-auto text-sm">
              <MdPersonAdd className="text-lg" />
              <T k="Add New Local" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1 pr-1 md:pr-2">
          {/* ─── Desktop Table (hidden on mobile) ─── */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 capitalize tracking-wider">
                      <T k="Local" />
                    </th>
                    <th className="px-4 py-5 text-left text-xs font-semibold text-gray-600 capitalize tracking-wider whitespace-nowrap">
                      <T k="Status" />
                    </th>
                    <th className="px-4 py-5 text-right text-xs font-semibold text-gray-600 capitalize tracking-wider pr-6 whitespace-nowrap">
                      <T k="Actions" />
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredLocals.map((local) => (
                    <tr key={local._id} onClick={() => openDetailPage(local)} className="hover:bg-orange-50/30 transition-all duration-200 group cursor-pointer">
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
                            onClick={(e) => { e.stopPropagation(); openDetailPage(local); }}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 focus:outline-none transition-all duration-200 shadow-sm"
                            title="View Details"
                          >
                            <MdVisibility className="w-4 h-4 mr-2" />
                            <T k="View" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigateToAssignImli && navigateToAssignImli(local); }}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none transition-all duration-200 shadow-sm"
                            title="Assign Imli"
                          >
                            <MdAssignment className="w-4 h-4 mr-2" />
                            <T k="Assign" />
                          </button>
                          <button
                            onClick={(e) => openDeleteModal(local, e)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none transition-all duration-200 shadow-sm"
                            title="Delete Local"
                          >
                            <MdDelete className="w-4 h-4" />
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
                onClick={() => openDetailPage(local)}
                className="bg-white rounded-xl border border-gray-100 p-4 active:bg-gray-50 transition-colors cursor-pointer"
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
                    onClick={(e) => { e.stopPropagation(); openDetailPage(local); }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg active:bg-gray-100 transition-colors"
                  >
                    <MdVisibility className="text-sm" />
                    <T k="View" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigateToAssignImli && navigateToAssignImli(local); }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-white bg-blue-600 rounded-lg active:bg-blue-700 transition-colors"
                  >
                    <MdAssignment className="text-sm" />
                    <T k="Assign" />
                  </button>
                  <button
                    onClick={(e) => openDeleteModal(local, e)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-white bg-red-600 rounded-lg active:bg-red-700 transition-colors"
                  >
                    <MdDelete className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden transform transition-all">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <MdWarning className="text-3xl text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Local?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to delete <span className="font-bold text-gray-800">{localToDelete?.LocalName}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteLocal}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isDeleting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LocalsProfile;
