import { Elysia } from "elysia";
import * as controller from "./user.controller";
import {
    createUserSchema,
    updateUserSchema,
    userIdParam
} from "./user.schema";

export const userRoutes = new Elysia({
    prefix: "/users"
})

    .get("/", controller.getAllUsers)

    .get("/:id", controller.getUser, {
        params: userIdParam
    })

    .post("/", controller.createUser, {
        body: createUserSchema
    })

    .update("/:id", controller.updateUser, {
        params: userIdParam,
        body: updateUserSchema
    })

    .delete("/:id", controller.deleteUser, {
        params: userIdParam
    })