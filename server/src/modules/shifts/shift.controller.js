import db from "../../models/index.js"
const { Shift } = db;

export async function createShift({ body, set }) {
    const { name, start_time, end_time, required_staff, event_id } = body;

    if (!name || !start_time || !end_time || !required_staff || !event_id) {
        set.status = 400;
        return {
            success: false,
            message: "Missing fields"
        }
    }

    if (new Date(end_time) <= new Date(start_time)) {
        set.status = 400;
        return {
            success: false,
            message: "End time must be after start time"
        }
    }
    const shift = await Shift.create({
        event_id,
        name,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        required_staff
    })

    return shift;
}

export async function getAllShifts() {
    const shifts = await Shift.findAll();
    return shifts;
}

export async function getShift({ params }) {
    const shift = await Shift.findByPk(params.id);
    if (!shift) {
        return { error: "No shift found" }
    }
    return shift;
}

export async function updateShift({ params, body }) {
    const shift = await Shift.findByPk(params.id);
    if (!shift) {
        return { error: "No shift found " }
    }
    await shift.update(body)
    return shift;
}

export async function deleteShift({ params }) {
    const deleted = await Shift.destroy({
        where: { id: params.id }
    })
    return deleted;
}
