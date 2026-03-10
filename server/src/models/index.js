'use strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

// Dynamically import all model files
const files = fs.readdirSync(__dirname).filter(
    file => file !== 'index.js' && file.endsWith('.js')
);

for (const file of files) {
    const filePath = path.join(__dirname, file);
    const fileUrl = pathToFileURL(filePath).href; // <-- Windows-safe file:// URL
    const { default: modelDefiner } = await import(fileUrl);
    const model = modelDefiner(sequelize, DataTypes);
    db[model.name] = model;
}

// Run associations
for (const modelName of Object.keys(db)) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

// 'use strict';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { Sequelize, DataTypes } from "sequelize";
// import sequelize from '../config/database.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename)
// const db = {};

// fs.readdirSync(__dirname) //Reads every file inside /models
//     .filter(file => {
//         return file !== 'index.js' && file.endsWith('.js');
//     })
//     .forEach(file => {
//         const model = require(path.join(__dirname, file))(sequelize, DataTypes);
//         db[model.name] = model;
//     });

// // Run associations
// Object.keys(db).forEach(modelName => {
//     if (db[modelName].associate) {
//         db[modelName].associate(db);
//     }
// });

// db.sequelize = sequelize;

// export default db;