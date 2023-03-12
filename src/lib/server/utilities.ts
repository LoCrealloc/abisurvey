import { redirect } from "@sveltejs/kit";

export const rdr_to_login = () => {
	throw redirect(302, "/login_admin");
};

export const rdr_to_home = () => {
	throw redirect(302, "/admin");
};

export const compare_nums = (one: number | undefined, two: number | undefined): boolean => {
	if ((one == undefined && two == undefined) || two == undefined) {
		return true;
	}

	if (one == undefined) {
		return false;
	}

	return one < two;
};
