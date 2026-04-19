import { useState, useEffect } from 'react';
import { MdTrendingUp, MdTrendingDown, MdInventory, MdAssignmentInd, MdPersonAdd, MdChevronLeft, MdSearch, MdFilterList, MdFileDownload } from 'react-icons/md';
import moment from 'moment';
import api from "../../api/axios";
import API from "../../api/endpoints";
import T from '../../i18n/T';

const AuditLogs = ({ onPageChange }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [total, setTotal] = useState(0);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get(`${API.FULL_ACTIVITY}?limit=100&type=${filterType}&localName=${searchTerm}`);
            if (response.data && response.data.data) {
                setActivities(response.data.data.activities);
                setTotal(response.data.data.total);
            }
        } catch (error) {
            console.error("Error fetching audit logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchLogs();
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [searchTerm, filterType]);

    const getActionConfig = (type) => {
        switch (type) {
            case 'ASSIGNMENT':
                return { label: 'Assigned Employee', icon: MdAssignmentInd, bg: 'bg-purple-100', text: 'text-purple-700' };
            case 'RETURN':
                return { label: 'Imli Cleaned', icon: MdTrendingUp, bg: 'bg-green-100', text: 'text-green-700' };
            case 'RESTOCK':
                return { label: 'Stock Added', icon: MdInventory, bg: 'bg-orange-100', text: 'text-orange-700' };
            case 'REGISTRATION':
                return { label: 'Local Added', icon: MdPersonAdd, bg: 'bg-blue-100', text: 'text-blue-700' };
            default:
                return { label: 'System Action', icon: MdFilterList, bg: 'bg-gray-100', text: 'text-gray-700' };
        }
    };

    const handleExport = () => {
        if (!activities || activities.length === 0) return;
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Timestamp,Activity,Subject,Quantity\n"
            + activities.map(log => {
                const config = getActionConfig(log.type);
                const time = moment(log.createdAt).format('DD MMM YYYY hh:mm A');
                const subject = log.localName || 'System';
                const qty = log.quantity > 0 ? `${log.quantity} ${log.unit}` : '-';
                return `"${time}","${config.label}","${subject}","${qty}"`;
            }).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `STMS_Audit_Log_${moment().format('YYYY-MM-DD')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-full bg-gray-50 flex flex-col p-4 md:p-8">
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => onPageChange('dashboard')}
                            className="bg-white p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-orange-500 hover:border-orange-100 transition-all active:scale-95 shadow-sm"
                        >
                            <MdChevronLeft className="text-2xl" />
                        </button>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">System Audit Log</h2>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Full Transaction History</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                            <MdFileDownload className="text-lg" />
                            <span>Export History</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="relative group flex-1">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl transition-colors group-focus-within:text-orange-500" />
                        <input
                            type="text"
                            placeholder="Search by worker name..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <select 
                        className="bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 outline-none focus:bg-white focus:border-orange-200 transition-all"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="">All Activity Types</option>
                        <option value="ASSIGNMENT">Imli Assignments</option>
                        <option value="RETURN">Imli Returns</option>
                        <option value="RESTOCK">Stock Additions</option>
                        <option value="REGISTRATION">Local Registrations</option>
                    </select>

                    <div className="flex items-center justify-end px-2">
                        <span className="text-sm font-bold text-gray-400">Total Entries: <span className="text-gray-900">{total}</span></span>
                    </div>
                </div>

                {/* Table Layout */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="w-full">
                        <table className="w-full text-left border-collapse table-fixed md:table-auto">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-3 md:px-6 py-4 text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest w-[85px] md:w-1/4">Timestamp</th>
                                    <th className="px-2 md:px-6 py-4 text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest">Activity</th>
                                    <th className="px-2 md:px-6 py-4 text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest w-[80px] md:w-1/4">Subject</th>
                                    <th className="px-3 md:px-6 py-4 text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right w-[60px] md:w-auto">Qty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="4" className="px-6 py-6 h-16 bg-gray-50/50"></td>
                                        </tr>
                                    ))
                                ) : activities.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <MdInventory className="text-5xl text-gray-100 mb-4" />
                                                <p className="text-gray-400 font-medium tracking-tight">No historical logs found matching your criteria</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    activities.map((log) => {
                                        const config = getActionConfig(log.type);
                                        const Icon = config.icon;
                                        return (
                                            <tr key={log._id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-3 md:px-6 py-4 md:py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] md:text-sm font-bold text-gray-800 leading-tight">{moment(log.createdAt).format('DD MMM')}</span>
                                                        <span className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{moment(log.createdAt).format('hh:mm A')}</span>
                                                    </div>
                                                </td>
                                                <td className="px-2 md:px-6 py-4 md:py-5">
                                                    <div className="flex items-center gap-1.5 md:gap-3">
                                                        <div className={`p-1.5 md:p-2 rounded-lg ${config.bg} ${config.text} border border-transparent shrink-0`}>
                                                            <Icon className="text-sm md:text-lg" />
                                                        </div>
                                                        <span className={`text-[9px] md:text-[11px] font-bold tracking-tight md:tracking-wide overflow-hidden break-words whitespace-normal ${config.text} leading-tight`}>
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-2 md:px-6 py-4 md:py-5">
                                                    <p className="text-[11px] md:text-sm font-bold text-gray-800 tracking-tight whitespace-normal break-words">
                                                        {log.localName || 'System'}
                                                    </p>
                                                </td>
                                                <td className="px-3 md:px-6 py-4 md:py-5 text-right">
                                                    {log.quantity > 0 ? (
                                                        <div className="flex items-baseline justify-end gap-0.5">
                                                            <span className="text-[13px] md:text-base font-bold text-gray-900 tracking-tighter">{log.quantity}</span>
                                                            <span className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase">{log.unit}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-300 font-bold">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuditLogs;
