import type { PageServerLoad } from "./$types";
import { Answer } from "$lib/server/models/answer";
import { db } from "$lib/server/database";
import { AnswerPossibility } from "$lib/server/models/answerpossibility";
import { Person } from "$lib/server/models/person";
import { Question } from "$lib/server/models/question";
import { PairAnswer } from "$lib/server/models/pairanswer";

interface QueriedPossibility {
	id: number;
	Person: Person;
}

interface QueriedAnswer {
	id: number;
	questionId: number;
	answerPossibilityId: number;
	count: string;
	Question: Question;
}

interface QueriedPairAnswer {
	id: number;
	questionId: number;
	answerOneId: number;
	answerTwoId: number;
	count: string;
	Question: Question;
}

export const load: PageServerLoad = async ({ params }) => {
	// @ts-ignore
	const possibilities: Array<QueriedPossibility> = (
		await AnswerPossibility.findAll({
			include: Person,
			attributes: ["id", "Person.forename", "Person.surname"],
			where: {
				isTeacher: params.type === "teacher",
			},
		})
	).map((value) => {
		return value.dataValues;
	});

	// @ts-ignore
	const answers: Array<QueriedAnswer> = (
		await Answer.findAll({
			include: [
				{
					model: Question,
					attributes: ["teacherQuestion"],
					where: { teacherQuestion: params.type === "teacher" },
				},
			],
			attributes: [
				"questionId",
				"answerPossibilityId",
				[db.fn("count", "answerPossibilityId"), "count"],
			],
			group: ["questionId", "answerPossibilityId", "Question.id"],
		})
	).map((row) => {
		return row.dataValues;
	});

	// @ts-ignore
	const pairanswers: Array<QueriedPairAnswer> = (
		await PairAnswer.findAll({
			include: [
				{
					model: Question,
					attributes: ["teacherQuestion"],
					where: { teacherQuestion: params.type === "teacher" },
				},
			],
			attributes: [
				"questionId",
				"answerOneId",
				"answerTwoId",
				[db.fn("count", "answerOneId"), "count"],
			],
			group: ["questionId", "answerOneId", "answerTwoId", "Question.id"],
		})
	).map((row) => {
		return row.dataValues;
	});

	return {
		answers: answers.map((answer) => {
			return {
				questionId: answer.questionId,
				answerPossibilityId: answer.answerPossibilityId,
				count: answer.count,
			};
		}),
		pairanswers: pairanswers.map((pairanswer) => {
			return {
				questionId: pairanswer.questionId,
				answerOneId: pairanswer.answerOneId,
				answerTwoId: pairanswer.answerTwoId,
				count: pairanswer.count,
			};
		}),
		questions: (
			await Question.findAll({
				attributes: ["id", "question", "teacherQuestion"],
				where: {
					teacherQuestion: params.type === "teacher",
				},
			})
		).map((question) => {
			return question.dataValues;
		}),

		possibilities: possibilities.map((row) => {
			return {
				id: row.id,
				forename: row.Person.forename,
				surname: row.Person.surname,
			};
		}),
		type: params.type,
	};
};
