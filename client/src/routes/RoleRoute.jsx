import React from 'react'
import { Navigate } from 'react-router-dom'

const RoleRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem("user"))

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (!allowedRoles.includes(Number(user.role_id))) {
        return <Navigate to="/" replace />
    }
    return children
}

export default RoleRoute
