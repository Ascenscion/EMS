'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class Department extends Model {

    }
    Department.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'Department',
            timestamps: false
        }
    );

    Department.associate = (models) => {
        Department.hasMany(models.User, {
            foreignKey: "id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        });
    };
    return Department;
};
