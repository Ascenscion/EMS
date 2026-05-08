import api from "../api/axios.js";

export const createApplication = async (payload) => {
    const response = await api.post("/applications", payload)
    return response.data
}

export const getApplicationbyUser = async (userId) => {
    const response = await api.get("/applications")
    return response.data
}
