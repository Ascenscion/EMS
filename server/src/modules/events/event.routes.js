import { Elysia } from "elysia";
import * as controller from "./event.controller.js"
import {
    createEventSchema,
    updateEventSchema,
    eventIdParam
} from "./event.schema.js";

export const eventRoutes = new Elysia({
    prefix: "/events"
})
    .get("/", controller.getAllEvents)

    .get("/active", controller.getActiveEvents)

    .get("/:id", controller.getEvent, {
        params: eventIdParam
    })

    .post("/", controller.createEvent, {
        body: createEventSchema
    })

    .patch("/:id", controller.updateEvent, {
        params: eventIdParam,
        body: updateEventSchema
    })

    .delete("/:id", controller.deleteEvent, {
        params: eventIdParam
    })
