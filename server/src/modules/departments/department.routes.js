import * as controller from "./department.controller.js"
import {
    createDepartmentSchema,
    updateDeparmentSchema,
    departmentParamId
} from "./department.schema.js";
import { Elysia } from "elysia";
import { MANAGEMENT_ROLES, requireRoles } from "../auth/auth.middleware.js";

const requireManagement = requireRoles(MANAGEMENT_ROLES);

export const departmentRoutes = new Elysia({
    prefix: "/departments"
})
    .get("/", controller.getAllDepartments, {
        beforeHandle: requireManagement
    })
    .get("/:id", controller.getDepartment, {
        params: departmentParamId,
        beforeHandle: requireManagement
    })
    .post("/", controller.createDepartment, {
        body: createDepartmentSchema,
        beforeHandle: requireManagement
    })
    .patch("/:id", controller.updateDepartment, {
        params: departmentParamId,
        body: updateDeparmentSchema,
        beforeHandle: requireManagement
    })
    .delete("/:id", controller.deleteDepartment, {
        params: departmentParamId,
        beforeHandle: requireManagement
    })
