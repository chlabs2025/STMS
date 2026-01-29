"use client"

import { useState } from "react"
import { MdEco, MdAdd, MdCancel, MdScale, MdSchedule } from 'react-icons/md'
import api from "../../api/axios"
import toast from "react-hot-toast"

const AddRawImli = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6 overflow-x-hidden">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <MdEco className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Add Imli Stock</h1>
                  <p className="text-orange-100 text-sm font-medium">Add raw imli to inventory</p>
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
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <label className="flex items-center gap-3 text-gray-800 font-semibold mb-4 text-lg">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <MdScale className="text-green-600 text-xl" />
                  </div>
                  <span>Imli Quantity (KG)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter quantity in kilograms (e.g., 100.50)"
                    value={rawImliQuantity}
                    onChange={(e) => setRawImliQuantity(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200 shadow-sm hover:border-gray-300 text-lg font-medium"
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                    KG
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2 ml-1">Enter the weight of raw imli to add to inventory</p>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setRawImliQuantity("")}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
                >
                  <MdCancel className="text-xl" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!rawImliQuantity}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-sm flex items-center justify-center gap-2 text-lg"
                >
                  <MdAdd className="text-xl" />
                  <span>Add to Stock</span>
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
