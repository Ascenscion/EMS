import api from "../api/axios.js";

export const createApplication = async (payload) => {
    const response = await api.post("/applications", payload)
    return response.data
}

export const getDepartments = async () => {
    const response = await api.get("/departments")
    return response.data;
}