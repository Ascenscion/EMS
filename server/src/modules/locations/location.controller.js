import { Elysia } from "elysia";
import db from "../../models/index.js"

const { Location } = db;

export async function createLocation({ body }) {
    const { name, address_line_1, address_line_2, city, state, zip_code } = body;
    const location = await Location.create({
        name,
        address_line_1,
        address_line_2,
        city,
        state,
        zip_code
    })
    return location;
}

export async function getAllLocations() {
    const locations = await Location.findAll();
    return locations;
}

export async function getLocation({ params }) {
    const location = await Location.findByPk(params.id);
    if (!location) {
        return { error: "Could not find location" }
    }
    return location;
}

export async function updateLocation({ params, body }) {
    const location = await Location.findByPk(params.id);
    if (!location) {
        return { error: "Could not find location." }
    }
    location.update(body);
    return location;
}

export async function deleteLocation({ params }) {
    const deleted = await Location.destroy({
        where: { id: params.id }
    })
    return deleted;
}