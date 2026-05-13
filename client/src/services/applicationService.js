import api from "../api/axios.js";


export const getApplications = async () => {
    const response = await api.get("/applications");
    return response.data
}

export const getApplicationbyUser = async (userId) => {
    const response = await api.get(`/applications/user/${userId}`)
    return response.data
}

export const updateApplicationStatus = async (id, payload) => {
    const response = await api.patch(`/applications/${id}/status`, payload);
    return response.data;
}

export const createApplication = async (payload) => {
    const response = await api.post("/applications", payload)
    return response.data
}