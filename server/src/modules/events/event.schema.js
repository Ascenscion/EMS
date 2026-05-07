import { t } from "elysia";

export const createEventSchema = t.Object({
    name: t.String({
        minLength: 2,
        maxLength: 100,
        description: "Event name"
    }),
    start_date: t.String({
        format: "date-time",
        description: "Start date"
    }),
    end_date: t.String({
        format: "date-time",
        description: "End date"
    }),
    max_users: t.Integer({
        minimum: 1
    }),
    description: t.String({
        description: "Event Description",
        maxLength: 500
    }),
    status: t.String(),
    created_by: t.Integer({
        minimum: 1
    }),
    location_id: t.Integer({
        minimum: 1
    }),

})

export const updateEventSchema = t.Partial(createEventSchema);

export const eventIdParam = t.Object({
    id: t.Number()
})