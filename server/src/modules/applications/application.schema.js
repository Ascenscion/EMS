import { t } from "elysia";

export const createApplicationSchema = t.Object({
    status: t.Union([
        t.Literal("pending"),
        t.Literal("approved"),
        t.Literal("rejected")
    ]),
    applied_at: t.String({
        date: t.RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/),
        description: "Applied at date/time"
    }),
    reviewed_by_user_id: t.Integer({
        minimum: 1
    }),
    reviewed_at: t.String({
        date: t.RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/),
        description: "Reviewed at date/time"
    }),
    user_id: t.Integer({
        minimum: 1
    }),
    event_id: t.Integer({
        minimum: 1
    })
})

export const updateApplicationSchema = t.Partial(createApplicationSchema);

export const applicationIdParam = t.Object({
    id: t.Number()
})