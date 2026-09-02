import { Elysia } from "elysia";
import * as controller from "./application.controller.js";
import {
    createApplicationSchema,
    updateApplicationSchema,
    applicationIdParam,
    reviewApplicationSchema
} from "./application.schema.js";
import {
    MANAGEMENT_ROLES,
    STAFF_ROLES,
    requireRoles,
    requireSelfOrRoles
} from "../auth/auth.middleware.js";

export const applicationRoutes = new Elysia({
    prefix: "/applications"
})
    .get("/", controller.getApplications, {
        beforeHandle: requireRoles(MANAGEMENT_ROLES)
    })
    .get("/user/:id", controller.getApplicationsByUser, {
        params: applicationIdParam,
        beforeHandle: requireSelfOrRoles(({ params }) => params.id, MANAGEMENT_ROLES)
    })
    .patch("/:id/status", controller.updateApplicationStatus, {
        params: applicationIdParam,
        body: reviewApplicationSchema,
        beforeHandle: requireRoles(MANAGEMENT_ROLES)
    })
    .post("/", controller.createApplication, {
        body: createApplicationSchema,
        beforeHandle: requireRoles(STAFF_ROLES)
    })

    .delete("/:id", controller.deleteApplication, {
        params: applicationIdParam,
        beforeHandle: requireRoles(MANAGEMENT_ROLES)
    })
    .patch("/:id", controller.updateApplication, {
        params: applicationIdParam,
        body: updateApplicationSchema,
        beforeHandle: requireRoles(MANAGEMENT_ROLES)
    })
