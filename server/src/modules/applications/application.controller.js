import { DATE } from "sequelize";
import db from "../../models/index.js"

const { Application } = db;

export async function createApplication({ body }) {
    //const { applied_at, reviewed_by, reviewed_at, user_id, event_id } = body;
    //console.log("STATUS", status);

    const application = await Application.create({
        status: "pending",
        applied_at: new Date(),
        reviewed_at: null,
        reviewed_by: null,
        user_id: body.user_id,
        shift_id: body.shift_id //This will probably give me an error later
    })

    console.log(application);
    return application;
}

export async function getAllApplications() {
    const applications = await Application.findAll();
    return applications;
}

export async function getApplication({ params }) {
    const application = await Application.findByPk(params.id)
    if (!application) {
        return { error: "No application found" }
    }
    return application;
}

export async function updateApplication({ params, body }) {
    const application = await Application.findByPk(params.id);
    if (!application) {
        return { errpr: " No application found" }
    }
    await application.update({
        status: body.status,
        reviewed_at: new Date(),
        // reviewed_by_user_id: currentUser.id
    });
}

export async function deleteApplication({ params }) {
    const deleted = await Application.destroy({
        where: { id: params.id }
    })
    return deleted;
}



