import db from "../../models/index.js"
//import { Elysia } from "elysia"
const { Shift } = db;

export async function createShift({ body }) {
    const { name, start_time, end_time, required_staff } = body;

    const shift = await Shift.create({
        name,
        start_time,
        end_time,
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