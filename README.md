# Server with Elysia
Step 1: 
[ npm install elysia sequelize tedious dotenv @elysiajs/cors ]
[npm install @elysiajs/node]
[npm install @elysiajs/openapi]

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

Step 5: Create models

Step 6: Create Schemas

Step 7: Create Controllers

Step 8: Create Routes

Step 9: Register routes in app.js