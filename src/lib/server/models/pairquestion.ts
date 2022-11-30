import { Model, DataTypes } from "sequelize";
import type { InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { db } from "../database";

import { PairAnswer } from "./pairanswer";

/*
export const PairQuestion = db.define("PairQuestion", {
	id: ID,
	question: DataTypes.STRING,
	teacherQuestion: DataTypes.BOOLEAN,
});
 */

export class PairQuestion extends Model<
	InferAttributes<PairQuestion>,
	InferCreationAttributes<PairQuestion>
> {
	declare id: CreationOptional<number>;
	declare question: string;
	declare teacherQuestion: boolean;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

PairQuestion.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		question: DataTypes.STRING,
		teacherQuestion: DataTypes.BOOLEAN,
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize: db,
		tableName: "pairquestions",
	},
);

PairQuestion.hasMany(PairAnswer, {
	sourceKey: "id",
	foreignKey: "pairquestionId",
	as: "PairAnswerPairQuestion",
});
