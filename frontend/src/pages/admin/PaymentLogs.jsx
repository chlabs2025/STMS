import React, { useState, useEffect } from 'react';
import { MdHistory, MdRefresh, MdError, MdCheckCircle, MdMoney, MdPayment as MdOnlinePayment } from 'react-icons/md';
import api from "../../api/axios";
import T from '../../i18n/T';

const PaymentLogs = ({ localID }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchLogs = async () => {
        if (!localID) return;
        try {
            setLoading(true);
            setError(null);
            const response = await api.get("/paymentlogs", { params: { localID } });
            if (response.data && response.data.data) {
                setLogs(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching payment logs:", err);
            if (err.response?.status === 404) {
                setLogs([]);
            } else {
                setError("Failed to load payment history");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [localID]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600 font-medium">Loading history...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-center">
                <p className="text-red-700 text-sm font-medium mb-3">{error}</p>
                <button onClick={fetchLogs} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 mx-auto">
                    <MdRefresh /> Try Again
                </button>
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MdHistory className="text-3xl text-gray-300" />
                </div>
                <p className="font-medium italic">No previous payment records found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {logs.map((log) => {
                const date = log.period ? new Date(log.period) : new Date(log.createdAt);
                const day = date.getDay();
                const diff = date.getDate() - day + (day >= 4 ? 4 : -3);
                const start = new Date(date);
                start.setDate(diff);
                const end = new Date(start);
                end.setDate(start.getDate() + 6);
                const fmt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

                return (
                    <div key={log._id} className="flex flex-col lg:flex-row justify-between gap-5 md:gap-10 p-4 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm mb-6">
                        <div className="lg:w-2/3">
                            <div className="mb-4 md:mb-8 p-3 md:p-4 bg-orange-50/50 rounded-xl border border-orange-100 flex items-center gap-3">
                                <div className="bg-orange-500 text-white rounded-lg p-2 flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">Weekly Period</p>
                                    <p className="text-sm md:text-base font-bold text-gray-800 mt-0.5">
                                        {fmt(start)} <span className="text-orange-400 mx-1">→</span> {fmt(end)}
                                    </p>
                                </div>
                            </div>

                            {/* Mobile: Cards | Desktop: Table */}
                            <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Assigned Quantity</th>
                                            <th className="px-6 py-4">Cleaned Qty.</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                                        <tr className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium">
                                                {new Date(log.createdAt).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </td>
                                            <td className="px-6 py-4">{log.assignedQty}</td>
                                            <td className="px-6 py-4">{log.cleanedQty}</td>
                                        </tr>
                                        <tr className="bg-gray-50/50 text-gray-900 font-semibold">
                                            <td className="px-6 py-4">Total :</td>
                                            <td className="px-6 py-4">{log.assignedQty}</td>
                                            <td className="px-6 py-4">{log.cleanedQty}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile cards */}
                            <div className="md:hidden space-y-3">
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Date</p>
                                    <p className="text-sm font-bold text-gray-900">
                                        {new Date(log.createdAt).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-1">Assigned</p>
                                        <p className="text-xl font-bold text-blue-700">{log.assignedQty}</p>
                                    </div>
                                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider mb-1">Cleaned</p>
                                        <p className="text-xl font-bold text-green-700">{log.cleanedQty}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/3 flex flex-col justify-between p-4 md:p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Reference</span>
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-medium text-gray-600">
                                    {log.orderReference ? log.orderReference.slice(-6) : log._id.slice(-6)}
                                </span>
                            </div>

                            <div className="text-center mb-5 md:mb-8 pb-5 md:pb-8 border-b border-gray-100">
                                <div className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">Amount Paid</div>
                                <div className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center gap-1.5 md:gap-2 flex-wrap">
                                    <span>{log.cleanedQty}</span>
                                    <span className="text-gray-400 text-lg md:text-xl">×</span>
                                    <span>{log.rate}</span>
                                    <span className="text-gray-400 text-lg md:text-xl">=</span>
                                    <span className="text-orange-600">₹{log.totalAmount}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Method</div>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-orange-50 border border-orange-200 text-orange-700">
                                        {log.paymentMethod === "Cash" ? <MdMoney className="text-lg" /> : <MdOnlinePayment className="text-lg" />}
                                        {log.paymentMethod}
                                    </div>
                                </div>

                                <button
                                    disabled
                                    className="w-full py-3.5 bg-green-600 text-white rounded-lg font-semibold text-base shadow-sm flex items-center justify-center gap-2 opacity-100 cursor-default uppercase tracking-wider"
                                >
                                    <MdCheckCircle className="text-xl" />
                                    Paid successfully
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PaymentLogs;
