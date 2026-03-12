import db from "../../models/index.js"

const { Application } = db;

export async function createApplication({ body }) {
    const { status, applied_at, reviewed_by, reviewed_at, user_id, event_id } = body;
    console.log("STATUS", status);



    const application = await Application.create({
        status,
        applied_at,
        reviewed_at,
        reviewed_by,
        user_id,
        event_id
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
    await application.update(body);
}

export async function deleteApplication({ params }) {
    const deleted = await Application.destroy({
        where: { id: params.id }
    })
    return deleted;
}
