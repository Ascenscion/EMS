import { t } from "elysia";

export const createUserSchema = t.Object({
    first_name: t.String({
        pattern: "^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s'-]*$",
        minLength: 2,
        maxLength: 50
    }),
    middle_name: t.Optional(
        t.String({
            pattern: "^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s'-]*$",
            default: "",
        }),
    ),
    last_name: t.String({
        pattern: "^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s'-]*$",
        minLength: 2,
        maxLength: 50
    }),
    dob: t.String({
        minLength: 10,
        maxLength: 10,
        pattern: "^\\d{4}-\\d{2}-\\d{2}$",
    }),
    email: t.String({
        format: "email"
    }),
    phone: t.String({
        //pattern: "^[0-9]+$",
        pattern: "^[0-9()+\\-\\s]{10,20}$",
        minLength: 10,
        maxLength: 15
    }),
    address: t.String({
        minLength: 1,
        maxLength: 255
    }),
    emergency_contact: t.Optional(
        t.String({
            pattern: "^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s'-]*$",
            minLength: 2,
            maxLength: 255
        }),
    ),
    emergency_phone: t.Optional(
        t.String({
            //pattern: "^[0-9]+$",
            pattern: "^[0-9()+\\-\\s]{10,20}$",
            minLength: 10,
            maxLength: 15
        }),
    ),
    department_id: t.Integer({
        minimum: 1,
    }),
    role_id: t.Integer({
        minimum: 1,
    }),
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