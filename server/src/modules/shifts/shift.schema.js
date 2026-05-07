import { t } from "elysia"

export const createShiftSchema = t.Object({
    name: t.String({
        minLength: 2,
        maxLength: 30
    }),
    start_time: t.String({
        format: "date-time",
        description: "Shift start time"
    }),
    end_time: t.String({
        format: "date-time",
        description: "Start date"
    }),
    required_staff: t.Integer({
        minimum: 1
    })
})

export const updateShiftSchema = t.Partial(createShiftSchema);

export const shiftParamsId = t.Object({
    id: t.Number()
})