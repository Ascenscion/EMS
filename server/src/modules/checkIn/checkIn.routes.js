import * as controller from "./checkIn.controller.js";
import {
    createCheckInSchema,
    updateCheckInSchema,
    checkInParamId
} from "./checkIn.schema.js";
import { Elysia } from "elysia";

export const checkInRoutes = new Elysia({
    prefix: "/checkins"
})

    .get("/", controller.getAllCheckIns)
    .get("/:id", controller.getCheckIn, {
        params: checkInParamId
    })
    .post("/", controller.createCheckIn, {
        body: createCheckInSchema
    })
    .patch("/:id", controller.updateCheckIn, {
        params: checkInParamId,
        body: updateCheckInSchema
    })
    .delete("/:id", controller.deleteCheckIn, {
        params: checkInParamId
    })