import * as controller from "./shift.controller.js";
import {
    createShiftSchema,
    updateShiftSchema,
    shiftParamsId
} from "./shift.schema.js";
import { Elysia } from "elysia";

export const shiftRoutes = new Elysia({
    prefix: "/shifts"
})
    .get("/", controller.getAllShifts)
    .get("/:id", controller.getShift, {
        params: shiftParamsId
    })
    .post("/", controller.createShift, {
        body: createShiftSchema
    })
    .patch("/:id", controller.updateShift, {
        params: shiftParamsId,
        body: updateShiftSchema
    })
    .delete("/:id", controller.deleteShift, {
        params: shiftParamsId
    })
