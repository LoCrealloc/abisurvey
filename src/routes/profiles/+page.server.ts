import { ProfileField } from "$lib/server/models/profilefield";
import { Attribute } from "$lib/server/models/attribute";

import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
	return {
		fields: (
			await ProfileField.findAll({
				attributes: ["id", "field"],
				order: [["field", "ASC"]],
			})
		).map((field) => {
			return field.dataValues;
		}),
		attributes: (
			await Attribute.findAll({
				attributes: ["id", "answer", "profileFieldId"],
				where: {
					userId: locals.userId,
				},
			})
		).map((attribute) => {
			return attribute.dataValues;
		}),
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		let current_attribute: number | undefined;
		let current_answer: string | undefined;

		async function processEntry(id: number) {
			if (current_answer === undefined) {
				return;
			}

			const field = await ProfileField.findOne({ where: { id: id } });

			if (field !== null) {
				if (current_attribute === undefined) {
					await Attribute.create({
						profileFieldId: id,
						answer: current_answer,
						userId: locals.userId,
					});
				} else {
					await Attribute.update(
						{ answer: current_answer },
						{ where: { id: current_attribute, userId: locals.userId } },
					);
				}
			}
		}

		console.log(data);

		for (const pair of data.entries()) {
			const key = pair[0];
			const value = pair[1];

			if (key === "fieldId") {
				await processEntry(parseInt(value.toString()));

				current_answer = undefined;
				current_attribute = undefined;
			} else if (key === "attributeId") {
				current_attribute = parseInt(value.toString());
			} else if (key === "answer") {
				current_answer = value.toString();
			}
		}
	},
};
