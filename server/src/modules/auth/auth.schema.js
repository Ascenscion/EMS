// src/modules/auth/auth.schema.js
import { t } from "elysia"

export const loginSchema = t.Object({
    email: t.String(),
    password: t.String()
})