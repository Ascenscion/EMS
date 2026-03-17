import React from "react"

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 z-10">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-zinc-800">
                        {title}
                    </h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-black">
                        ✕
                    </button>
                </div>

                {/* Body */}
                {children}
            </div>
        </div>
    )
}

export default Modal