import type { PageServerLoad } from "./$types";

import { Setting } from "$lib/server/models/setting";

export const load: PageServerLoad = async () => {
	const entry = await Setting.findOne({ where: { key: "privacy" }, attributes: ["value"] });

	return {
		privacy: entry !== null ? entry.get("value") : "",
	};
};
