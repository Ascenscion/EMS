import { t } from "elysia";

export const createApplicationSchema = t.Object({

    status: t.Union([
        t.Literal("pending"),
        t.Literal("approved"),
        t.Literal("rejected")
    ]),
    user_id: t.Integer({
        minimum: 1
    }),
    shift_id: t.Integer({
        minimum: 1
    })
})

export const updateApplicationSchema = t.Partial(createApplicationSchema);

export const applicationIdParam = t.Object({
    id: t.Number()
})

export const reviewApplicationSchema = t.Object({
    status: t.Union([
        t.Literal("approved"),
        t.Literal("rejected")
    ])
})