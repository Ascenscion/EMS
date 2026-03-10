'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class Shift extends Model {
        static associate(models) { }
    }
    Shift.init(
        {
            shift_id: {
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
                type: DataTypes.STRING,
                allowNull: false
            },
            end_time: {
                type: DataTypes.STRING,
                allowNull: false
            },
            required_staff: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            event_id: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'Shift',
        }
    );
    Shift.associate = (models) => {
        Shift.hasMany(models.Assignment, {
            foreignKey: "shift_id"
        })

        Shift.belongsTo(models.Event, {
            foreignKey: "event_id"
        })
    }
    return Shift;
};
