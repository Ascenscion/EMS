import { Elysia } from "elysia";
import * as controller from "./application.controller.js";
import {
    createApplicationSchema,
    updateApplicationSchema,
    applicationIdParam
} from "./application.schema.js";

export const applicationRoutes = new Elysia({
    prefix: "/applications"
})
    .get("/", controller.getApplications)
    .get("/user/:id", controller.getApplicationsByUser, {
        params: applicationIdParam
    })
    .get("/:id", controller.getApplication, {
        params: applicationIdParam
    })

    .post("/", controller.createApplication, {
        body: createApplicationSchema
    })
    .patch("/:id", controller.updateApplication, {
        params: applicationIdParam,
        body: updateApplicationSchema
    })
    .patch("/applications/:id/status", controller.updateApplicationStatus)
    .delete("/:id", controller.deleteApplication, {
        params: applicationIdParam
    })