'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class Assignment extends Model {
        static associate(models) { }
    }
    Assignment.init(
        {
            assignment_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            assigned_by: {
                type: DataTypes.STRING,
                allowNull: false
            },
            assigned_at: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            },
            shift_id: DataTypes.INTEGER,
            user_id: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'Assignment',
        }
    );

    Assignment.associate = (models) => {
        Assignment.belongsTo(models.User, {
            foreignKey: "user_id"
        })

        Assignment.belongsTo(models.Shift, {
            foreignKey: "shift_id"
        })

        Assignment.hasOne(models.CheckIn, {
            foreignKey: "assignment_id"
        })
    }
    return Assignment;
};
