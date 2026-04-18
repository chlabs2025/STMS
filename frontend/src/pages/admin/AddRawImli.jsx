"use client"

import { useState, useRef } from "react"
import { MdEco, MdAdd, MdCancel, MdScale, MdSchedule } from 'react-icons/md'
import api from "../../api/axios"
import API from "../../api/endpoints"
import toast from "react-hot-toast"
import { useLang } from "../../context/LanguageContext"
import T from "../../i18n/T"

const AddRawImli = () => {
  const { lang } = useLang()
  const [rawImliQuantity, setRawImliQuantity] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmittingRef = useRef(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmittingRef.current) return

    if (!rawImliQuantity) {
      toast.error("Please enter imli quantity")
      return
    }

    try {
      setIsSubmitting(true)
      isSubmittingRef.current = true
      await api.post(API.ADD_RAW_IMLI, {
        rawImliQuantity: Number(rawImliQuantity),
      })

      toast.success(`✅ ${rawImliQuantity} KG Imli added to stock`)
      setRawImliQuantity("")
    } catch (error) {
      toast.error("❌ Failed to add imli")
      console.error(error)
    } finally {
      setIsSubmitting(false)
      isSubmittingRef.current = false
    }
  }

  return (
    <div className="min-h-screen bg-white p-3 md:p-6 overflow-x-hidden">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-200 overflow-hidden">


          {/* Content */}
          <div className="px-4 md:px-8 py-5 md:py-8">
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-8">
              <div className="relative">
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  <MdScale className="text-orange-500 text-lg" />
                  <span><T k="Imli Quantity" /></span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={rawImliQuantity}
                    onChange={(e) => setRawImliQuantity(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
                    style={{ fontSize: '16px' }}
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-sm bg-gray-50 px-2 py-1 rounded border border-gray-200">
                    KG
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-1.5 ml-1"><T k="Enter the weight of raw imli to add to inventory" /></p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setRawImliQuantity("")}
                  className="flex-1 px-4 py-3 md:py-2.5 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm text-sm"
                >
                  <T k="Cancel" />
                </button>

                <button
                  type="submit"
                  disabled={!rawImliQuantity || isSubmitting}
                  className="flex-1 px-4 py-3 md:py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 text-sm"
                >
                  <MdAdd className="text-lg" />
                  <span>{isSubmitting ? "Processing..." : <T k="Add to Stock" />}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddRawImli
