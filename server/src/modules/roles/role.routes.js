import * as controller from "./role.controller.js"
import {
    createRoleSchema,
    updateRoleSchema,
    roleParamId
} from "./role.schema.js";
import { Elysia } from "elysia";
import { MANAGEMENT_ROLES, requireRoles } from "../auth/auth.middleware.js";

const requireManagement = requireRoles(MANAGEMENT_ROLES);

export const roleRoutes = new Elysia({
    prefix: "/roles"
})
    .get("/", controller.getAllRoles, {
        beforeHandle: requireManagement
    })
    .get("/:id", controller.getRole, {
        params: roleParamId,
        beforeHandle: requireManagement
    })
    .post("/", controller.createRole, {
        body: createRoleSchema,
        beforeHandle: requireManagement
    })
    .patch("/:id", controller.updateRole, {
        params: roleParamId,
        body: updateRoleSchema,
        beforeHandle: requireManagement
    })
    .delete("/:id", controller.deleteRole, {
        params: roleParamId,
        beforeHandle: requireManagement
    })
