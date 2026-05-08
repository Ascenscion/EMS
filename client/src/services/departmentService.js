import api from "../api/axios.js";

export const getDepartments = async () => {
    const response = await api.get("/departments")
    return response.data;
}