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
                allowNull: false
            },
            applied_at: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            reviewed_by: {
                type: DataTypes.STRING,
                allowNull: false
            },
            reviewed_at: {
                type: DataTypes.STRING,
                allowNull: false
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
            foreignKey: "id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })

        Application.belongsTo(models.Event, {
            foreignKey: "id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })
    }
    return Application;
};
