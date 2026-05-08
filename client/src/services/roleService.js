import api from "../api/axios.js";

export const getRoles = async () => {
    const response = await api.get("/roles")
    return response.data;
}