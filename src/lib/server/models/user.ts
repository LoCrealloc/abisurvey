import { Model, DataTypes } from "sequelize";
import type { InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { db } from "../database";

import { Answer } from "./answer";
import { Code } from "./code";
import { PairAnswer } from "./pairanswer";

/*
export const User = db.define("User", {
	id: ID,
	name: {
		type: DataTypes.STRING,
		unique: true,
	},
});
 */

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: DataTypes.STRING,
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize: db,
		tableName: "users",
	},
);

User.hasMany(Answer, { sourceKey: "id", foreignKey: "userId", as: "AnswerUser" });

User.hasMany(PairAnswer, { sourceKey: "id", foreignKey: "userId", as: "PairAnswerUser" });

User.hasOne(Code, {
	sourceKey: "id",
	foreignKey: "userId",
	as: "CodeUser",
}); // Reserved for potential future use
