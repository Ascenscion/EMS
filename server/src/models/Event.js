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
            foreignKey: "id"
        })
        Event.hasMany(models.Application, {
            foreignKey: "id"
        })
        Event.hasMany(models.Shift, {
            foreignKey: "id"
        })
    }
    return Event;
};
