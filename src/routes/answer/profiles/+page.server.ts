import { ProfileField } from "$lib/server/models/profilefield";
import { Attribute } from "$lib/server/models/attribute";
import { Setting } from "$lib/server/models/setting";
import { Picture } from "$lib/server/models/picture";

import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
	const count_setting = await Setting.findOne({
		where: { key: "PICTURE_COUNT" },
		attributes: ["value"],
	});

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
		picture_count: parseInt(count_setting !== null ? count_setting.getDataValue("value") : "0"),
		pictures: (
			await Picture.findAll({ attributes: ["id", "image"], where: { userId: locals.userId } })
		).map((picture) => {
			const data = picture.dataValues;

			return {
				id: data.id,
				image: data.image.toString(),
			};
		}),
	};
};

export const actions: Actions = {
	fields: async ({ request, locals }) => {
		const data = await request.formData();

		const count_setting = await Setting.findOne({
			where: { key: "PICTURE_COUNT" },
			attributes: ["value"],
		});

		const picture_count = parseInt(
			count_setting !== null ? count_setting.getDataValue("value") : "0",
		);

		const former_images = await Picture.findAll({
			where: { userId: locals.userId },
			attributes: ["id"],
		});

		const confirmed_images: Array<number> = [];

		let current_attribute: number | undefined;
		let current_answer: string | undefined;

		async function processEntry(id: number) {
			if (current_answer === undefined) {
				return;
			}

			const field = await ProfileField.findOne({ where: { id: id } });

			if (field !== null) {
				if (current_answer.length > 503) {
					console.log(current_answer.length);
					throw error(400, { message: "answer too long" });
				}

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
			} else if (key === "image") {
				const content = JSON.parse(value.toString());

				if (!("image" in content)) {
					throw error(400, { message: "No image provided" });
				}

				if ("id" in content && !isNaN(parseInt(content["id"]))) {
					confirmed_images.push(parseInt(content["id"]));

					await Picture.update(
						{ image: content["image"] },
						{ where: { id: parseInt(content["id"]), userId: locals.userId } },
					);
				} else {
					const added_pictures = await Picture.count({ where: { userId: locals.userId } });

					if (added_pictures >= picture_count) {
						throw error(400, { message: "Max number of images reached" });
					}

					const new_picture = await Picture.create({
						userId: locals.userId,
						image: content["image"],
					});
					confirmed_images.push(new_picture.id);
				}
			}
		}

		former_images.forEach(async (image) => {
			if (!confirmed_images.includes(image.getDataValue("id"))) {
				await image.destroy();
			}
		});
	},
};
