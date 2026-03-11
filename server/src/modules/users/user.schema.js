import { t } from "elysia";

export const createUserSchema = t.Object({
    first_name: t.String({
        pattern: "^[A-Za-z]+$",
        minLength: 2,
        maxLength: 50
    }),
    last_name: t.String({
        pattern: "^[A-Za-z]+$",
        minLength: 2,
        maxLength: 50
    }),
    email: t.String({
        format: "email"
    }),
    phone: t.String({
        pattern: "^[0-9]+$",
        minLength: 10,
        maxLength: 15
    }),
    password: t.String({
        pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{8,}$",
        minLength: 8,
        maxLength: 20
    }),
    department_id: t.Integer(),
    role_id: t.Integer(),
});

export const updateUserSchema = t.Partial(createUserSchema);

export const userIdParam = t.Object({
    id: t.Number()
})

/* Pendiente */

// export const loginSchema = t.Object({
//     email: t.String({
//         format: "email"
//     }),
//     password: t.String({
//         pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{8,}$",
//         minLength: 8,
//         maxLength: 20
//     })
// })

// export const changePasswordSchema = t.Object({
//     password: t.String({
//         pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{8,}$",
//         minLength: 8,
//         maxLength: 20
//     })
// })