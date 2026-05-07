'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class Event extends Model {
        static associate(models) { }
    }
    Event.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            start_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            end_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            max_users: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            location_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Locations",
                    key: "id"
                }
            }
        },
        {
            sequelize,
            modelName: 'Event',
        }
    );
    Event.associate = (models) => {
        Event.belongsTo(models.Location, {
            foreignKey: "location_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })
        Event.hasMany(models.Application, {
            foreignKey: "event_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })
        Event.hasMany(models.Shift, {
            foreignKey: "event_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })
    }
    return Event;
};
