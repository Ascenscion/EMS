import React from "react"

const InputWrap = ({
    label,
    register,
    name,
    rules,
    type = 'text',
    error,
    placeHolder,
    options = [] }) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-600">
                {label}
            </label>

            {type === "select" ? (
                <select
                    {...register(name, rules)}
                    className="border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-800"
                >
                    <option value="">
                        Select an option
                    </option>

                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    placeholder={placeHolder}
                    type={type}
                    {...register(name, rules)}
                    className="border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-800"
                />
            )}

            {error && (
                <p className="text-red-500 text-sm">
                    {error.message}
                </p>
            )}
        </div>
    )
}
export default InputWrap