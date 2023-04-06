import type { PageServerLoad } from "./$types";

import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies, locals }) => {
	await cookies.delete("usersession");
	await cookies.delete("token");

	locals.userId = null;

	throw redirect(302, "/login");
};
