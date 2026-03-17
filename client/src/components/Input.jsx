import React from "react"

const Input = ({ label, register, name, type = "text" }) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-600">{label}</label>
            <input
                type={type}
                {...register(name)}
                className="border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
        </div>
    )
}

export default Input