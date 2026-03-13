import * as controller from "./assignment.controller.js";
import {
    createAssignmentSchema,
    updateAssignmentSchema,
    assignmentIdParam
} from "./assignment.schema.js";
import { Elysia } from "elysia";

export const assignmentRoutes = new Elysia({
    prefix: "/assignments"
})
    .get("/", controller.getAllAssignments)
    .get("/:id", controller.getAssignment, {
        params: assignmentIdParam
    })
    .post("/", controller.createAssignment, {
        body: createAssignmentSchema
    })
    .patch("/:id", controller.updateAssignment, {
        params: assignmentIdParam,
        body: updateAssignmentSchema
    })
    .delete(":id", controller.deleteAssignment, {
        params: assignmentIdParam
    })