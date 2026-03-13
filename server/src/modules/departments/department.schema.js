import { t } from "elysia";

export const createDepartmentSchema = t.Object({
    name: t.String({
        minLength: 2,
        maxLength: 20
    })
})

export const updateDeparmentSchema = t.Partial(createDepartmentSchema);

export const departmentParamId = t.Object({
    id: t.Number()
})