import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";
import { AnswerPossibility } from "$lib/server/models/answerpossibility";
import { Person } from "$lib/server/models/person";
import { Quote } from "$lib/server/models/quote";
import { QuotePart } from "$lib/server/models/quotepart";

export const load: PageServerLoad = async ({ locals }) => {
	const possibilities = (
		await AnswerPossibility.findAll({
			include: Person,
			attributes: ["id", "isTeacher", "personId", "Person.forename", "Person.surname"],
		})
	).map((value) => {
		return value.dataValues;
	});

	const quotes = await Quote.findAll({
		include: [
			{
				model: QuotePart,
				attributes: ["answerPossibilityId", "content", "id"],
				order: ["id", "ASC"],
			},
		],
		attributes: ["id", "course"],
		where: { userId: locals.userId },
	});

	console.log(quotes);

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
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {},
};
