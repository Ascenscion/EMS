import React from 'react'
import { Navigate } from 'react-router-dom'

const RoleRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("authToken")

    if (!user || !token) {
        return <Navigate to="/login" replace />
    }

    if (!allowedRoles.includes(Number(user.role_id))) {
        return <Navigate to="/" replace />
    }
    return children
}

export default RoleRoute
