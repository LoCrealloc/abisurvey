import { Model, DataTypes } from "sequelize";
import type {
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
} from "sequelize";
import { db } from "../database";
import type { User } from "./user";

export class Picture extends Model<InferAttributes<Picture>, InferCreationAttributes<Picture>> {
	declare id: CreationOptional<number>;
	declare userId: ForeignKey<User["id"]>;
	declare image: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Picture.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		image: DataTypes.TEXT,
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize: db,
		tableName: "pictures",
	},
);
