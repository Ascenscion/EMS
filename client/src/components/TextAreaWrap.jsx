import React from 'react'

const TextAreaWrap = ({
    label,
    register,
    name,
    rules,
    error,
    placeHolder,
    rows = 4,
    cols
}) => {
    return (
        <div className="flex flex-col gap-1">
            {label &&
                <label className="text-sm text-zinc-600">
                    {label}
                </label>
            }
            <textarea
                rows={rows}
                cols={cols}
                placeholder={placeHolder}
                {...register(name, rules)}
                className="border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {error && (
                <p className="text-red-500 text-sm">
                    {error.message}
                </p>
            )}
        </div>
    )
}

export default TextAreaWrap