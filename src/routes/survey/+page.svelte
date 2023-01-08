<script lang="ts">
	import { onMount } from "svelte";
	import * as levenshtein from "js-levenshtein";

	import { scale } from "svelte/transition";

	interface Possibility {
		forename: string;
		surname: string;
		id: number;
		isTeacher: boolean;
		personId: number;
	}

	interface Answer {
		id?: number;
		answerPossibilityId: number;
	}

	interface PairAnswer {
		id?: number;
		answerOneId?: number;
		answerTwoId?: number;
	}

	export let data;

	// variables to track the currently edited field
	let current: number;
	let pair_part: number;

	let studentQuestions = [];
	let teacherQuestions = [];

	// variable to have all questions
	$: questions = studentQuestions.concat(teacherQuestions);

	let teacherPossibilities = [];
	let studentPossibilities = [];

	// easy access to full possibility names
	let possibilities = {};

	// objects with answers; question ids as keys
	let answers: Record<string, Answer> = {};
	let pairanswers: Record<string, PairAnswer> = {};

	onMount(() => {
		// preprocess the data provided by the backend
		data.questions.forEach((question) => {
			if (question.teacherQuestion) {
				teacherQuestions.push(question);
			} else {
				studentQuestions.push(question);
			}
		});

		data.possibilities.forEach((possibility) => {
			if (possibility.isTeacher) {
				teacherPossibilities.push(possibility);
			} else {
				studentPossibilities.push(possibility);
			}

			possibilities[possibility.id] = `${possibility.forename} ${possibility.surname}`;
		});

		data.answers.forEach((answer) => {
			answers[answer.questionId] = {
				id: answer.id,
				answerPossibilityId: answer.answerPossibilityId,
			};
		});

		data.pairanswers.forEach((answer) => {
			pairanswers[answer.questionId] = {
				id: answer.id,
				answerOneId: answer.answerOneId,
				answerTwoId: answer.answerTwoId,
			};
		});

		// refresh state
		studentQuestions = [...studentQuestions];
		teacherQuestions = [...teacherQuestions];
	});

	let searchResults: Array<Possibility> = [];

	function search(term: string, teacher: boolean, questionId: number) {
		// Calculates the order of the possibilities using the levenshtein distance
		let searchables;

		if (teacher) {
			searchables = [...teacherPossibilities];
		} else {
			searchables = [...studentPossibilities];
		}

		let given_answers = pairanswers[questionId];

		if (given_answers) {
			["answerOneId", "answerTwoId"].forEach((part) => {
				const answer = given_answers[part];

				if (answer) {
					const index = searchables
						.map((s) => {
							return s.id;
						})
						.indexOf(answer);

					searchables.splice(index, 1);
				}
			});
		}

		term = term.toLowerCase();

		searchables.sort((p1, p2) => {
			// the name parts to test the term against
			let tests1 = [
				p1.forename.toLowerCase(),
				p1.surname.toLowerCase(),
				`${p1.forename} ${p1.surname}`.toLowerCase(),
			];
			let tests2 = [
				p2.forename.toLowerCase(),
				p2.surname.toLowerCase(),
				`${p2.forename} ${p2.surname}`.toLowerCase(),
			];

			let smallest = [{}, Number.MAX_VALUE];

			[
				[p1, tests1],
				[p2, tests2],
			].forEach((possibility) => {
				possibility[1].forEach((test) => {
					const distance = levenshtein(test, term);

					if (distance < smallest[1]) {
						smallest[0] = possibility[0];
						smallest[1] = distance;
					}
				});
			});

			if (smallest[0] === p1) {
				return -1;
			} else {
				return 1;
			}
		});

		searchResults = searchables.slice(0, 4);
	}

	function getAnswerForId(obj: Record<string, Answer>, id: number): string {
		if (Object.hasOwn(obj, id.toString())) {
			return possibilities[obj[id].answerPossibilityId];
		}

		return "";
	}

	function getPairAnswerForId(obj: Record<string, PairAnswer>, id: number, part: 1 | 2): string {
		if (Object.hasOwn(obj, id.toString())) {
			let res;

			if (part === 1) {
				res = possibilities[obj[id].answerOneId];
			} else {
				res = possibilities[obj[id].answerTwoId];
			}

			return res !== undefined ? res : "";
		}

		return "";
	}
</script>

<div class="m-2 sm:m-0">
	<h1 class="text-5xl dark:text-white">Umfrage</h1>
	<form class="my-5" method="POST">
		{#if questions.length > 0}
			{#each questions as question, i}
				{#if studentQuestions.length > 0 && question.id === studentQuestions[0].id}
					<h2 class="mt-8 mb-3 text-2xl dark:text-white">Schülerfragen</h2>
				{:else if teacherQuestions.length > 0 && question.id === teacherQuestions[0].id}
					<h2 class="mt-8 mb-3 text-2xl dark:text-white">Lehrerfragen</h2>
				{/if}
				<fieldset class="mt-2 rounded-xl border-4 border-solid border-slate-900 bg-slate-500">
					<legend
						class="mx-5 w-72 rounded-xl border-2 border-solid border-slate-900 bg-white p-2 text-left text-slate-900 md:w-96"
						>{question.question}</legend
					>
					<div>
						<input
							on:input|preventDefault={(event) =>
								search(event.target.value, question.teacherQuestion, question.id)}
							on:focusin={() => {
								current = question.id;

								pair_part = 1;

								search("", question.teacherQuestion, question.id);
							}}
							on:focusout={(event) => {
								current = null;

								event.target.value = !question.pair
									? getAnswerForId(answers, question.id)
									: getPairAnswerForId(pairanswers, question.id, 1);
							}}
							type="text"
							class="m-5 w-72 rounded-lg border-solid p-2"
							placeholder="Deine Antwort.."
							value={!question.pair
								? getAnswerForId(answers, question.id)
								: getPairAnswerForId(pairanswers, question.id, 1)}
						/>
						{#if question.pair}
							<input
								on:input|preventDefault={(event) =>
									search(event.target.value, question.teacherQuestion, question.id)}
								on:focusin={() => {
									current = question.id;

									pair_part = 2;

									search("", question.teacherQuestion, question.id);
								}}
								on:focusout={(event) => {
									current = null;

									event.target.value = getPairAnswerForId(pairanswers, question.id, 2);
								}}
								type="text"
								class="m-5 mt-0 w-72 rounded-lg border-solid p-2"
								placeholder="Deine Antwort.."
								value={getPairAnswerForId(pairanswers, question.id, 2)}
							/>
						{/if}
						{#if current === question.id}
							<div
								transition:scale
								class="absolute z-10 w-fit rounded-xl rounded-t-none border-2 border-solid border-slate-900 bg-white"
							>
								{#each searchResults as possibility}
									<button
										class="w-full border-b-2 p-1.5 text-left text-lg hover:bg-slate-500"
										on:click|preventDefault={() => {
											if (!question.pair) {
												if (Object.hasOwn(answers, question.id.toString())) {
													answers[question.id].answerPossibilityId = possibility.id;
												} else {
													answers[question.id] = {
														answerPossibilityId: possibility.id,
													};
												}
											} else {
												let part = pair_part === 1 ? "answerOneId" : "answerTwoId";
												if (!Object.hasOwn(pairanswers, question.id.toString())) {
													pairanswers[question.id] = {};
												}

												pairanswers[question.id][part] = possibility.id;
											}
										}}
									>
										{`${possibility.forename} ${possibility.surname}`}
									</button>
									<br />
								{/each}
							</div>
						{/if}
					</div>

					{#if Object.hasOwn(answers, question.id.toString())}
						{#if Object.hasOwn(answers[question.id.toString()], "id")}
							<input hidden name="answerId" value={answers[question.id.toString()].id} />
						{/if}
						<input
							hidden
							name="answerPossibilityId"
							value={answers[question.id.toString()].answerPossibilityId}
						/>
					{:else if Object.hasOwn(pairanswers, question.id.toString())}
						{#if Object.hasOwn(pairanswers, question.id.toString())}
							{#if Object.hasOwn(pairanswers[question.id.toString()], "id")}
								<input hidden name="answerId" value={pairanswers[question.id.toString()].id} />
							{/if}
							{#if Object.hasOwn(pairanswers[question.id.toString()], "answerOneId")}
								<input
									hidden
									name="answerOneId"
									value={pairanswers[question.id.toString()].answerOneId}
								/>
							{/if}
							{#if Object.hasOwn(pairanswers[question.id.toString()], "answerTwoId")}
								<input
									hidden
									name="answerTwoId"
									value={pairanswers[question.id.toString()].answerTwoId}
								/>
							{/if}
						{/if}
					{/if}
					<input hidden name="questionId" value={question.id} />
				</fieldset>
			{/each}
		{:else}
			<h1 class="m-8 text-center dark:text-white">Es sind noch keine Fragen vorhanden.</h1>
		{/if}
		<input
			class="mt-8 w-full rounded-xl bg-slate-500 p-4 text-lg text-white"
			type="submit"
			value="Absenden"
		/>
	</form>
</div>
