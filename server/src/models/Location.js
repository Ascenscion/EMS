'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class Location extends Model {
        static associate(models) { }
    }
    Location.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            street: {
                type: DataTypes.STRING,
                allowNull: false
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false
            },
            zip_code: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Location',
        }
    );
    Location.associate = (models) => {
        Location.hasMany(models.Event, {
            foreignKey: "location_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })
    }
    return Location;
};
