import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("user");
        }

        return Promise.reject(error);
    }
);

export default api
