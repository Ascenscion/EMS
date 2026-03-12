'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class CheckIn extends Model {
        static associate(models) { }
    }
    CheckIn.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            check_in_time: {
                type: DataTypes.STRING,
                allowNull: false
            },
            check_out_time: {
                type: DataTypes.STRING,
                allowNull: false
            },
            verified_by: {
                type: DataTypes.STRING,
                allowNull: false
            },
            assignment_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Assignments",
                    key: "id"
                }
            }
        },
        {
            sequelize,
            modelName: 'CheckIn',
        }
    );

    CheckIn.associate = (models) => {
        CheckIn.belongsTo(models.Assignment, {
            foreignKey: "assignment_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        })
    }
    return CheckIn;
};
