import dotenv from "dotenv";
dotenv.config();
import { userRoutes } from "./src/modules/users/user.routes.js";
import { eventRoutes } from "./src/modules/events/event.routes.js";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { node } from "@elysiajs/node";
import { openapi } from "@elysiajs/openapi";
import sequelize from "./src/config/database.js"
import db from "./src/models/index.js"
import { seedDatabase } from "./src/config/seed.js";
import { applicationRoutes } from "./src/modules/applications/application.routes.js";
import { assignmentRoutes } from "./src/modules/assignments/assignment.routes.js";
import { locationRoutes } from "./src/modules/locations/location.routes.js";
import { shiftRoutes } from "./src/modules/shifts/shift.routes.js";
import { roleRoutes } from "./src/modules/roles/role.routes.js";
import { checkInRoutes } from "./src/modules/checkIn/checkIn.routes.js";
import { departmentRoutes } from "./src/modules/departments/department.routes.js";
import { authRoutes } from "./src/modules/auth/auth.routes.js";

db.sequelize = sequelize;

export const app = new Elysia({
    adapter: node()
})
    .use(cors({
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
    }))
    .use(userRoutes)
    .use(eventRoutes)
    .use(applicationRoutes)
    .use(assignmentRoutes)
    .use(locationRoutes)
    .use(shiftRoutes)
    .use(roleRoutes)
    .use(checkInRoutes)
    .use(departmentRoutes)
    .use(authRoutes)
    .use(openapi())
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
        // await db.sequelize.sync({ force: true });
        await seedDatabase(db);
        console.log("tables created");

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
