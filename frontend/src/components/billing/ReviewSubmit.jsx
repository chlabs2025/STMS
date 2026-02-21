"use client"

import { MdArrowBack, MdSend, MdCheckCircle, MdPerson, MdLocalShipping, MdInventory, MdReceipt } from 'react-icons/md'
import { SELLER_STATE } from './indianStates'

export default function ReviewSubmit({ formData, onBack, onSubmit, isSubmitting }) {
    const { customer = {}, item = {}, transport = {} } = formData
    const isInterstate = customer.state && customer.state !== SELLER_STATE

    const totalWithGst = (item.amount || 0) + (item.igst || 0) + (item.cgst || 0) + (item.sgst || 0)

    const SectionCard = ({ icon: Icon, title, children }) => (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                <Icon className="text-orange-600" />
                <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</span>
            </div>
            <div className="p-5">{children}</div>
        </div>
    )

    const InfoRow = ({ label, value, highlight }) => (
        <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-500 font-medium">{label}</span>
            <span className={`text-sm font-semibold ${highlight ? 'text-orange-600' : 'text-gray-900'}`}>
                {value || "—"}
            </span>
        </div>
    )

    return (
        <div className="space-y-8">
            {/* Section Title */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Review & Submit</h3>
                <p className="text-gray-500 text-sm font-medium">Verify all details before generating the invoice</p>
            </div>

            {/* Review Cards */}
            <div className="space-y-5">
                {/* Product */}
                <SectionCard icon={MdInventory} title="Product">
                    <InfoRow label="Product" value={formData.description} />
                    <InfoRow label="HSN/SAC" value={formData.hsn} />
                </SectionCard>

                {/* Customer */}
                <SectionCard icon={MdPerson} title="Customer Details">
                    <InfoRow label="Name" value={customer.name} />
                    <InfoRow label="Address" value={customer.address} />
                    <InfoRow label="GSTIN" value={customer.gstin || "Not Provided"} />
                    <InfoRow label="State" value={customer.state} />
                    <InfoRow label="State Code" value={customer.stateCode} />
                </SectionCard>

                {/* Item */}
                <SectionCard icon={MdReceipt} title="Item & GST Breakdown">
                    <InfoRow label="Quantity" value={`${item.quantity || 0} ${item.unit || ""}`} />
                    <InfoRow label="Rate" value={`₹ ${parseFloat(item.rate || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} />
                    <InfoRow label="Taxable Amount" value={`₹ ${(item.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} highlight />
                    <InfoRow label={`GST (${item.gstPercent || 0}%)`} value={isInterstate ? "Interstate (IGST)" : "Intrastate (CGST + SGST)"} />
                    {isInterstate ? (
                        <InfoRow label="IGST" value={`₹ ${(item.igst || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} />
                    ) : (
                        <>
                            <InfoRow label="CGST" value={`₹ ${(item.cgst || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} />
                            <InfoRow label="SGST" value={`₹ ${(item.sgst || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} />
                        </>
                    )}
                </SectionCard>

                {/* Transport */}
                <SectionCard icon={MdLocalShipping} title="Transport Details">
                    <InfoRow label="Destination" value={transport.destination} />
                    <InfoRow label="Vehicle No." value={transport.vehicleNo} />
                </SectionCard>

                {/* Grand Total Card */}
                <div className="bg-orange-50 rounded-xl border-2 border-orange-200 p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-orange-700 uppercase tracking-wide">Grand Total</p>
                        <p className="text-xs text-orange-600/70 font-medium mt-0.5">Including all taxes</p>
                    </div>
                    <div className="text-3xl font-bold text-orange-600">
                        ₹ {totalWithGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                    <MdArrowBack className="text-lg" />
                    Back
                </button>
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-sm flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Generating Invoice...
                        </>
                    ) : (
                        <>
                            <MdSend className="text-lg" />
                            Generate Invoice
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
