import React from 'react'
import { Navigate } from 'react-router-dom'
const ProtectedRoutes = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("authToken")

    if (!user || !token) {
        return <Navigate to="/login" replace />
    }
    return children
}

export default ProtectedRoutes
