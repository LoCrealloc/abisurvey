import { Model, DataTypes } from "sequelize";
import type {
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
} from "sequelize";
import { db } from "../database";
import type { AnswerPossibility } from "./answerpossibility";
import type { Quote } from "./quote";

export class QuotePart extends Model<
	InferAttributes<QuotePart>,
	InferCreationAttributes<QuotePart>
> {
	declare id: CreationOptional<number>;
	declare content: string;
	declare answerPossibilityId: ForeignKey<AnswerPossibility["id"]>;
	declare quoteId: ForeignKey<Quote["id"]>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

QuotePart.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		content: DataTypes.TEXT,
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize: db,
		tableName: "quoteparts",
	},
);
