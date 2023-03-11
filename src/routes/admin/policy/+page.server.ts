import type { PageServerLoad, Actions } from "./$types";

import { Setting } from "$lib/server/models/setting";

export const load: PageServerLoad = async () => {
	const entry = await Setting.findOne({ where: { key: "privacy" }, attributes: ["value"] });

	return {
		privacy: entry !== null ? entry.get("value") : "",
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = Object.fromEntries((await request.formData()).entries());

		if (
			data.privacy !== null &&
			data.privacy !== undefined &&
			data.privacy !== "" &&
			typeof data.privacy === "string"
		) {
			const entry = await Setting.findOne({ where: { key: "privacy" } });

			if (entry !== null) {
				await entry.update({ key: "privacy", value: data.privacy });
			} else {
				await Setting.create({ key: "privacy", value: data.privacy });
			}
		}
	},
};
