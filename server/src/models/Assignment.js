'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class Assignment extends Model {
        static associate(models) { }
    }
    Assignment.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true
            },
            shift_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Shifts",
                    key: "id"
                }
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Users",
                    key: "id"
                }
            }
        },
        {
            sequelize,
            modelName: 'Assignment',
            createdAt: "assigned_at",
            updatedAt: "updated_at",

        }
    );

    Assignment.associate = (models) => {
        Assignment.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })

        Assignment.belongsTo(models.Shift, {
            foreignKey: "shift_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })

        Assignment.hasMany(models.CheckIn, {
            foreignKey: "assignment_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })
    }
    return Assignment;
};
