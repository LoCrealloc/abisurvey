import type { Actions } from "@sveltejs/kit";

import { Code } from "$lib/server/models/code";
import { User } from "$lib/server/models/user";
import { error, redirect } from "@sveltejs/kit";
import { SignJWT } from "jose";
import { dev } from "$app/environment";

import { SECRET } from "$env/static/private";

const jwt_alg = "HS256";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const secret = new TextEncoder().encode(SECRET);

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const email = data.get("email");
		const code = data.get("code");

		if (email === null || code == null) {
			throw error(404, "incomplete request");
		}

		const codeModel = await Code.findOne({ where: { code: code.toString() } });

		if (codeModel === null) {
			throw error(401, "wrong code");
		}

		const newUser = {
			mail: email.toString(),
		};

		const user = await User.create(newUser);

		console.log(user.dataValues.id);

		await Code.update(
			{
				userId: user.dataValues.id,
			},
			{ where: { id: codeModel.dataValues.id } },
		);

		const jwt = await new SignJWT({ userId: user.dataValues.id })
			.setProtectedHeader({ alg: jwt_alg })
			.setExpirationTime("1d")
			.sign(secret);

		cookies.set("usersession", jwt.toString(), {
			path: "/",
			sameSite: "strict",
			secure: !dev,
			maxAge: 60 * 60 * 24,
		});

		throw redirect(302, "/survey");
	},
};
