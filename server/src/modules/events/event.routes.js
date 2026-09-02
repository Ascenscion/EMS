import { Elysia } from "elysia";
import * as controller from "./event.controller.js"
import {
    createEventSchema,
    updateEventSchema,
    eventIdParam
} from "./event.schema.js";
import {
    AUTHENTICATED_ROLES,
    MANAGEMENT_ROLES,
    requireRoles
} from "../auth/auth.middleware.js";

export const eventRoutes = new Elysia({
    prefix: "/events"
})
    .get("/", controller.getAllEvents, {
        beforeHandle: requireRoles(MANAGEMENT_ROLES)
    })

    .get("/active", controller.getActiveEvents, {
        beforeHandle: requireRoles(AUTHENTICATED_ROLES)
    })

    .get("/:id", controller.getEvent, {
        params: eventIdParam,
        beforeHandle: requireRoles(AUTHENTICATED_ROLES)
    })

    .post("/", controller.createEvent, {
        body: createEventSchema,
        beforeHandle: requireRoles(MANAGEMENT_ROLES)
    })

    .patch("/:id", controller.updateEvent, {
        params: eventIdParam,
        body: updateEventSchema,
        beforeHandle: requireRoles(MANAGEMENT_ROLES)
    })

    .delete("/:id", controller.deleteEvent, {
        params: eventIdParam,
        beforeHandle: requireRoles(MANAGEMENT_ROLES)
    })
