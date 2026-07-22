import { Elysia } from "elysia";
import * as controller from "./application.controller.js";
import {
    createApplicationSchema,
    updateApplicationSchema,
    applicationIdParam,
    reviewApplicationSchema
} from "./application.schema.js";

export const applicationRoutes = new Elysia({
    prefix: "/applications"
})
    .get("/", controller.getApplications)
    .get("/user/:id", controller.getApplicationsByUser, {
        params: applicationIdParam
    })
    .patch("/:id/status", controller.updateApplicationStatus, {
        params: applicationIdParam,
        body: reviewApplicationSchema
    })
    .post("/", controller.createApplication, {
        body: createApplicationSchema
    })

    .delete("/:id", controller.deleteApplication, {
        params: applicationIdParam
    })
    .patch("/:id", controller.updateApplication, {
        params: applicationIdParam,
        body: updateApplicationSchema
    })
