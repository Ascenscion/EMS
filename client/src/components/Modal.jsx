import React from "react"

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "max-w-lg"
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative z-10 w-full ${maxWidth} max-h-[90vh] rounded-2xl bg-white shadow-xl flex flex-col`}>

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold text-zinc-800">
                        {title}
                    </h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-black">
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal