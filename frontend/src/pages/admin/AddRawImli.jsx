"use client"

import { useState } from "react"
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
      await api.post("/imli/add", {
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
    <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg p-12 w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">
            25th September 2025 , 8.00 AM
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6">ADD IMLI</h2>

          <input
            type="text"
            placeholder="Amount of Imli to be added"
            value={rawImliQuantity}
            onChange={(e) => setRawImliQuantity(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 placeholder-gray-400 focus:outline-none focus:border-gray-500"
          />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setRawImliQuantity("")}
              className="flex-1 px-6 py-3 border border-gray-900 rounded-lg text-gray-900 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <span>Add to Stock</span>
              <span>➕</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRawImli
