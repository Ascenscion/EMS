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
    .get("/", controller.getAllApplications)
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
    .delete("/:id", controller.deleteApplication, {
        params: applicationIdParam
    })