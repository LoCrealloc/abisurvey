import type { PageServerLoad } from "./$types";
import { Code } from "$lib/server/models/code";
import type { Actions } from "@sveltejs/kit";
import { randomBytes } from "crypto";

export const load: PageServerLoad = async () => {
	return {
		codes: (
			await Code.findAll({
				attributes: ["id", "code"],
				order: [["code", "ASC"]],
			})
		).map((code) => {
			return code.dataValues;
		}),
	};
};

export const actions: Actions = {
	generate: async ({ request }) => {
		const data = (await request.formData()).entries();

		let count = 0;
		const codes = [];

		for (const attr of data) {
			if (attr[0] === "count") {
				count = parseInt(attr[1].toString());
			}
		}
		for (let i = 0; i < count; i++) {
			codes.push({ code: randomBytes(4).toString("hex").toUpperCase() });
		}

		if (codes.length > 0) {
			await Code.bulkCreate(codes);
		}
	},
	delete: async ({ request }) => {
		const data = await request.formData();

		let to_delete;

		for (const attr of data.entries()) {
			if (attr[0] === "id") {
				to_delete = parseInt(attr[1].toString());
			}
		}

		await Code.destroy({ where: { id: to_delete } });
	},
};
