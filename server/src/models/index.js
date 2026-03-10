'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

fs.readdirSync(__dirname) //Reads every file inside /models
    .filter(file => {
        return file !== 'index.js' && file.endsWith('.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, DataTypes);
        db[model.name] = model;
    });

// Run associations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;

module.exports = db;