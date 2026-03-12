import { t } from "elysia";

export const createAssignmentSchema = t.Object({
    status: t.Union([
        t.Literal("inprocess"),
        t.Literal("completed")
    ]),
})

export const updateAssignmentSchema = t.Partial(createAssignmentSchema);

export const assignmentIdParam = t.Object({
    id: t.Number()
})