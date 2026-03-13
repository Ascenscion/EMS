import { t } from "elysia"

export const createCheckInSchema = t.Object({
    check_in_time: t.String({
        pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
    }),
    check_out_time: t.String({
        pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
    }),
    verified_by: t.String({
        minLength: 1
    })
})

export const updateCheckInSchema = t.Partial(createCheckInSchema);

export const checkInParamId = t.Object({
    id: t.Number()
})