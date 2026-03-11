'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) { }
    }
    Role.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Role',
        }
    );
    Role.associate = (models) => {
        Role.hasMany(models.User, {
            foreignKey: "id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        });
    };
    return Role;
};
