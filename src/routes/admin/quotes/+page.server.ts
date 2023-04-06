import { AnswerPossibility } from "$lib/server/models/answerpossibility";
import type { PageServerLoad } from "./$types";
import { User } from "$lib/server/models/user";
import { Person } from "$lib/server/models/person";
import { Quote } from "$lib/server/models/quote";
import { QuotePart } from "$lib/server/models/quotepart";

export const load: PageServerLoad = (async () => {
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
				separate: true,
				order: [["id", "ASC"]],
			},
			{
				model: User,
				attributes: ["personId"],
				include: [
					{
						model: Person,
						attributes: ["forename", "surname"],
					},
				],
			},
		],
		attributes: ["id", "course"],
		order: [["userId", "ASC"]],
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
		quotes: quotes.map((quote) => {
			const person = quote.User.Person;

			return {
				user: `${person.forename} ${person.surname}`,
				course: quote.course,
				id: quote.id,
				parts: quote.QuoteParts.map((part) => {
					return {
						id: part.id,
						answerPossibilityId: part.answerPossibilityId,
						content: part.content,
					};
				}),
			};
		}),
	};
}) satisfies PageServerLoad;
