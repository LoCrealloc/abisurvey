import type { gender, Possibility } from "$lib/common_types";
import { distance } from "fastest-levenshtein";

export function downloadText(text: string, name: string) {
	/*
	 *  This is probably a shitty solution,
	 *  but I don't know if you can do things in JS that are not shitty,
	 *  so this will probably stay here
	 */

	const blob = new Blob([text], { type: "text/plain;charset=utf-8" });

	const link = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.setAttribute("download", name);
	a.setAttribute("href", link);
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(link);
}

export function validateGender(maybeGender: string): maybeGender is gender {
	return ["m", "w", "d"].includes(maybeGender);
}

export function order_possiblities(
	term: string,
	possibilities: Array<Possibility>,
): Array<Possibility> {
	term = term.toLowerCase();

	possibilities.sort((p1, p2) => {
		// the name parts to test the term against
		const tests1 = [
			p1.forename.toLowerCase(),
			p1.surname.toLowerCase(),
			`${p1.forename} ${p1.surname}`.toLowerCase(),
		];
		const tests2 = [
			p2.forename.toLowerCase(),
			p2.surname.toLowerCase(),
			`${p2.forename} ${p2.surname}`.toLowerCase(),
		];

		const smallest = [{}, Number.MAX_VALUE];

		[
			[p1, tests1],
			[p2, tests2],
		].forEach((possibility) => {
			possibility[1].forEach((test: string) => {
				const calculated_distance = distance(test, term);

				if (calculated_distance < smallest[1]) {
					smallest[0] = possibility[0];
					smallest[1] = calculated_distance;
				}
			});
		});

		if (smallest[0] === p1) {
			return -1;
		} else {
			return 1;
		}
	});

	return possibilities;
}
