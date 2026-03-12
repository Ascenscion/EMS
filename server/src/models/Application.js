'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class Application extends Model {
        static associate(models) { }
    }
    Application.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "pending"
            },
            applied_at: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            reviewed_by_user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id"
                }
            },
            reviewed_at: {
                type: DataTypes.STRING,
                allowNull: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Users",
                    key: "id"
                }
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
            modelName: 'Application',
        }
    );

    Application.associate = (models) => {
        Application.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })

        Application.belongsTo(models.Event, {
            foreignKey: "event_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })

        Application.belongsTo(models.User, {
            foreignKey: "reviewed_by_user_id",
            as: "reviewer"
        })
    }
    return Application;
};
