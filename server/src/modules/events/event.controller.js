import db from "../../models/index.js"

const { Event } = db;

export async function createEvent({ body }) {
    const { name, start_date, end_date, status, created_by, location_id } = body;

    const start = new Date(start_date.split('/').reverse().join('-'));
    const end = new Date(end_date.split('/').reverse().join('-'));
    if (end < start) {
        return { error: "End date must be after start date" }
    }

    const event = await Event.create({
        name,
        start_date,
        end_date,
        status,
        created_by,
        location_id
    })
    console.log(event);
    return event;
}

export async function getAllEvents() {
    const events = await Event.findAll();
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

