import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdAdd, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

import api from "../../api/axios";

const DropdownPortal = ({ children, parentRef, isOpen, onClose }) => {
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        const updatePosition = () => {
            if (parentRef.current && isOpen) {
                const rect = parentRef.current.getBoundingClientRect();
                setCoords({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width
                });
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [parentRef, isOpen]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (parentRef.current && !parentRef.current.contains(e.target) && !e.target.closest('.dropdown-portal')) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, parentRef]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="dropdown-portal absolute z-[9999] bg-white rounded-lg shadow-lg border border-gray-100 mt-1 max-h-48 overflow-y-auto"
            style={{
                top: coords.top,
                left: coords.left,
                width: coords.width,
            }}
        >
            {children}
        </div>,
        document.body
    );
};

const SackEntryColumn = ({
    rows,
    activeDropdown,
    handleChange,
    handleSelectLocal,
    getFilteredLocals,
    toggleRowDelivered,
    toggleAllDelivered,
    allDelivered,
    addRow,
    setActiveDropdown,
    quantityInputRefs,
    inputRefs
}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">ID / Name</div>
                <div className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider text-right pr-4">Quantity</div>
                <div className="w-[100px] flex flex-col items-center justify-center border-l border-gray-200 pl-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Delivered</span>
                    <input
                        type="checkbox"
                        checked={allDelivered}
                        onChange={toggleAllDelivered}
                        className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 cursor-pointer transition-transform hover:scale-105"
                    />
                </div>
            </div>

            {/* Rows */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                {rows.map((row, index) => (
                    <div
                        key={index}
                        className={`flex items-center px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-colors duration-200 group ${row.delivered ? 'bg-orange-50/30' : ''}`}
                    >
                        <div className="flex-1 pr-3 relative local-search-container" ref={el => inputRefs.current[index] = el}>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={row.localId}
                                    onChange={(e) => handleChange(index, 'localId', e.target.value)}
                                    onFocus={() => setActiveDropdown(index)}
                                    className="w-20 bg-transparent border-b border-transparent focus:border-orange-500 outline-none text-sm font-medium text-gray-700 placeholder-gray-400 py-1 transition-all"
                                    placeholder="Enter ID"
                                />
                                {row.localName && (
                                    <span className="text-sm text-gray-500 truncate flex-1" title={row.localName}>
                                        {row.localName}
                                    </span>
                                )}
                            </div>

                            <DropdownPortal
                                parentRef={{ current: inputRefs.current[index] }}
                                isOpen={activeDropdown === index && !!row.localId}
                                onClose={() => setActiveDropdown(null)}
                            >
                                {getFilteredLocals(row.localId).length > 0 ? (
                                    getFilteredLocals(row.localId).map((local) => (
                                        <div
                                            key={local._id || local.LocalID}
                                            onClick={() => {
                                                handleSelectLocal(index, local);
                                            }}
                                            className="px-3 py-2 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0"
                                        >
                                            <div className="text-sm font-medium text-gray-900">{local.LocalID}</div>
                                            <div className="text-xs text-gray-500 truncate">{local.LocalName}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-xs text-gray-400">No match found</div>
                                )}
                            </DropdownPortal>
                        </div>
                        <div className="flex-1 pl-3 pr-4 border-l border-gray-100">
                            <input
                                ref={el => quantityInputRefs.current[index] = el}
                                type="number"
                                value={row.quantity}
                                onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                                className="w-full bg-transparent border-b border-transparent focus:border-orange-500 outline-none text-sm font-medium text-gray-700 placeholder-gray-400 py-1 text-right transition-all"
                                placeholder="0"
                            />
                        </div>
                        <div className="w-[100px] flex items-center justify-center border-l border-gray-100 pl-2">
                            <input
                                type="checkbox"
                                checked={row.delivered}
                                onChange={() => toggleRowDelivered(index)}
                                className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 cursor-pointer transition-transform hover:scale-105"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Add Button */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <button
                    onClick={addRow}
                    className="w-full bg-white hover:bg-orange-50 text-gray-600 hover:text-orange-700 font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 border border-gray-300 hover:border-orange-200 shadow-sm hover:shadow-md"
                >
                    <div className="bg-gray-100 group-hover:bg-orange-100 p-1 rounded-full transition-colors">
                        <MdAdd className="text-lg" />
                    </div>
                    <span className="text-sm">Add New Row</span>
                </button>
            </div>
        </div>
    );
};

const SackEntry = () => {
    // START: Date & Persistence Logic
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDateLoading, setIsDateLoading] = useState(false);

    const getStorageKey = (date) => {
        const dateString = date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
        return `sack_entries_${dateString}`;
    };

    // Load initial state from storage or default
    const loadState = (date) => {
        const saved = localStorage.getItem(getStorageKey(date));
        return saved ? JSON.parse(saved) : [{ localId: '', quantity: '', delivered: false, localName: '' }];
    };

    const [rows, setRows] = useState(() => loadState(selectedDate));
    const [allLocals, setAllLocals] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Refs
    const inputRefs = useRef({});
    const quantityInputRefs = useRef({});

    // Effect to reload rows when date changes
    useEffect(() => {
        // Force reload from storage for the new date
        const newRows = loadState(selectedDate);
        setRows(newRows);
        // Data is now loaded for the new date, enable saving
        setIsDateLoading(false);
    }, [selectedDate]);

    // Effect to save rows when they change
    useEffect(() => {
        // Guard: Don't save if we are in the middle of loading/switching dates
        if (isDateLoading) return;

        // Save to the CURRENT selected date
        localStorage.setItem(getStorageKey(selectedDate), JSON.stringify(rows));
    }, [rows, selectedDate, isDateLoading]);

    // Format date for display
    const formattedDate = selectedDate.toLocaleDateString('en-GB');

    // Check if we can go to next day (cannot go beyond today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const current = new Date(selectedDate);
    current.setHours(0, 0, 0, 0);
    const canGoNext = current.getTime() < today.getTime();

    const changeDate = (days) => {
        // Prevent going to future
        if (days > 0 && !canGoNext) return;

        // Disable saving immediately
        setIsDateLoading(true);

        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
    };
    // END: Date & Persistence Logic

    useEffect(() => {
        const fetchLocals = async () => {
            try {
                const response = await api.post("/return_local");
                if (response.data && response.data.data) {
                    setAllLocals(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching locals:", error);
            }
        };
        fetchLocals();
    }, []);

    const addRow = () => {
        setRows([...rows, { localId: '', quantity: '', delivered: false, localName: '' }]);
    };

    const checkForDuplicate = (id, currentIndex) => {
        const existingIndex = rows.findIndex((row, idx) => idx !== currentIndex && String(row.localId) === String(id) && row.localId !== '');
        if (existingIndex !== -1) {
            toast.success("Redirected to existing entry", { duration: 2000 });
            // Focus on expectation
            setTimeout(() => {
                if (quantityInputRefs.current[existingIndex]) {
                    quantityInputRefs.current[existingIndex].focus();
                }
            }, 50);
            return existingIndex;
        }
        return -1;
    };

    const handleChange = (index, field, value) => {
        if (field === 'quantity' && value < 0) return;

        const newRows = [...rows];
        newRows[index][field] = value;

        if (field === 'localId') {
            // Check for duplicate on manual entry (if it matches a valid ID)
            // We only strict check if it's a "complete" ID matching our list, or simple duplicate check?
            // User requested: "if user again enter that Id again so redirect it to previously entered"

            // Simple check: if this value exists in another row
            if (value) {
                const duplicateIndex = checkForDuplicate(value, index);
                if (duplicateIndex !== -1) {
                    // Clear the current input to avoid the duplicate sticking
                    newRows[index][field] = '';
                    newRows[index].localName = '';
                    setRows(newRows);
                    return; // Stop processing
                }
            }

            const match = allLocals.find(l => String(l.LocalID) === String(value));
            if (match) {
                newRows[index].localName = match.LocalName;
            } else {
                newRows[index].localName = '';
            }
            setActiveDropdown(index);
        }

        setRows(newRows);
    };

    const handleSelectLocal = (index, local) => {
        // Check duplicate before setting
        const duplicateIndex = checkForDuplicate(local.LocalID, index);
        if (duplicateIndex !== -1) {
            // If duplicate found, we don't update this row with the new ID.
            // We just close dropdown. The checkForDuplicate handles focus.
            setActiveDropdown(null);
            return;
        }

        const newRows = [...rows];
        newRows[index].localId = local.LocalID;
        newRows[index].localName = local.LocalName;
        setRows(newRows);
        setActiveDropdown(null);

        // Auto-focus quantity logic here directly or via effect?
        // Doing it here ensures it runs after state update if we used refs, but refs are stable.
        setTimeout(() => {
            if (quantityInputRefs.current[index]) {
                quantityInputRefs.current[index].focus();
            }
        }, 50);
    };

    const getFilteredLocals = (query) => {
        if (!query) return [];
        const queryString = String(query).toLowerCase();
        return allLocals.filter(local =>
            String(local.LocalID).toLowerCase().includes(queryString) ||
            local.LocalName.toLowerCase().includes(queryString)
        );
    };

    const toggleRowDelivered = (index) => {
        const newRows = [...rows];
        newRows[index].delivered = !newRows[index].delivered;
        setRows(newRows);
    };

    const allDelivered = rows.length > 0 && rows.every(row => row.delivered);
    const toggleAllDelivered = () => {
        const newDeliveredState = !allDelivered;
        const newRows = rows.map(row => ({ ...row, delivered: newDeliveredState }));
        setRows(newRows);
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-full flex flex-col relative">
            <Toaster position="top-center" />
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-gray-900">
                        Sack Entry
                    </h3>
                    {/* Date Navigation */}
                    <div className="flex items-center bg-gray-100 rounded-full border border-gray-200 p-1">
                        <button
                            onClick={() => changeDate(-1)}
                            className="p-1 hover:bg-white hover:shadow-sm rounded-full transition-all text-gray-500 hover:text-orange-600"
                        >
                            <MdChevronLeft className="text-lg" />
                        </button>
                        <span className="text-sm font-medium text-gray-700 px-3 min-w-[90px] text-center">
                            {formattedDate}
                        </span>
                        <button
                            onClick={() => changeDate(1)}
                            disabled={!canGoNext}
                            className={`p-1 rounded-full transition-all ${canGoNext
                                ? 'hover:bg-white hover:shadow-sm text-gray-500 hover:text-orange-600 cursor-pointer'
                                : 'text-gray-300 cursor-not-allowed'
                                }`}
                        >
                            <MdChevronRight className="text-lg" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={addRow}
                        className="text-gray-500 hover:text-orange-600 p-1.5 hover:bg-orange-50 rounded-lg transition-all duration-200 flex items-center justify-center border border-transparent hover:border-orange-100"
                        title="Add New Row"
                    >
                        <MdAdd className="text-xl" />
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <SackEntryColumn
                    rows={rows}
                    activeDropdown={activeDropdown}
                    handleChange={handleChange}
                    handleSelectLocal={handleSelectLocal}
                    getFilteredLocals={getFilteredLocals}
                    toggleRowDelivered={toggleRowDelivered}
                    toggleAllDelivered={toggleAllDelivered}
                    allDelivered={allDelivered}
                    addRow={addRow}
                    setActiveDropdown={setActiveDropdown}
                    quantityInputRefs={quantityInputRefs}
                    inputRefs={inputRefs}
                />
            </div>
        </div>
    );
};

export default SackEntry;
