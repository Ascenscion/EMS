import { t } from "elysia";

export const createRoleSchema = t.Object({
    name: t.String({
        minLength: 2,
        maxLength: 20
    })
})

export const updateRoleSchema = t.Partial(createRoleSchema);

export const roleParamId = t.Object({
    id: t.Number()
})