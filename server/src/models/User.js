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
            middle_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true,
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
            address: {
                type: DataTypes.STRING,
                allowNull: true
            },
            emergency_contact: {
                type: DataTypes.STRING,
                allowNull: true
            },
            emergency_phone: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [10, 15]
                }
            },
            dob: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            password_hash: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
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
            as: "department",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        });

        User.belongsTo(models.Role, {
            foreignKey: "role_id",
            as: "role",
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
        })

        User.hasMany(models.Application, {
            foreignKey: "reviewed_by_user_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })
    };
    return User;
};
