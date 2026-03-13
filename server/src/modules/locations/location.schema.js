import { t } from "elysia";

export const createLocationSchema = t.Object({
    name: t.String({
        minLength: 2,
        maxLength: 100,
    }),
    street: t.String({
        minLength: 2,
        maxLength: 100
    }),
    city: t.String({
        minLength: 2,
        maxLength: 100
    }),
    state: t.String({
        minLength: 2,
        maxLength: 100
    }),
    zip_code: t.Integer({
        minLength: 5,
        maxLength: 5
    })
})

export const updateLocationSchema = t.Partial(createLocationSchema);

export const locationParamId = t.Object({
    id: t.Number()
})