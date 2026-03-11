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
