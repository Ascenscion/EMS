'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
    }
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [10, 15]
                }
            },
            password_hash: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },

            department_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Departments",
                    key: "id"
                }
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Roles",
                    key: "id"
                }
            }
        },
        {
            sequelize,
            modelName: 'User',
        }
    );
    User.associate = (models) => {
        User.belongsTo(models.Department, {
            foreignKey: "department_id"
        });

        User.belongsTo(models.Role, {
            foreignKey: "role_id"
        })

        User.hasMany(models.Application, {
            foreignKey: "user_id"
        })

        User.hasMany(models.Assignment, {
            foreignKey: "user_id"
        });
    };
    return User;
};
