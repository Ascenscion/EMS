import React from "react"

const ReTable = ({ columns, data }) => {
    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">

            <table className="min-w-full text-sm text-left">

                {/* Header */}
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 uppercase text-xs tracking-wider">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.accessor} className="px-6 py-3">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-zinc-200 text-zinc-700">

                    {data.map((row, index) => (
                        <tr key={index} className="hover:bg-zinc-50 transition">

                            {columns.map((col) => (
                                <td key={col.accessor} className="px-6 py-4">
                                    {row[col.accessor]}
                                </td>
                            ))}

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    )
}

export default ReTable