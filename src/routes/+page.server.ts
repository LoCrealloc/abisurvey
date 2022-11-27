import type { Actions, RequestEvent } from "@sveltejs/kit";

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const data = await event.request.formData();
		console.log(data.get("code"));
	},
};
