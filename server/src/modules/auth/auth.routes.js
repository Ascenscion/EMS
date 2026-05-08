// src/modules/auth/auth.routes.js
import { Elysia } from "elysia"
import { login } from "./auth.controller.js"
import { loginSchema } from "./auth.schema.js"

export const authRoutes = new Elysia({
    prefix: "/auth"
})
    .post("/login", login, {
        body: loginSchema
    })