import React, { useState, useEffect, useMemo } from 'react';
import { MdHistory, MdRefresh, MdError, MdCheckCircle, MdMoney, MdPayment as MdOnlinePayment, MdFilterList, MdClose } from 'react-icons/md';
import { TableSkeleton, ListItemSkeleton } from "../../components/Skeletons";
import api from "../../api/axios";
import API from "../../api/endpoints";
import T from '../../i18n/T';

const PaymentLogs = ({ localID }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState({ from: "", to: "" });

    const fetchLogs = async () => {
        if (!localID) return;
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(API.PAYMENT_LOGS, { params: { localID } });
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localID]);

    const filteredLogs = useMemo(() => {
        if (!dateFilter.from && !dateFilter.to) return logs;
        
        return logs.filter(log => {
            const itemDate = new Date(log.createdAt);
            itemDate.setHours(0, 0, 0, 0);
            
            if (dateFilter.from) {
                const fromDate = new Date(dateFilter.from);
                fromDate.setHours(0, 0, 0, 0);
                if (itemDate < fromDate) return false;
            }
            
            if (dateFilter.to) {
                const toDate = new Date(dateFilter.to);
                toDate.setHours(0, 0, 0, 0);
                if (itemDate > toDate) return false;
            }
            
            return true;
        });
    }, [logs, dateFilter]);

    if (loading) {
        return (
            <div className="p-3 md:p-6 w-full max-w-7xl mx-auto space-y-4">
                <TableSkeleton rows={5} columns={5} />
                <ListItemSkeleton count={5} />
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
            {/* Filter Section */}
            <div className="bg-gray-50/50 rounded-xl border border-gray-200 p-3 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto w-full">
                    <MdFilterList className="text-gray-400 text-lg shrink-0" />
                    <span className="text-xs font-semibold text-gray-500 capitalize shrink-0">Filter By Date:</span>
                    <div className="flex items-center gap-2 ml-1 sm:ml-2">
                        <input 
                            type="date" 
                            value={dateFilter.from}
                            onChange={(e) => setDateFilter({...dateFilter, from: e.target.value})}
                            className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-orange-300 text-gray-600 w-[110px] sm:w-auto"
                        />
                        <span className="text-xs text-gray-400 shrink-0">to</span>
                        <input 
                            type="date" 
                            value={dateFilter.to}
                            onChange={(e) => setDateFilter({...dateFilter, to: e.target.value})}
                            className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-orange-300 text-gray-600 w-[110px] sm:w-auto"
                        />
                        {(dateFilter.from || dateFilter.to) && (
                            <button 
                                onClick={() => setDateFilter({ from: "", to: "" })}
                                className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                                title="Clear Filter"
                            >
                                <MdClose className="text-xs" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {filteredLogs.length === 0 ? (
                <div className="text-center py-10 text-gray-400 bg-white border border-gray-100 rounded-xl">
                    <p className="font-medium italic">No payment records match this date filter.</p>
                </div>
            ) : (
                filteredLogs.map((log) => (
                <div key={log._id} className="flex flex-col lg:flex-row justify-between gap-5 md:gap-10 p-4 md:p-6 bg-white border border-gray-200 rounded-2xl shadow-sm mb-6">
                    <div className="lg:w-2/3">
                        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                            <div className="bg-green-600 text-white rounded-lg p-2 flex-shrink-0">
                                <MdCheckCircle className="text-lg" />
                            </div>
                            <div>
                                <p className="text-[10px] md:text-xs text-gray-400 font-bold capitalize tracking-wider">Payment Confirmed On</p>
                                <p className="text-sm md:text-base font-bold text-gray-800 mt-0.5">
                                    {new Date(log.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} at {new Date(log.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                                </p>
                            </div>
                        </div>

                        {/* Mobile: Cards | Desktop: Table */}
                        <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 capitalize text-xs font-semibold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Transaction Details</th>
                                        <th className="px-6 py-4">Assigned Quantity</th>
                                        <th className="px-6 py-4">Cleaned Quantity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                                    <tr className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            {log.orderReference ? `Order Ref: ${log.orderReference.slice(-6)}` : "Direct Payment"}
                                        </td>
                                        <td className="px-6 py-4">{log.assignedQty} KG</td>
                                        <td className="px-6 py-4 text-green-700 font-bold">{log.cleanedQty} KG</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                    <p className="text-[10px] text-blue-500 font-bold capitalize tracking-wider mb-1">Assigned</p>
                                    <p className="text-xl font-bold text-blue-700">{log.assignedQty} KG</p>
                                </div>
                                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                    <p className="text-[10px] text-green-500 font-bold capitalize tracking-wider mb-1">Cleaned</p>
                                    <p className="text-xl font-bold text-green-700">{log.cleanedQty} KG</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/3 flex flex-col justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-semibold text-gray-500 capitalize tracking-wider">Receipt Reference</span>
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-medium text-gray-600">
                                {log.orderReference ? log.orderReference.slice(-6) : log._id.slice(-6)}
                            </span>
                        </div>

                        <div className="text-center mb-4 pb-4 border-b border-gray-100">
                            <div className="text-gray-500 text-xs font-medium mb-1 capitalize tracking-wide">Amount Paid</div>
                            <div className="text-xl md:text-2xl font-bold text-gray-900 flex items-center justify-center gap-1.5 flex-wrap">
                                <span>{log.cleanedQty} KG</span>
                                <span className="text-gray-400 text-base">×</span>
                                <span>₹{log.rate}</span>
                                <span className="text-gray-400 text-base">=</span>
                                <span className="text-green-600">₹{log.totalAmount}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="text-xs font-semibold text-gray-500 capitalize tracking-wider">Payment Method</div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold bg-green-50 border border-green-200 text-green-700">
                                    {log.paymentMethod === "Cash" ? <MdMoney className="text-base" /> : <MdOnlinePayment className="text-base" />}
                                    {log.paymentMethod}
                                </div>
                            </div>

                            <button
                                disabled
                                className="w-full py-2.5 bg-green-600 text-white rounded-lg font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 opacity-100 cursor-default capitalize tracking-wider"
                            >
                                <MdCheckCircle className="text-base animate-pulse" />
                                Payment Done
                            </button>
                        </div>
                    </div>
                </div>
            )))}
        </div>
    );
};

export default PaymentLogs;

