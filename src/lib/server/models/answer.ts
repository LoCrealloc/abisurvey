import { Model, DataTypes } from "sequelize";
import type {
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
} from "sequelize";
import { db } from "../database";
import type { Question } from "./question";
import type { AnswerPossibility } from "./answerpossibility";

/*
export const Answer = db.define("Answer", {
	id: ID,
});
 */

export class Answer extends Model<InferAttributes<Answer>, InferCreationAttributes<Answer>> {
	declare id: CreationOptional<number>;
	declare userId: ForeignKey<number>;
	declare questionId: ForeignKey<Question["id"]>;
	declare answerpossibilityId: ForeignKey<AnswerPossibility["id"]>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Answer.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize: db,
		tableName: "answers",
	},
);
