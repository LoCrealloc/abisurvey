import type { Handle } from "@sveltejs/kit";
import { verify_logged_in, hash_password } from "$lib/server/handleAuth";
import { db } from "$lib/server/database";

// import to load the models for db sync
import { Answer } from "./lib/server/models/answer";
import { AnswerPossibility } from "./lib/server/models/answerpossibility";
import { Code } from "./lib/server/models/code";
import { PairAnswer } from "./lib/server/models/pairanswer";
import { PairQuestion } from "./lib/server/models/pairquestion";
import { Question } from "./lib/server/models/question";
import { User } from "./lib/server/models/user";

import { Setting } from "$lib/server/models/setting";
import { DEFAULT_ADMIN_PASSWORD } from "$env/static/private";

async function db_setup() {
	await db.sync();

	const configs = await Setting.findAll();
	if (configs.length > 0) {
		return;
	}

	const initial_config = [
		{
			key: "ADMIN_PASSWORD",
			value: await hash_password(DEFAULT_ADMIN_PASSWORD),
		},
	];

	console.log(initial_config);

	for (let i = 0; i < initial_config.length; i++) {
		await Setting.create(initial_config[i]);
	}
}

function redirect(body: string, location: string) {
	return new Response(body, {
		status: 303,
		headers: { location },
	});
}

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith("/admin")) {
		const token = event.cookies.get("token");
		if (!(await verify_logged_in(token))) {
			redirect("Not logged in", "/admin/login");
		}

		event.locals.loggedIn = true;
	}

	return resolve(event);
};

await db_setup();
