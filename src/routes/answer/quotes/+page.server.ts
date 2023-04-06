import { AnswerPossibility } from "$lib/server/models/answerpossibility";
import type { PageServerLoad, Actions } from "./$types";
import { Person } from "$lib/server/models/person";
import { Quote } from "$lib/server/models/quote";
import { QuotePart } from "$lib/server/models/quotepart";
import { error } from "@sveltejs/kit";

interface inQuote {
	id?: number;
	course?: string;
}

interface inQuotePart {
	id?: number;
	content?: string;
	answerPossibilityId?: number;
	quoteId?: number;
}

export const load: PageServerLoad = (async ({ locals }) => {
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
		],
		attributes: ["id", "course"],
		order: [["id", "ASC"]],
		where: { userId: locals.userId },
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
			return {
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

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const quote_ids: Array<number> = (
			await Quote.findAll({ attributes: ["id"], where: { userId: locals.userId } })
		).map((quote) => {
			return quote.id;
		});

		const part_ids = (
			await QuotePart.findAll({
				attributes: ["id"],
				where: {
					quoteId: quote_ids.map((q) => {
						return q.toString();
					}),
				},
			})
		).map((part) => {
			return part.id;
		});

		const in_quotes: Array<number> = [];
		const in_parts: Array<number> = [];

		const data = await request.formData();

		let current_quote: inQuote = {};
		let current_part: inQuotePart = {};
		let current_quote_parts: Array<inQuotePart> = [];

		async function processQuote() {
			if (current_quote_parts.length < 1) {
				throw error(400, { message: "Bad input: quote parts missing" });
			}

			if (current_quote.course === undefined) {
				throw error(400, { message: "Bad input: quote course missing" });
			} else if (current_quote.course.length > 20) {
				throw error(400, { message: "Bad input: quote course too long (max 20 characters)" });
			}

			let quote: Quote;

			if (current_quote.id !== null && current_quote.id !== undefined) {
				// @ts-ignore
				quote = await Quote.findOne({ where: { id: current_quote.id, userId: locals.userId } });

				if (quote === null) {
					throw error(400, { message: "Bad input: no quote with this id could be found" });
				}

				await quote.update({ course: current_quote.course });

				in_quotes.push(current_quote.id);
			} else {
				quote = await Quote.create({ course: current_quote.course, userId: locals.userId });
			}

			const creatable_parts: Array<inQuotePart> = [];

			for (const part of current_quote_parts) {
				if (part.id !== undefined && part.id !== null) {
					const db_part = await QuotePart.findOne({ where: { id: part.id, quoteId: quote.id } });

					if (db_part === null) {
						throw error(400, { message: "Bad input: no part with this id could be found" });
					}

					await db_part.update({
						content: part.content,
						answerPossibilityId: part.answerPossibilityId,
					});

					in_parts.push(part.id);
				} else {
					part.quoteId = quote.id;

					if (part.content === undefined || part.answerPossibilityId === undefined) {
						throw error(400, {
							message: "Bad input: missing content or possibility for quote part",
						});
					} else if (part.content.length > 100) {
						throw error(400, {
							message: "Bad input: part content too long (max 100 characters)",
						});
					}

					creatable_parts.push(part);
				}
			}

			// @ts-ignore
			await QuotePart.bulkCreate(creatable_parts);

			current_quote = {};
			current_part = {};
			current_quote_parts = [];
		}

		for (const pair of data.entries()) {
			const key = pair[0];
			const value = pair[1];

			evaluate: {
				switch (key) {
					case "course":
						if (
							current_part.answerPossibilityId !== undefined &&
							current_part.content !== undefined
						) {
							current_quote_parts.push(current_part);
						}

						if (Object.keys(current_quote).length > 0) {
							await processQuote();
						}

						current_quote.course = value.toString();

						break evaluate;

					case "content":
						if (
							current_part.answerPossibilityId !== undefined &&
							current_part.content !== undefined
						) {
							current_quote_parts.push(current_part);
						}

						current_part = {
							content: value.toString(),
						};

						break evaluate;

					case "possibility-id":
						current_part.answerPossibilityId = parseInt(value.toString());
						break evaluate;

					case "part-id":
						current_part.id = parseInt(value.toString());
						break evaluate;

					case "id":
						current_quote.id = parseInt(value.toString());
						break evaluate;
				}
			}
		}

		if (current_part.answerPossibilityId !== undefined && current_part.content !== undefined) {
			current_quote_parts.push(current_part);
		}

		await processQuote();

		for (const quoteId of quote_ids) {
			if (!in_quotes.includes(quoteId)) {
				await Quote.destroy({ where: { id: quoteId } });
				await QuotePart.destroy({ where: { quoteId: quoteId } });
			}
		}

		for (const partId of part_ids) {
			if (!in_parts.includes(partId)) {
				await QuotePart.destroy({ where: { id: partId } });
			}
		}
	},
} satisfies Actions;
