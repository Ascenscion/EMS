import * as controller from "./assignment.controller.js";
import {
    createAssignmentSchema,
    updateAssignmentSchema,
    assignmentIdParam
} from "./assignment.schema.js";
import { Elysia } from "elysia";
import { MANAGEMENT_ROLES, requireRoles } from "../auth/auth.middleware.js";

const requireManagement = requireRoles(MANAGEMENT_ROLES);

export const assignmentRoutes = new Elysia({
    prefix: "/assignments"
})
    .get("/", controller.getAllAssignments, {
        beforeHandle: requireManagement
    })
    .get("/:id", controller.getAssignment, {
        params: assignmentIdParam,
        beforeHandle: requireManagement
    })
    .post("/", controller.createAssignment, {
        body: createAssignmentSchema,
        beforeHandle: requireManagement
    })
    .patch("/:id", controller.updateAssignment, {
        params: assignmentIdParam,
        body: updateAssignmentSchema,
        beforeHandle: requireManagement
    })
    .delete("/:id", controller.deleteAssignment, {
        params: assignmentIdParam,
        beforeHandle: requireManagement
    })
