import db from "../../models/index.js"

const { Application, User, Event } = db;

export async function createApplication({ body, set }) {
    try {
        const userId = Number(body.user_id);
        const eventId = Number(body.event_id);
        const shiftId = body.shift_id ? Number(body.shift_id) : null;

        if (!userId || !eventId) {
            set.status = 400;
            return {
                message: "User and event are required",
            };
        }

        const existingApplication = await Application.findOne({
            where: {
                user_id: userId,
                event_id: eventId,
            },
        });

        if (existingApplication) {
            set.status = 409;
            return {
                message: "User has already applied to this event",
            };
        }

        const application = await Application.create({
            status: "pending",
            applied_at: new Date(),
            reviewed_at: null,
            reviewed_by_user_id: null,
            user_id: userId,
            shift_id: shiftId,
            event_id: eventId
        })

        return application.toJSON();

    } catch (error) {
        console.error("Error creating application:", error);

        set.status = 500;
        return {
            message: "Could not create application",
            details: error.errors?.map(e => e.message),
        };
    }
}

export async function getApplications({ set }) {
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
                {
                    model: User,
                    as: "reviewer",
                    attributes: ["id", "first_name", "last_name"]
                }
            ],
            order: [["applied_at", "DESC"]],
        });
        return applications;
    } catch (error) {
        console.error("Error fetching applications: ", error);
        set.status = 500;
        return {
            message: "Could not fetch applications",
            details: error.message,
        }
    }
}

export async function updateApplicationStatus({ params, body, set }) {
    try {
        const id = Number(params.id);
        const { status, reviewed_by_user_id } = body;

        const application = await Application.findByPk(id);

        if (!application) {
            set.status = 404;
            return { message: "Application not found." }
        }

        application.status = status;
        application.reviewed_by_user_id = reviewed_by_user_id;
        application.reviewed_at = new Date();

        await application.save();

        const updatedApplication = await Application.findByPk(id, {
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
                {
                    model: User,
                    as: "reviewer",
                    attributes: ["id", "first_name", "last_name"]
                }
            ]
        });

        return updatedApplication.toJSON();
    } catch (error) {
        console.error("Error updating application: ", error);
        set.status = 500;
        return {
            message: "Could not update application",
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
        },
        include: [
            {
                model: Event,
                as: "event",
                attributes: ["id", "name"]
            },
            {
                model: User,
                as: "reviewer",
                attributes: ["id", "first_name", "last_name"]
            }
        ]
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
