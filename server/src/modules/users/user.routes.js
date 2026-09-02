import { Elysia } from "elysia";
import * as controller from "./user.controller.js";
import {
    createUserSchema,
    updateUserSchema,
    userIdParam
} from "./user.schema.js";
import {
    MANAGEMENT_ROLES,
    requireRoles,
    requireSelfOrRoles
} from "../auth/auth.middleware.js";

export const userRoutes = new Elysia({
    prefix: "/users"
})

    .get("/", controller.getAllUsers, {
        beforeHandle: requireRoles(MANAGEMENT_ROLES)
    })

    .get("/:id", controller.getUser, {
        params: userIdParam,
        beforeHandle: requireSelfOrRoles(({ params }) => params.id, MANAGEMENT_ROLES)
    })

    .post("/", controller.createUser, {
        body: createUserSchema,
        beforeHandle: requireRoles(MANAGEMENT_ROLES)
    })

    .patch("/:id", controller.updateUser, {
        params: userIdParam,
        body: updateUserSchema,
        beforeHandle: requireRoles(MANAGEMENT_ROLES)
    })

    .delete("/:id", controller.deleteUser, {
        params: userIdParam,
        beforeHandle: requireRoles(MANAGEMENT_ROLES)
    })
