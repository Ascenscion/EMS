import React from "react"
import { NavLink } from "react-router-dom"
import {
    LayoutDashboard,
    Users,
    Calendar,
    ClipboardList,
    ListChecks
} from "lucide-react"

const Navbar = () => {
    const linkStyle = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg transition
     ${isActive
            ? "bg-zinc-900 text-white"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-black"}`

    return (
        <nav className="flex justify-center gap-2 border-b border-zinc-200 text-sm p-2 bg-white">

            <NavLink to="/" className={linkStyle}>
                <LayoutDashboard size={18} />
                Dashboard
            </NavLink>

            <NavLink to="/users" className={linkStyle}>
                <Users size={18} />
                Users
            </NavLink>

            <NavLink to="/events" className={linkStyle}>
                <Calendar size={18} />
                Events
            </NavLink>

            <NavLink to="/applications" className={linkStyle}>
                <ClipboardList size={18} />
                Applications
            </NavLink>

            <NavLink to="/assignments" className={linkStyle}>
                <ListChecks size={18} />
                Assignments
            </NavLink>

        </nav>
    )
}

export default Navbar