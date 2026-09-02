import * as controller from "./checkIn.controller.js";
import {
    createCheckInSchema,
    updateCheckInSchema,
    checkInParamId
} from "./checkIn.schema.js";
import { Elysia } from "elysia";
import { MANAGEMENT_ROLES, requireRoles } from "../auth/auth.middleware.js";

const requireManagement = requireRoles(MANAGEMENT_ROLES);

export const checkInRoutes = new Elysia({
    prefix: "/checkins"
})

    .get("/", controller.getAllCheckIns, {
        beforeHandle: requireManagement
    })
    .get("/:id", controller.getCheckIn, {
        params: checkInParamId,
        beforeHandle: requireManagement
    })
    .post("/", controller.createCheckIn, {
        body: createCheckInSchema,
        beforeHandle: requireManagement
    })
    .patch("/:id", controller.updateCheckIn, {
        params: checkInParamId,
        body: updateCheckInSchema,
        beforeHandle: requireManagement
    })
    .delete("/:id", controller.deleteCheckIn, {
        params: checkInParamId,
        beforeHandle: requireManagement
    })
