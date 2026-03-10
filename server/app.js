import dotenv from "dotenv";
dotenv.config();
import { userRoutes } from "./src/modules/users/user.routes.js";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { node } from "@elysiajs/node";
import { openapi } from "@elysiajs/openapi";
import sequelize from "./src/config/database.js"
import db from "./src/models/index.js"
import { seedDatabase } from "./src/config/seed.js";

db.sequelize = sequelize;

export const app = new Elysia({
    adapter: node()
})
    .use(userRoutes)

    .use(cors())
    .use(openapi())
    .use(userRoutes)
    .get("/", () => {
        return { message: "Elysia server running" }
    })

async function startServer() {
    const PORT = process.env.PORT || 3000;
    try {
        await db.sequelize.authenticate();
        console.log("DB connected succesfully");

        app.listen(PORT)

        console.log(`Server running on http://localhost:${process.env.PORT}`);

        await db.sequelize.sync();
        //await db.sequelize.sync({ force: true });
        await seedDatabase(db);
        console.log("tables created");

        // const user = await db.User.create({
        //     first_name: "charles",
        //     last_name: "ortiz",
        //     email: "charles@gmail.com",
        //     phone: "12345678910",
        //     password_hash: "asdf2343dfsdfs234",

        // })

    } catch (error) {
        console.error("Database connection failed:");

        if (error.parent && error.parent.errors) {
            error.parent.errors.forEach(e => console.error(e.message));
        } else {
            console.error(error);
        }
    }
}

startServer();