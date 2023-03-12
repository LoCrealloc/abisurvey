import { Model, DataTypes } from "sequelize";
import type { InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { db } from "../database";

export class Setting extends Model<InferAttributes<Setting>, InferCreationAttributes<Setting>> {
	declare id: CreationOptional<number>;
	declare key: string;
	declare value: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Setting.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		key: {
			type: DataTypes.TEXT,
			unique: true,
		},
		value: DataTypes.TEXT,
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize: db,
		tableName: "settings",
	},
);
