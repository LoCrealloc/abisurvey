import type { PageServerLoad } from "./$types";
import { Answer } from "$lib/server/models/answer";
import { db } from "$lib/server/database";
import { AnswerPossibility } from "$lib/server/models/answerpossibility";
import { Question } from "$lib/server/models/question";
import { PairAnswer } from "$lib/server/models/pairanswer";

export const load: PageServerLoad = async () => {
	return {
		answers: (
			await Answer.findAll({
				attributes: [
					"questionId",
					"answerPossibilityId",
					[db.fn("count", "answerPossibilityId"), "count"],
				],
				group: ["questionId", "answerPossibilityId"],
			})
		).map((row) => {
			return row.dataValues;
		}),
		pairanswers: (
			await PairAnswer.findAll({
				attributes: [
					"questionId",
					"answerOneId",
					"answerTwoId",
					[db.fn("count", "answerOneId"), "count"],
				],
				group: ["questionId", "answerOneId", "answerTwoId"],
			})
		).map((row) => {
			return row.dataValues;
		}),
	};
};

// SELECT "questionId", "answerPossibilityId", COUNT("answerPossibilityId") FROM "answers" GROUP BY "questionId", "answerPossibilityId";
