import { DATE, where } from "sequelize";
import db from "../../models/index.js"

const { Application, User, Event } = db;

export async function createApplication({ body }) {
    //const { applied_at, reviewed_by, reviewed_at, user_id, event_id } = body;
    //console.log("STATUS", status);
    try {
        const existingApplication = await Application.findOne({
            where: {
                user_id: body.user_id,
                event_id: body.event_id,
            },
        });

        if (existingApplication) {
            set.status = 409;
            return {
                error: "User has already applied to this event",
            };
        }

        const application = await Application.create({
            status: "pending",
            applied_at: new Date(),
            reviewed_at: null,
            reviewed_by: null,
            user_id: body.user_id,
            shift_id: body.shift_id, //This will probably give me an error later
            event_id: body.event_id
        })

        console.log(application);
        return application;

    } catch (error) {
        console.error("Error creating application:", error);
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Errors:", error.errors?.map(e => e.message));

        set.status = 500;
        return {
            error: "Could not create application",
            name: error.name,
            message: error.message,
            details: error.errors?.map(e => e.message),
        };
    }
}

export async function getApplications() {
    try {
        const applications = await Application.findAll({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "first_name", "last_name", "email"]
                },
                {
                    model: Event,
                    as: "event",
                    attributes: ["id", "name"]
                },
            ],
            order: [["applied_at", "DESC"]],
        });
        return applications;
    } catch (error) {
        console.error("Error fetching applications: ", error);
        console.log("Backend error:", error.response?.data);
        set.status = 500;
        return {
            error: "Could not fetch applications",
            details: error.message,
        }
    }
}

export async function updateApplicationStatus({ params, body, set }) {
    try {
        const { id } = params;
        const { status, reviewed_by_user_id } = body;

        const application = await Application.findByPk(id);

        if (!application) {
            set.status = 404;
            return { error: "Application not found." }
        }
        application.status = status;
        application.reviewed_by_user_id = reviewed_by_user_id;
        application.reviewed_at = new Date();

        await application.save();
        return application;
    } catch (error) {
        console.error("Error updating application: ", error);
        set.status = 500;
        return {
            error: "Could not update application",
            details: error.message,
        }
    }
}

export async function getApplication({ params }) {
    const application = await Application.findByPk(params.id)
    if (!application) {
        return { error: "No application found" }
    }
    return application;
}

export async function getApplicationsByUser({ params }) {
    const application = await Application.findAll({
        where: {
            user_id: Number(params.id)
        }
    })
    return application
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



