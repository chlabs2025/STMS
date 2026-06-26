import React from "react"
import { useLang } from "../context/LanguageContext"

// Reusable animated skeleton block
export const SkeletonBlock = ({ className, style }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={style}></div>
)

export const CardSkeleton = () => {
  const { lang } = useLang()
  const isUrdu = lang === "ur"

  return (
    <div className={`bg-white rounded-2xl py-8 px-5 md:py-10 md:px-8 border border-gray-100 flex flex-col justify-between relative h-[140px] md:h-[180px]`}>
      {/* Icon placeholder (Not pulsing as it's static UI) */}
      <div
        className={`w-10 h-10 md:w-12 md:h-12 absolute top-4 md:top-6 bg-gray-100 ${isUrdu ? "left-4 md:left-6" : "right-4 md:right-6"}`}
        style={{ borderRadius: "8px" }}
      />
      
      {/* Title placeholder (Not pulsing as it's static UI label) */}
      <div className={`h-4 w-2/3 md:w-1/2 mb-auto bg-gray-100 rounded ${isUrdu ? "ml-auto" : ""}`} />
      
      {/* Main value placeholder (Pulsing) */}
      <div className={`mt-6 flex items-end gap-2 ${isUrdu ? "flex-row-reverse" : ""}`}>
        <SkeletonBlock className="h-8 md:h-10 w-24 md:w-32 rounded-lg" />
        <SkeletonBlock className="h-4 w-8 mb-1" />
      </div>
    </div>
  )
}

export const TableSkeleton = ({ rows = 5, columns = 4, headers = [] }) => (
  <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {headers.length > 0 ? headers.map((h, i) => (
              <th key={i} className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
            )) : Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-5 text-left">
                {/* Non-pulsing static header box */}
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, rIndex) => (
            <tr key={rIndex}>
              {Array.from({ length: columns }).map((_, cIndex) => (
                <td key={cIndex} className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    {cIndex === 0 && <SkeletonBlock className="h-10 w-10 md:h-12 md:w-12 rounded-full flex-shrink-0" />}
                    <div className="flex flex-col gap-2 w-full">
                      <SkeletonBlock className={`h-4 ${cIndex === 0 ? 'w-3/4' : 'w-full'} max-w-[150px]`} />
                      {cIndex === 0 && <SkeletonBlock className="h-3 w-1/2 max-w-[100px]" />}
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export const ListItemSkeleton = ({ count = 4 }) => (
  <div className="md:hidden space-y-2.5 w-full">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-4">
          <SkeletonBlock className="h-11 w-11 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="h-3 w-1/2" />
          </div>
        </div>
        <div className="flex gap-2">
          {/* Actions are static UI buttons, not values */}
          <div className="h-9 flex-1 bg-gray-100 rounded-lg"></div>
          <div className="h-9 flex-1 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    ))}
  </div>
)

export const ProfileSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full overflow-hidden">
    <div className="p-6 md:p-8 flex items-center gap-4">
      <SkeletonBlock className="h-16 w-16 md:h-24 md:w-24 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-3">
        {/* Values for name and ID pulse */}
        <SkeletonBlock className="h-6 w-1/3 md:w-1/4" />
        <SkeletonBlock className="h-4 w-1/2 md:w-1/3" />
      </div>
    </div>
    <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
      {/* Static boxes for settings/sections */}
      <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
      <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
    </div>
  </div>
)

export const PaymentCardSkeleton = () => (
  <div className="bg-white border text-sm border-gray-200 rounded-lg overflow-hidden flex-1 min-w-[300px]">
    <div className="p-5 flex flex-col justify-center items-center gap-2">
      <SkeletonBlock className="h-16 w-16 rounded-full" />
      <SkeletonBlock className="h-5 w-3/4 mt-2" />
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <span>ID:</span>
        <SkeletonBlock className="h-3 w-12" />
      </div>
    </div>
    <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
      <div className="flex justify-between items-center text-xs font-medium text-gray-500">
         <span>Assigned Quantity</span>
         <SkeletonBlock className="h-4 w-16" />
      </div>
      <div className="flex justify-between items-center text-xs font-medium text-gray-500">
         <span>Total Debt</span>
         <SkeletonBlock className="h-4 w-16" />
      </div>
    </div>
    <div className="p-4 border-t border-gray-100">
      {/* Button is static UI, shouldn't pulse */}
      <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
    </div>
  </div>
)

export const SingleInputSkeleton = () => (
  <div className="space-y-4 w-full">
    {/* Label is static */}
    <div className="h-4 w-24 bg-gray-100 rounded"></div>
    {/* Input field pulses */}
    <SkeletonBlock className="h-12 w-full rounded-lg" />
  </div>
)

export const ChartSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
    <div className="flex justify-between items-center mb-6">
      {/* Static Title */}
      <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
      <div className="h-8 w-24 bg-gray-100 rounded-lg"></div>
    </div>
    <div className="flex items-end gap-2 h-64 md:h-80 w-full pt-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <SkeletonBlock 
          key={i} 
          className="w-full rounded-t-sm" 
          style={{ height: `${Math.max(20, Math.random() * 100)}%` }} 
        />
      ))}
    </div>
  </div>
)
