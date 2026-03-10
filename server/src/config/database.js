const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mssql",
        port: parseInt(process.env.DB_PORT, 10),
        dialectOptions: {
            options: {
                instanceName: "SQLEXPRESS",   // instance goes here

            }
        },
        logging: console.log // optional, helps debug
    }
);

module.exports = sequelize;