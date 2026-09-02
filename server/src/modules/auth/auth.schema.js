// src/modules/auth/auth.schema.js
import { t } from "elysia"

export const loginSchema = t.Object({
    email: t.String({
        format: "email",
        minLength: 3,
        maxLength: 255
    }),
    password: t.String({
        minLength: 1,
        maxLength: 255
    })
})
