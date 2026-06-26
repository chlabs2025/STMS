import { useState, useRef, useEffect } from 'react';
import { MdDownload, MdKeyboardArrowDown } from 'react-icons/md';
import toast from "react-hot-toast";
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
            toast.error(`Failed to download ${filename}. Please try again.`);
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
                className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg px-3 py-2 md:px-4 md:py-2 flex items-center justify-center gap-1.5 md:gap-2 transition-all font-medium text-xs md:text-sm group outline-none"
            >
                <MdDownload className="text-base md:text-lg group-hover:scale-110 transition-transform" />
                <T k="Export Reports" />
                <MdKeyboardArrowDown className={`ml-0.5 text-sm md:text-base transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 min-w-[200px] w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden transform transition-all ">
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
