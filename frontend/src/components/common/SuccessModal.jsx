import { MdCheckCircle, MdClose } from "react-icons/md";
import { useEffect, useState } from "react";

const SuccessModal = ({ isOpen, onClose, title, message, subMessage }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            const timer = setTimeout(() => setShow(false), 200); // Wait for exit animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!show && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300 ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <MdClose className="text-xl" />
                </button>

                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
                        <div className="relative bg-green-50 p-4 rounded-full border border-green-100">
                            <MdCheckCircle className="text-5xl text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-600 font-medium">
                        {message}
                    </p>
                    {subMessage && (
                        <p className="text-gray-400 text-sm mt-1">
                            {subMessage}
                        </p>
                    )}
                </div>

                {/* Action Button */}
                <button
                    onClick={onClose}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm active:transform active:scale-95"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
