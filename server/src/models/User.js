'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
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
                allowNull: true,
                references: {
                    model: "Departments",
                    key: "id"
                }
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
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
            foreignKey: "department_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        });

        User.belongsTo(models.Role, {
            foreignKey: "role_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })

        User.hasMany(models.Application, {
            foreignKey: "user_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })

        User.hasMany(models.Assignment, {
            foreignKey: "user_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        });
    };
    return User;
};
