import React, { useState } from "react"
import { NavLink } from "react-router-dom"
import {
    LayoutDashboard,
    Users,
    Calendar,
    ClipboardList,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react"

const Sidebar = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const [collapsed, setCollapsed] = useState(false)
    const navClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition
    ${isActive
            ? "bg-zinc-900 text-white"
            : "text-zinc-600 hover:bg-zinc-100"}`

    return (
        <aside
            className={`h-screen bg-white border-r border-zinc-200 transition-all duration-300 
      ${collapsed ? "w-20" : "w-64"}`}
        >

            <div className="flex flex-col h-full">

                {/* Collapse button */}
                <div className="flex justify-end p-4">
                    <button onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
                    </button>
                </div>

                <nav className="flex flex-col gap-2 px-3">

                    <NavLink
                        to="/"
                        className={navClass}
                    >
                        <LayoutDashboard size={18} />
                        {!collapsed && "Dashboard"}
                    </NavLink>
                    {user?.role_id === 1 && (
                        <>
                            <NavLink
                                to="/users"
                                className={navClass}
                            >
                                <Users size={18} />
                                {!collapsed && "Users"}
                            </NavLink>

                            <NavLink
                                to="/events"
                                className={navClass}
                            >
                                <Calendar size={18} />
                                {!collapsed && "Events"}
                            </NavLink>

                            <NavLink
                                to="/applications"
                                className={navClass}
                            >
                                <ClipboardList size={18} />
                                {!collapsed && "Applications"}
                            </NavLink>
                        </>
                    )}

                    {user?.role_id === 2 && (
                        <>
                            <NavLink
                                to="/staffevents"
                                className={navClass}
                            >
                                <ClipboardList size={18} />
                                {!collapsed && "StaffEvents"}
                            </NavLink>
                        </>
                    )}
                </nav>

            </div>
        </aside>
    )
}

export default Sidebar