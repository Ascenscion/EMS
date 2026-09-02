import db from "../../models/index.js"
const { CheckIn } = db;

export async function createCheckIn({ body }) {
    const { check_in_time, check_out_time, verified_by } = body;
    const check_in = await CheckIn.create({
        check_in_time,
        check_out_time,
        verified_by
    })

    return check_in
}

export async function getAllCheckIns() {
    const checkIns = await CheckIn.findAll();
    return checkIns;
}

export async function getCheckIn({ params }) {
    const checkIn = await CheckIn.findByPk(params.id);
    if (!checkIn) {
        return { error: "No check in found " }
    }
    return checkIn;
}

export async function updateCheckIn({ params, body }) {
    const checkIn = await CheckIn.findByPk(params.id);
    if (!checkIn) {
        return { error: "No check in found" }
    }
    await checkIn.update(body);
    return checkIn;
}

export async function deleteCheckIn({ params }) {
    const deleted = await CheckIn.destroy({
        where: { id: params.id }
    })
    return deleted;
}
