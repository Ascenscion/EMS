import React from "react"

const AddButton = ({ children, onClick, type = "button", variant = "primary", className = "" }) => {

    const base =
        "px-4 py-2 rounded-lg text-sm font-medium transition duration-200"

    const variants = {
        primary:
            "bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm",
        secondary:
            "bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100",
        danger:
            "bg-red-600 text-white hover:bg-red-500"
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${base} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    )
}

export default AddButton