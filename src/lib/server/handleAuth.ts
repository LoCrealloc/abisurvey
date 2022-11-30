import { jwtVerify } from "jose";
import { SECRET } from "$env/static/private";
import { genSalt, hash } from "bcrypt";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const secret = new TextEncoder().encode(SECRET);

export async function verify_logged_in(token: string | undefined): Promise<boolean> {
	if (token === undefined) {
		return false;
	}
	const { payload, protectedHeader } = await jwtVerify(token, secret).catch((_) => {
		return { payload: null, protectedHeader: null };
	});

	if (payload === null || payload.loggedIn === undefined) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return payload.loggedIn;
}

export async function hash_password(password: string): Promise<string> {
	const salt = await genSalt(10);
	return (await hash(password, salt)).toString();
}
