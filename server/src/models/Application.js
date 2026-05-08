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
                type: DataTypes.ENUM(
                    "pending",
                    "approved",
                    "rejected"
                ),
                allowNull: false,
                defaultValue: "pending"
            },
            applied_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            reviewed_by_user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Users",
                    key: "id"
                }
            },
            reviewed_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id"
                }
            },
            shift_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Shifts",
                    key: "id"
                }
            },
            event_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Events",
                    key: "id"
                }
            }
        },
        {
            sequelize,
            modelName: 'Application',
            indexes: [
                {
                    unique: true,
                    fields: ["user_id", "shift_id"]
                }
            ]
        }
    );

    Application.associate = (models) => {
        Application.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "applicant",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })

        Application.belongsTo(models.User, {
            foreignKey: "reviewed_by_user_id",
            as: "reviewer",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })

        Application.belongsTo(models.Shift, {
            foreignKey: "shift_id",
            as: "shift",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })

        Application.belongsTo(models.Event, {
            foreignKey: "event_id",
            as: "event",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })
    }
    return Application;
};
