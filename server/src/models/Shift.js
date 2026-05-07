'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class Shift extends Model {
        static associate(models) { }
    }
    Shift.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            start_time: {
                type: DataTypes.DATE,
                allowNull: false
            },
            end_time: {
                type: DataTypes.DATE,
                allowNull: false
            },
            required_staff: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            event_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Events",
                    key: "id"
                }
            }
        },
        {
            sequelize,
            modelName: 'Shift',
        }
    );
    Shift.associate = (models) => {
        Shift.hasMany(models.Assignment, {
            foreignKey: "shift_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })

        Shift.belongsTo(models.Event, {
            foreignKey: "event_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })

        Shift.hasMany(models.Application, {
            foreignKey: "shift_id",
            as: "applications",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })
    }
    return Shift;
};
