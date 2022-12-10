import type { PageServerLoad } from "./$types";

import { rdr_to_login } from "$lib/server/utilities";

export const load: PageServerLoad = async ({ cookies, locals }) => {
	console.log("logging out");

	await cookies.delete("token");

	locals.loggedInAdmin = false;

	rdr_to_login();
};
