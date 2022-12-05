import type { PageServerLoad, Actions } from "./$types";
import { AnswerPossibility } from "$lib/server/models/answerpossibility";

interface inPossibility {
	name: string;
	id?: number;
	isTeacher: boolean;
}

export const load: PageServerLoad = async ({ params }) => {
	return {
		possibilities: (
			await AnswerPossibility.findAll({
				attributes: ["id", "name"],
				where: {
					isTeacher: params.type === "teacher",
				},
			})
		).map((question) => {
			return question.dataValues;
		}),
		type: params.type,
	};
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		// fetch answer possibility ids to check what needs to be deleted later
		const possibility_ids = (
			await AnswerPossibility.findAll({
				attributes: ["id"],
				where: {
					isTeacher: params.type === "teacher",
				},
			})
		).map((question) => {
			return question.dataValues.id;
		});

		const data = await request.formData();

		const result = [];
		let current: inPossibility = {
			name: "",
			isTeacher: params.type === "teacher",
		};

		for (const pair of data.entries()) {
			const key = pair[0];
			const value = pair[1];

			if (key === "name") {
				if (current.name !== "") {
					result.push(current);
				}

				current = {
					name: "",
					isTeacher: current.isTeacher,
				};

				current.name = value.toString();
			} else if (key === "id") {
				current.id = parseInt(value.toString());
			}
		}

		if (current.name !== "") {
			result.push(current);
		}

		const with_id: Array<inPossibility> = [];
		const without_id: Array<inPossibility> = [];

		const in_ids: Array<number> = [];

		result.forEach((possibility) => {
			if (Object.hasOwn(possibility, "id") && possibility.id != undefined) {
				with_id.push(possibility);
				in_ids.push(possibility.id);
			} else {
				without_id.push(possibility);
			}
		});

		await AnswerPossibility.bulkCreate(without_id);

		for (let i = 0; i < with_id.length; i++) {
			const possibility = with_id[i];

			await AnswerPossibility.update(possibility, { where: { id: possibility.id } });
		}

		const removables: Array<number> = [];

		possibility_ids.forEach((number) => {
			if (!in_ids.includes(number)) {
				removables.push(number);
			}
		});

		await AnswerPossibility.destroy({ where: { id: removables } });
	},
};
