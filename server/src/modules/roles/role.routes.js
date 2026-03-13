import * as controller from "./role.controller.js"
import {
    createRoleSchema,
    updateRoleSchema,
    roleParamId
} from "./role.schema.js";
import { Elysia } from "elysia";

export const roleRoutes = new Elysia({
    prefix: "/roles"
})
    .get("/", controller.getAllRoles)
    .get("/:id", controller.getRole, {
        params: roleParamId
    })
    .post("/", controller.createRole, {
        body: createRoleSchema
    })
    .patch("/:id", controller.updateRole, {
        params: roleParamId,
        body: updateRoleSchema
    })
    .delete("/:id", controller.deleteRole, {
        params: roleParamId
    })