import type { PageServerLoad } from "./$types";
import { Question } from "$lib/server/models/question";
import { PairQuestion } from "$lib/server/models/pairquestion";

interface inQuestion {
	question: string;
	teacherQuestion: boolean;
	id?: number;
}

export const load: PageServerLoad = async () => {
	console.log(await Question.findAll({ attributes: ["id", "question", "teacherQuestion"] }));

	return {
		simplequestions: (
			await Question.findAll({ attributes: ["id", "question", "teacherQuestion"] })
		).map((question) => {
			return question.dataValues;
		}),
		pairquestions: (
			await PairQuestion.findAll({ attributes: ["id", "question", "teacherQuestion"] })
		).map((question) => {
			return question.dataValues;
		}),
	};
};

import type { Actions } from "./$types";

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const result = [];
		let current: inQuestion = {
			question: "",
			teacherQuestion: false,
		};

		for (const pair of data.entries()) {
			const key = pair[0];
			const value = pair[1];

			if (key === "question") {
				if (current.question !== "") {
					result.push(current);
				}

				current = {
					question: "",
					teacherQuestion: false,
				};

				current.question = value.toString();
			} else if (key === "teacherQuestion") {
				current.teacherQuestion = true;
			} else if (key === "id") {
				current.id = parseInt(value.toString());
			}
		}

		if (current.question !== "") {
			result.push(current);
		}

		const with_id: Array<inQuestion> = [];
		const without_id: Array<inQuestion> = [];

		result.forEach((question) => {
			if (Object.hasOwn(question, "id")) {
				with_id.push(question);
			} else {
				without_id.push(question);
			}
		});

		await Question.bulkCreate(without_id);

		for (let i = 0; i < with_id.length; i++) {
			const question = with_id[i];

			await Question.update(question, { where: { id: question.id } });
		}
	},
};
