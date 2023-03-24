import { redirect } from "@sveltejs/kit";
import { Person } from "$lib/server/models/person";
import { User } from "$lib/server/models/user";
import { AnswerPossibility } from "$lib/server/models/answerpossibility";

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

export async function check_delete_person(id: number) {
	const user = await User.findOne({ where: { personId: id } });

	if (user === null) {
		const possibility = await AnswerPossibility.findOne({ where: { personId: id } });

		if (possibility === null) {
			console.log(id);
			await Person.destroy({ where: { id: id } });
		}
	}
}
