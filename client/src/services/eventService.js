import api from "../api/axios.js"

export const getEvents = async () => {
    const response = await api.get("events")
    return response.data;
}

export const getActiveEvents = async () => {
    const response = await api.get("/events/active")
    return response.data;
}

export const getEventById = async () => {
    const response = await api.get(`/events/${id}`);
    return response.data;
}

export const createEvent = async (eventData) => {
    const response = await api.post("/events", eventData)
    return response.data
}

export const updateEvent = async (id, eventData) => {
    const response = await api.patch(`/events/${id}`, eventData)
    return response.data
}

export const deleteEvent = async (id) => {
    const response = await api.delete(`/events/${id}`)
    return response.data
}
