import React from "react"
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/loginService";

const Header = () => {
    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            await logoutUser();
        } finally {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    return (
        <header className="w-full border-b border-zinc-200 bg-white">

            <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4">

                {/* Left section */}
                <div className="flex items-center gap-3">

                    {/* Logo circle */}
                    <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">EMS</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-lg font-semibold tracking-wide text-zinc-800">
                        Employee Management System
                    </h1>

                </div>

                {/* Right section */}
                <div className="flex items-center gap-6">

                    <button
                        className="text-sm text-zinc-500 hover:text-zinc-800 transition"
                        onClick={handleLogout}>
                        Logout
                    </button>

                    <button className="text-sm text-zinc-500 hover:text-zinc-800 transition">
                        Settings
                    </button>

                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-zinc-200"></div>

                </div>

            </div>

        </header>
    )
}

export default Header
