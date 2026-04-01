import { useState, useRef, useEffect } from 'react';
import { MdDownload, MdKeyboardArrowDown } from 'react-icons/md';
import api from "../../api/axios";
import API from "../../api/endpoints";
import T from '../../i18n/T';

const ExcelExport = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleDownload = async (endpoint, filename) => {
        try {
            const response = await api.get(endpoint, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setIsOpen(false);
        } catch (error) {
            console.error(`Download failed for ${endpoint}:`, error);
            alert(`Failed to download ${filename}. Please try again.`);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl p-3 md:p-4 flex items-center justify-center gap-2 transition-all font-semibold md:text-[15px] group outline-none"
            >
                <MdDownload className="text-xl group-hover:scale-110 transition-transform" />
                <T k="Export Reports" />
                <MdKeyboardArrowDown className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 min-w-[200px] w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden transform transition-all animate-in fade-in slide-in-from-top-2">
                    <button
                        onClick={() => handleDownload(API.EXPORT_LOCALS, "Locals_Report.xlsx")}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 text-gray-700 text-xs md:text-sm border-b border-gray-100 flex items-center gap-3 transition-colors"
                    >
                        <MdDownload className="text-green-500 shrink-0" />
                        <span className="truncate"><T k="Locals Data Excel" /></span>
                    </button>
                    <button
                        onClick={() => handleDownload(API.EXPORT_PAYMENTS, "Payments_Report.xlsx")}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 text-gray-700 text-xs md:text-sm flex items-center gap-3 transition-colors"
                    >
                        <MdDownload className="text-green-500 shrink-0" />
                        <span className="truncate"><T k="Payments Data Excel" /></span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExcelExport;
