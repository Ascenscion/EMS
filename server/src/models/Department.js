'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class Department extends Model {
        static associate(models) { }
    }
    Department.init(
        {
            department_id: {
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
        }
    );

    Department.associate = (models) => {
        Department.hasMany(models.User, {
            foreignKey: "department_id"
        });
    };
    return Department;
};
