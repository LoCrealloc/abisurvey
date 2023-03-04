import { Model, DataTypes } from "sequelize";
import type {
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
} from "sequelize";
import { db } from "../database";
import type { ProfileField } from "./profilefield";
import type { User } from "./user";

export class Attribute extends Model<
	InferAttributes<Attribute>,
	InferCreationAttributes<Attribute>
> {
	declare id: CreationOptional<number>;
	declare userId: ForeignKey<User["id"]>;
	declare profileFieldId: ForeignKey<ProfileField["id"]>;
	declare answer: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Attribute.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		answer: DataTypes.STRING,
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize: db,
		tableName: "attributes",
	},
);
