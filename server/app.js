require("dotenv").config()
import { Elysia } from "elysia";
import { userRoutes } from "./src/modules/users/user.routes";
const { Elysia } = require("elysia");
const { cors } = require("@elysiajs/cors");
const { node } = require("@elysiajs/node");
const sequelize = require("./src/config/database")
const db = require("./src/models")
db.sequelize = sequelize;

export const app = new Elysia()
    .use(userRoutes);

const server = new Elysia({
    adapter: node()
})

server.use(cors())

server.get("/", () => {
    return { message: "Elysia server running" }
})

async function startServer() {
    const PORT = process.env.PORT || 3000;
    try {
        await db.sequelize.authenticate();
        console.log("DB connected succesfully");

        server.listen(PORT)

        console.log(`Server running on http://localhost:${process.env.PORT}`);

        await db.sequelize.sync({ force: true });
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