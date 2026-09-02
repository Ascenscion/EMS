import db from "../../models/index.js"

const { Event, Location } = db;

const EVENT_STATUSES = ["draft", "active", "completed"];
const REQUIRED_EVENT_FIELDS = [
    "name",
    "start_date",
    "end_date",
    "max_users",
    "description",
    "status",
    "location_name",
    "address_line_1",
    "city",
    "state",
    "zip_code",
];

function validationError(set, message, status = 400) {
    set.status = status;
    return {
        type: "validation_error",
        message,
    };
}

function normalizeEventPayload(body) {
    return {
        ...body,
        name: body.name?.trim(),
        description: body.description?.trim(),
        status: body.status?.trim(),
        location_name: body.location_name?.trim(),
        address_line_1: body.address_line_1?.trim(),
        address_line_2: body.address_line_2?.trim() || null,
        city: body.city?.trim(),
        state: body.state?.trim(),
        zip_code: body.zip_code?.trim(),
        max_users: body.max_users === undefined ? undefined : Number(body.max_users),
        created_by: body.created_by === undefined ? undefined : Number(body.created_by),
    };
}

async function getEventWithLocation(eventId) {
    const event = await Event.findByPk(eventId, {
        include: [
            {
                model: Location,
            }
        ]
    });

    return event ? event.toJSON() : null;
}

function validateEventPayload(body, set, { partial = false } = {}) {
    const payload = normalizeEventPayload(body);
    const requiredFields = partial
        ? REQUIRED_EVENT_FIELDS.filter((field) => field in body)
        : REQUIRED_EVENT_FIELDS;

    for (const field of requiredFields) {
        if (
            payload[field] === undefined ||
            payload[field] === null ||
            payload[field] === ""
        ) {
            return validationError(set, `${field} is required`);
        }
    }

    if ("max_users" in body && (!Number.isInteger(payload.max_users) || payload.max_users < 1)) {
        return validationError(set, "Max users must be at least 1");
    }

    if ("created_by" in body && (!Number.isInteger(payload.created_by) || payload.created_by < 1)) {
        return validationError(set, "Invalid creator selected");
    }

    if ("status" in body && !EVENT_STATUSES.includes(payload.status)) {
        return validationError(set, "Invalid event status");
    }

    if ("start_date" in body || "end_date" in body) {
        if (!payload.start_date || !payload.end_date) {
            return validationError(set, "Start date and end date are required");
        }

        const start = new Date(`${payload.start_date}T00:00:00`);
        const end = new Date(`${payload.end_date}T00:00:00`);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return validationError(set, "Invalid event date");
        }

        if (end < start) {
            return validationError(set, "End date must be after start date");
        }
    }

    return { payload };
}

export async function createEvent({ body, set, authUser }) {
    try {
        const validation = validateEventPayload(body, set);
        if (validation.message) {
            return validation;
        }
        const { payload } = validation;

        const location = await Location.create({
            name: payload.location_name,
            address_line_1: payload.address_line_1,
            address_line_2: payload.address_line_2,
            city: payload.city,
            state: payload.state,
            zip_code: payload.zip_code
        });

        const event = await Event.create({
            name: payload.name,
            start_date: payload.start_date,
            end_date: payload.end_date,
            max_users: payload.max_users,
            description: payload.description,
            status: payload.status,
            created_by: authUser.id,
            location_id: location.id
        })

        return getEventWithLocation(event.id);
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

    return events.map((event) => event.toJSON());
}

export async function getEvent({ params }) {
    const event = await getEventWithLocation(params.id)
    if (!event) {
        return { error: "Event not found" }
    }
    return event;
}

export async function getActiveEvents() {
    const events = await Event.findAll({
        where: {
            status: "active"
        },
        include: [
            { model: Location },
        ]
    })
    return events.map((event) => event.toJSON());
}

export async function updateEvent({ params, body, set }) {
    try {
        const eventId = Number(params.id);
        if (!eventId || Number.isNaN(eventId)) {
            return validationError(set, "Invalid event ID");
        }

        const event = await Event.findByPk(eventId);
        if (!event) {
            return validationError(set, "Event not found", 404);
        }

        const validation = validateEventPayload(body, set, { partial: true });
        if (validation.message) {
            return validation;
        }
        const { payload } = validation;

        await event.update({
            name: payload.name ?? event.name,
            start_date: payload.start_date ?? event.start_date,
            end_date: payload.end_date ?? event.end_date,
            max_users: payload.max_users ?? event.max_users,
            description: payload.description ?? event.description,
            status: payload.status ?? event.status,
        });

        if (event.location_id) {
            const location = await Location.findByPk(event.location_id);
            if (!location) {
                return validationError(set, "Event location not found", 404);
            }

            await location.update({
                name: payload.location_name ?? location.name,
                address_line_1: payload.address_line_1 ?? location.address_line_1,
                address_line_2: payload.address_line_2 ?? location.address_line_2,
                city: payload.city ?? location.city,
                state: payload.state ?? location.state,
                zip_code: payload.zip_code ?? location.zip_code
            });
        }

        return getEventWithLocation(eventId);
    } catch (error) {
        console.error("Error updating event:", error);
        set.status = 500;
        return {
            type: "server_error",
            message: "Could not update event",
            details: error.message,
        };
    }
}

export async function deleteEvent({ params, set }) {
    const eventId = Number(params.id);
    if (!eventId || Number.isNaN(eventId)) {
        return validationError(set, "Invalid event ID");
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
        return validationError(set, "Event not found", 404);
    }

    await event.destroy();
    return {
        type: "success",
        message: "Event deleted successfully",
        id: eventId
    };
}
