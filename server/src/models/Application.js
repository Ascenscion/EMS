'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Application extends Model {
        static associate(models) { }
    }
    Application.init(
        {
            application_id: {
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
            user_id: DataTypes.INTEGER,
            event_id: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'Application',
        }
    );

    Application.associate = (models) => {
        Application.belongsTo(models.User, {
            foreignKey: "user_id"
        })

        Application.belongsTo(models.Event, {
            foreignKey: "event_id"
        })
    }
    return Application;
};
