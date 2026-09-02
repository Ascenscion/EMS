import api from "../api/axios";

export async function loginUser(payload) {
    const response = await api.post("/auth/login", payload)
    return response.data
}

export async function getCurrentUser() {
    const response = await api.get("/auth/me")
    return response.data
}

export async function logoutUser() {
    const response = await api.post("/auth/logout")
    return response.data
}
