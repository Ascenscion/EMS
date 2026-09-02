import * as controller from "./shift.controller.js";
import {
    createShiftSchema,
    updateShiftSchema,
    shiftParamsId
} from "./shift.schema.js";
import { Elysia } from "elysia";
import { MANAGEMENT_ROLES, requireRoles } from "../auth/auth.middleware.js";

const requireManagement = requireRoles(MANAGEMENT_ROLES);

export const shiftRoutes = new Elysia({
    prefix: "/shifts"
})
    .get("/", controller.getAllShifts, {
        beforeHandle: requireManagement
    })
    .get("/:id", controller.getShift, {
        params: shiftParamsId,
        beforeHandle: requireManagement
    })
    .post("/", controller.createShift, {
        body: createShiftSchema,
        beforeHandle: requireManagement
    })
    .patch("/:id", controller.updateShift, {
        params: shiftParamsId,
        body: updateShiftSchema,
        beforeHandle: requireManagement
    })
    .delete("/:id", controller.deleteShift, {
        params: shiftParamsId,
        beforeHandle: requireManagement
    })
