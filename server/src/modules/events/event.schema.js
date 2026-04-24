import { t } from "elysia";

export const createEventSchema = t.Object({
    name: t.String({
        minLength: 2,
        maxLength: 100,
        description: "Event name"
    }),
    start_date: t.String({
        date: t.RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/),
        description: "Start date"
    }),
    end_date: t.String({
        date: t.RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/),
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

    location_name: t.String({
        minLength: 2,
        maxLength: 100
    }),
    address_line_1: t.String({
        minLength: 2,
        maxLength: 100
    }),
    address_line_2: t.Optional(t.String()),
    city: t.String({
        minLength: 2,
        maxLength: 100
    }),
    state: t.String({
        minLength: 2,
        maxLength: 100
    }),
    zip_code: t.String({
        minLength: 5,
        maxLength: 10
    }),
})

export const updateEventSchema = t.Partial(createEventSchema);

export const eventIdParam = t.Object({
    id: t.Number()
})