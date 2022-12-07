import { Model, DataTypes } from "sequelize";
import type {
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
} from "sequelize";
import { db } from "../database";
import type { User } from "./user";

export class Code extends Model<InferAttributes<Code>, InferCreationAttributes<Code>> {
	declare id: CreationOptional<number>;
	declare code: string;
	declare userId: ForeignKey<User["id"]> | null;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Code.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		code: DataTypes.STRING,
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize: db,
		tableName: "codes",
	},
);
