import { Question } from "$lib/server/models/question";
import type { PageServerLoad } from "./$types";
import { AnswerPossibility } from "$lib/server/models/answerpossibility";
import { Person } from "$lib/server/models/person";
import { Answer } from "$lib/server/models/answer";
import type { Actions } from "@sveltejs/kit";
import { PairAnswer } from "$lib/server/models/pairanswer";
import { compare_nums } from "$lib/server/utilities";

export const load: PageServerLoad = async ({ locals }) => {
	const possibilities = (
		await AnswerPossibility.findAll({
			include: Person,
			attributes: ["id", "isTeacher", "personId", "Person.forename", "Person.surname"],
		})
	).map((value) => {
		return value.dataValues;
	});

	return {
		possibilities: possibilities.map((row) => {
			return {
				id: row.id,
				isTeacher: row.isTeacher,
				personId: row.personId,
				// @ts-ignore
				forename: row.Person.forename,
				// @ts-ignore
				surname: row.Person.surname,
			};
		}),
		questions: (
			await Question.findAll({
				attributes: ["id", "question", "teacherQuestion", "pair"],
				order: [["question", "ASC"]],
			})
		).map((question) => {
			return question.dataValues;
		}),
		answers: (
			await Answer.findAll({
				attributes: ["id", "questionId", "answerPossibilityId"],
				where: {
					userId: locals.userId,
				},
			})
		).map((answer) => {
			return answer.dataValues;
		}),
		pairanswers: (
			await PairAnswer.findAll({
				attributes: ["id", "questionId", "answerOneId", "answerTwoId"],
				where: {
					userId: locals.userId,
				},
			})
		).map((answer) => {
			return answer.dataValues;
		}),
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		let current_possibility: number | undefined;
		let current_possibility_two: number | undefined;

		async function processEntry(id: number) {
			if (current_possibility === undefined) {
				return;
			}

			const question = await Question.findOne({ where: { id: id } });

			if (question !== null && !question.pair) {
				const current_answer = await Answer.findOne({
					where: { questionId: id, userId: locals.userId },
				});

				if (current_answer === null) {
					await Answer.create({
						questionId: id,
						answerPossibilityId: current_possibility,
						userId: locals.userId,
					});
				} else {
					await Answer.update(
						{ answerPossibilityId: current_possibility },
						{ where: { id: current_answer.id, userId: locals.userId } },
					);
				}
			} else {
				const order = compare_nums(current_possibility, current_possibility_two)
					? {
							answerOneId: current_possibility,
							answerTwoId: current_possibility_two,
					  }
					: {
							answerOneId: current_possibility_two,
							answerTwoId: current_possibility,
					  };

				const current_answer = await PairAnswer.findOne({
					where: { questionId: id, userId: locals.userId },
				});

				if (current_answer === null) {
					if (current_possibility === current_possibility_two) {
						return;
					}

					await PairAnswer.create(
						Object.assign(
							{
								questionId: id,
								userId: locals.userId,
							},
							order,
						),
					);
				} else {
					await PairAnswer.update(order, {
						where: { id: current_answer.id, userId: locals.userId },
					});
				}
			}
		}

		for (const pair of data.entries()) {
			const key = pair[0];
			const value = pair[1];

			if (key === "questionId") {
				await processEntry(parseInt(value.toString()));

				current_possibility = undefined;
				current_possibility_two = undefined;
			} else if (key === "answerPossibilityId" || key === "answerOneId") {
				current_possibility = parseInt(value.toString());
			} else if (key === "answerTwoId") {
				current_possibility_two = parseInt(value.toString());
			}
		}
	},
};
