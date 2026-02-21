"use client"

import { useState } from "react"
import { MdEco, MdAdd, MdCancel, MdScale, MdSchedule } from 'react-icons/md'
import api from "../../api/axios"
import toast from "react-hot-toast"
import { useLang } from "../../context/LanguageContext"
import T from "../../i18n/T"

const AddRawImli = () => {
  const { lang } = useLang()
  const [rawImliQuantity, setRawImliQuantity] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!rawImliQuantity) {
      toast.error("Please enter imli quantity")
      return
    }

    try {
      await api.post("/addRawImli", {
        rawImliQuantity,
      })

      toast.success(`✅ ${rawImliQuantity} KG Imli added to stock`)
      setRawImliQuantity("")
    } catch (error) {
      toast.error("❌ Failed to add imli")
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-white p-6 overflow-x-hidden">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-white px-8 py-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <MdEco className="text-2xl text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900"><T k="Add Imli Stock" /></h1>
                  <p className="text-gray-500 text-sm font-medium"><T k="Add raw imli to inventory" /></p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
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
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-medium"
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
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm text-sm"
                >
                  <T k="Cancel" />
                </button>

                <button
                  type="submit"
                  disabled={!rawImliQuantity}
                  className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 text-sm"
                >
                  <MdAdd className="text-lg" />
                  <span><T k="Add to Stock" /></span>
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
