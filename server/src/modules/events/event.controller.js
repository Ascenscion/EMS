import db from "../../models/index.js"
import { createLocation } from "../locations/location.controller.js";

const { Event, Location } = db;

export async function createEvent({ body, set }) {
    try {
        const {
            name,
            start_date,
            end_date,
            max_users,
            description,
            status,
            created_by,

            location_name,
            address_line_1,
            address_line_2,
            city,
            state,
            zip_code,
        } = body;

        const start = new Date(start_date.split('/').reverse().join('-'));
        const end = new Date(end_date.split('/').reverse().join('-'));

        if (end < start) {
            return { error: "End date must be after start date" }
        }

        const location = await Location.create({
            name: location_name,
            address_line_1,
            address_line_2,
            city,
            state,
            zip_code
        });

        const event = await Event.create({
            name,
            start_date,
            end_date,
            max_users,
            description,
            status,
            created_by,
            location_id: location.id
        })

        return {
            ...event.toJSON(),
            location: location.toJSON()
        }
    } catch (error) {
        console.error("Error creating event:", error);
        console.error("Error message:", error.message);
        console.error("SQL error:", error.original?.message);

        set.status = 500;
        return {
            error: "Could not create event",
            details: error.original?.message || error.message
        };
    }
}

export async function getAllEvents() {
    const events = await Event.findAll({
        include: [
            {
                model: Location,
            }
        ]
    })
    console.log("EVENT CONTROLLER: ", events.Location);
    return events;
}

export async function getEvent({ params }) {
    const event = await Event.findByPk(params.id)
    if (!event) {
        return { error: "Event not found" }
    }
    return event;
}

export async function updateEvent({ params, body }) {
    const event = await Event.findByPk(params.id);
    if (!event) {
        return { error: "Event not found" }
    }

    await event.update(body);
    const updatedEvent = event.toJSON();
    return updatedEvent;
}

export async function deleteEvent({ params }) {
    const deleted = await Event.destroy({
        where: { id: params.id }
    })
    return deleted;
}



