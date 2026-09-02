import { t } from "elysia";

export const createEventSchema = t.Object({
    name: t.String({
        minLength: 2,
        maxLength: 100,
        description: "Event name"
    }),
    start_date: t.String({
        pattern: "^\\d{4}-\\d{2}-\\d{2}$",
        description: "Start date"
    }),
    end_date: t.String({
        pattern: "^\\d{4}-\\d{2}-\\d{2}$",
        description: "End date"
    }),
    max_users: t.Integer({
        minimum: 1
    }),
    description: t.String({
        description: "Event Description",
        minLength: 1,
        maxLength: 500
    }),
    status: t.Union([
        t.Literal("draft"),
        t.Literal("active"),
        t.Literal("completed")
    ]),
    created_by: t.Optional(t.Integer({
        minimum: 1
    })),

    location_name: t.String({
        minLength: 2,
        maxLength: 100
    }),
    address_line_1: t.String({
        minLength: 2,
        maxLength: 100
    }),
    address_line_2: t.Optional(t.String({
        maxLength: 100
    })),
    city: t.String({
        minLength: 2,
        maxLength: 100
    }),
    state: t.String({
        minLength: 2,
        maxLength: 100
    }),
    zip_code: t.String({
        pattern: "^\\d{5}(-\\d{4})?$",
        minLength: 5,
        maxLength: 10
    }),
})

export const updateEventSchema = t.Partial(createEventSchema);

export const eventIdParam = t.Object({
    id: t.Numeric({
        minimum: 1
    })
})
