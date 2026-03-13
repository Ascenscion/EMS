import * as controller from "./department.controller.js"
import {
    createDepartmentSchema,
    updateDeparmentSchema,
    departmentParamId
} from "./department.schema.js";
import { Elysia } from "elysia";

export const departmentRoutes = new Elysia({
    prefix: "/departments"
})
    .get("/", controller.getAllDepartments)
    .get("/:id", controller.getDepartment, {
        params: departmentParamId
    })
    .post("/", controller.createDepartment, {
        body: createDepartmentSchema
    })
    .patch("/:id", controller.updateDepartment, {
        params: departmentParamId,
        body: updateDeparmentSchema
    })
    .delete("/:id", controller.deleteDepartment, {
        params: departmentParamId
    })