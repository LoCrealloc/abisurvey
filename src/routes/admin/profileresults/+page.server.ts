import type { PageServerLoad } from "./$types";

import { Picture } from "$lib/server/models/picture";
import { User } from "$lib/server/models/user";
import { Attribute } from "$lib/server/models/attribute";
import { ProfileField } from "$lib/server/models/profilefield";
import { Person } from "$lib/server/models/person";

export const load: PageServerLoad = async () => {
	return {
		users: (
			await User.findAll({
				include: [
					{
						model: Person,
						attributes: ["forename", "surname"],
					},
				],
				attributes: ["id"],
			})
		).map((user) => {
			return {
				id: user.id,
				name: `${user.Person.forename} ${user.Person.surname}`,
			};
		}),
		attributes: (
			await Attribute.findAll({
				attributes: ["answer", "userId", "profileFieldId"],
				order: [["profileFieldId", "ASC"]],
			})
		).map((attribute) => {
			return attribute.dataValues;
		}),
		fields: (
			await ProfileField.findAll({ attributes: ["id", "field"], order: [["id", "ASC"]] })
		).map((field) => {
			return field.dataValues;
		}),
		pictures: (await Picture.findAll({ attributes: ["userId", "id"] })).map((picture) => {
			const data = picture.dataValues;

			return {
				image: `/images/${data.id}`,
				userId: data.userId,
			};
		}),
	};
};
