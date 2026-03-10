# Server with Elysia
Step 1: 
[ npm install elysia sequelize tedious dotenv @elysiajs/cors ]

| Package       | Purpose                                 |
| ------------- | --------------------------------------- |
| **elysia**    | Web framework                           |
| **sequelize** | ORM                                     |
| **tedious**   | SQL Server driver required by Sequelize |
| **dotenv**    | Loads `.env` variables                  |
| **cors**      | Enables CORS                            |

Step 2: Create folder structure inside server
a. Create src
b. Inside src, create: 
    - config
    - controllers
    - models
    - routes
c. Inside config, create database.js
d. Inside server folder create app.js
e. Inside server/src create .env and .gitignore

Step 3. Create DB inside SQL Server

Step 4. Connect DB
a. Set environmental variables in .env
b. src/config/database.js Create DB connection
c. app.js run server "node app.js"