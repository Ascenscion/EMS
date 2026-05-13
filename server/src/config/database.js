import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const dialect = process.env.DB_DIALECT;

const config = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect,
  logging: false,
};

if (dialect === "mssql") {
  config.dialectOptions = {
    options: {
      instanceName: process.env.DB_INSTANCE,
      trustServerCertificate: true,
    },
  };
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || null,
  config
);

export default sequelize;

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         host: process.env.DB_HOST,
//         dialect: process.env.DB_DIALECT, //mssql
//         port: parseInt(process.env.DB_PORT, 10),
//         dialectOptions: {
//             options: {
//                 instanceName: "SQLEXPRESS",   // instance goes here

//             }
//         },
//         logging: console.log // optional, helps debug
//     }
// );

// export default sequelize;