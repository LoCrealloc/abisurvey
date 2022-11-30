import { Model, DataTypes } from "sequelize";
import type { InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { db } from "../database";
import { Answer } from "./answer";

/*
export const Question = db.define("Question", {
	id: ID,
	question: DataTypes.STRING,
	teacherQuestion: DataTypes.BOOLEAN,
});
*/

export class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
	declare id: CreationOptional<number>;
	declare question: string;
	declare teacherQuestion: boolean;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Question.init(
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
		tableName: "questions",
	},
);

Question.hasMany(Answer, { sourceKey: "id", foreignKey: "questionId", as: "AnswerQuestion" });
