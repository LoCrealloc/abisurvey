import type { PageServerLoad, Actions } from "./$types";
import { AnswerPossibility } from "$lib/server/models/answerpossibility";
import { Person } from "$lib/server/models/person";
import { Answer } from "$lib/server/models/answer";
import { PairAnswer } from "$lib/server/models/pairanswer";

import { Op } from "sequelize";

import { check_delete_person } from "$lib/server/utilities";

interface inPossibility {
	id?: number;
	isTeacher: boolean;
	personId?: number;
}

interface inPerson {
	id?: number;
	forename: string;
	surname: string;
}

interface fetchedPossibility {
	id: number;
	personId: number;
}

export const load: PageServerLoad = async ({ params }) => {
	const data = (
		await AnswerPossibility.findAll({
			include: Person,
			attributes: ["id", "isTeacher", "personId", "Person.forename", "Person.surname"],
			where: {
				isTeacher: params.type === "teacher",
			},
		})
	).map((value) => {
		return value.dataValues;
	});

	return {
		possibilities: data.map((row) => {
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
		type: params.type,
	};
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		// fetch answer possibility ids to check what needs to be deleted later
		const db_possibilities: Array<fetchedPossibility> = (
			await AnswerPossibility.findAll({
				attributes: ["id", "personId"],
				where: {
					isTeacher: params.type === "teacher",
				},
			})
		).map((question) => {
			return question.dataValues;
		});

		const data = await request.formData();

		const processed: Array<number> = [];
		let current_possibility: inPossibility = {
			id: undefined,
			isTeacher: params.type === "teacher",
		};

		let current_person: inPerson = {
			id: undefined,
			forename: "",
			surname: "",
		};

		async function processEntry() {
			if (current_person.forename !== "") {
				let person;
				if (current_person.id === undefined) {
					person = await Person.create(current_person);
				} else {
					await Person.update(current_person, { where: { id: current_person.id } });
					person = current_person;
				}

				// @ts-ignore
				current_possibility.personId = person.id;

				if (current_possibility.id === undefined) {
					await AnswerPossibility.create(current_possibility);
				} else {
					await AnswerPossibility.update(current_possibility, {
						where: {
							id: current_possibility.id,
						},
					});
					processed.push(current_possibility.id);
				}
			}
		}

		for (const pair of data.entries()) {
			const key = pair[0];
			const value = pair[1];

			if (key === "forename") {
				await processEntry();

				current_person = {
					id: undefined,
					forename: "",
					surname: "",
				};

				current_possibility = {
					id: undefined,
					isTeacher: params.type === "teacher",
				};

				current_person.forename = value.toString();
			} else if (key === "id") {
				current_possibility.id = parseInt(value.toString());
			} else if (key === "personId") {
				current_person.id = parseInt(value.toString());
			} else if (key === "surname") {
				current_person.surname = value.toString();
			}
		}

		await processEntry();

		for (const { id, personId } of db_possibilities) {
			if (!processed.includes(id)) {
				await Answer.destroy({ where: { answerPossibilityId: id } });
				await PairAnswer.destroy({
					where: { [Op.or]: [{ answerOneId: id }, { answerTwoId: id }] },
				});

				await AnswerPossibility.destroy({ where: { id: id } });

				await check_delete_person(personId);
			}
		}
	},
};
