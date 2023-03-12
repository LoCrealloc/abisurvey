import { ProfileField } from "$lib/server/models/profilefield";
import { Attribute } from "$lib/server/models/attribute";
import { Setting } from "$lib/server/models/setting";
import { Picture } from "$lib/server/models/picture";

import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";

import { env } from "$env/dynamic/private";
const { FILE_SIZE_LIMIT } = env;

export const load: PageServerLoad = async ({ locals }) => {
	const count_setting = await Setting.findOne({
		where: { key: "PICTURE_COUNT" },
		attributes: ["value"],
	});

	return {
		fields: (
			await ProfileField.findAll({
				attributes: ["id", "field"],
				order: [["id", "ASC"]],
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
		size_limit: FILE_SIZE_LIMIT !== undefined ? parseInt(FILE_SIZE_LIMIT) : 0,
		pictures: (
			await Picture.findAll({
				attributes: ["id"],
				where: { userId: locals.userId },
			})
		).map((picture) => {
			const data = picture.dataValues;

			return {
				id: data.id,
				image: `/images/${data.id}`,
			};
		}),
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		const count_setting = await Setting.findOne({
			where: { key: "PICTURE_COUNT" },
			attributes: ["value"],
		});

		const picture_count = parseInt(
			count_setting !== null ? count_setting.getDataValue("value") : "0",
		);

		let current_attribute: number | undefined;
		let current_answer: string | undefined;

		async function processEntry(id: number) {
			if (current_answer === undefined) {
				return;
			}

			const field = await ProfileField.findOne({ where: { id: id } });

			if (field !== null) {
				if (current_answer.length > 503) {
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
			} else if (key.startsWith("image")) {
				const id_regex = key.match(/\d+/);
				let id: number | null;

				const file = Buffer.from(await value.arrayBuffer());

				if (value.name === "undefined") {
					continue;
				}

				if (
					FILE_SIZE_LIMIT !== undefined &&
					value.size > parseInt(FILE_SIZE_LIMIT) &&
					parseInt(FILE_SIZE_LIMIT) !== 0
				) {
					throw error(413, { message: `The image ${value.name} is too big.` });
				}

				if (!["image/jpeg", "image/png"].includes(value.type)) {
					throw error(415, {
						message: `The type ${value.type} of image ${avalue.name} is not supported! We only accept PNG or JPEG files!`,
					});
				}

				if (id_regex !== null) {
					id = parseInt(id_regex[0]);
				} else {
					id = null;
				}

				if (id !== null) {
					await Picture.update(
						{ image: file, mimetype: value.type, size: value.size },
						{ where: { id: id, userId: locals.userId } },
					);
				} else {
					const added_pictures = await Picture.count({ where: { userId: locals.userId } });

					if (added_pictures >= picture_count) {
						throw error(400, { message: "Max number of images reached" });
					}

					await Picture.create({
						userId: locals.userId,
						image: file,
						mimetype: value.type,
						size: value.size,
					});
				}
			} else if (key === "deleted_picture") {
				const id = value.toString();
				if (isNaN(parseInt(id))) {
					throw error(400, { message: "Bad image id" });
				}
				await Picture.destroy({ where: { id: parseInt(id) } });
			}
		}
	},
};
