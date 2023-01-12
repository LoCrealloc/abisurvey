import type { PageServerLoad } from "./$types";
import { Answer } from "$lib/server/models/answer";
import { db } from "$lib/server/database";
import { AnswerPossibility } from "../../../lib/server/models/answerpossibility";
import { Question } from "../../../lib/server/models/question";

export const load: PageServerLoad = async () => {
	return {
		answers: (
			await Answer.findAll({
				attributes: [
					"questionId",
					"answerPossibilityId",
					[db.fn("count", "answerPossibilityIdA"), "count"],
				],
				group: ["questionId", "answerPossibilityId"],
			})
		).map((row) => {
			return row.dataValues;
		}),
	};
};

// SELECT "questionId", "answerPossibilityId", COUNT("answerPossibilityId") FROM "answers" GROUP BY "questionId", "answerPossibilityId";
