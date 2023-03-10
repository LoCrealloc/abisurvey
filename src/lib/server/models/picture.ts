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
	declare image: Buffer;
	declare mimetype: string;
	declare size: number;
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
		image: DataTypes.BLOB("long"),
		mimetype: { type: DataTypes.TEXT, allowNull: false },
		size: { type: DataTypes.INTEGER, allowNull: false },
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize: db,
		tableName: "pictures",
	},
);
