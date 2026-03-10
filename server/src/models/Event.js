'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
        static associate(models) { }
    }
    Event.init(
        {
            event_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            start_date: {
                type: DataTypes.STRING,
                allowNull: false
            },
            end_date: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            },
            created_by: {
                type: DataTypes.STRING,
                allowNull: false
            },
            location_id: DataTypes.INTEGER

        },
        {
            sequelize,
            modelName: 'Event',
        }
    );
    Event.associate = (models) => {
        Event.belongsTo(models.Location, {
            foreignKey: "location_id"
        })
        Event.hasMany(models.Application, {
            foreignKey: "event_id"
        })
        Event.hasMany(models.Shift, {
            foreignKey: "event_id"
        })
    }
    return Event;
};
