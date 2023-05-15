<script lang="ts">
	import { onMount } from "svelte";
	import { afterNavigate } from "$app/navigation";
	import Evaluation from "$lib/client/components/Evaluation.svelte";

	import { downloadText } from "$lib/client/utils";

	interface Question {
		id: number;
		question: string;
	}

	interface Result {
		possibility: string;
		count: number;
	}

	interface Answer {
		question: string;
		results: Array<Result>;
	}

	export let data;

	let possibilities: Record<number, string> = {};
	let obj_results: Record<string, Answer> = {};

	let ls_results: Array<Answer> = [];
	let type = "";

	let result_count = 10;

	function loadCallback() {
		type = data.type;

		obj_results = {};
		ls_results = [];

		data.possibilities.forEach((possibility) => {
			possibilities[possibility.id.toString()] = `${possibility.forename} ${possibility.surname}`;
		});

		data.questions.forEach((question: Question) => {
			obj_results[question.id.toString()] = {
				question: question.question,
				results: [],
			};
		});

		data.answers.forEach((answer) => {
			obj_results[answer.questionId].results.push({
				possibility: possibilities[answer.answerPossibilityId.toString()],
				count: parseInt(answer.count),
			});
		});

		data.pairanswers.forEach((answer) => {
			obj_results[answer.questionId].results.push({
				possibility: `${possibilities[answer.answerOneId.toString()]} & ${
					possibilities[answer.answerTwoId.toString()]
				}`,
				count: parseInt(answer.count),
			});
		});

		obj_results = structuredClone(obj_results);
		ls_results = [...Object.values(obj_results)];
	}

	function limit_results() {
		if (result_count == 10) {
			ls_results = [...Object.values(obj_results)];
			return;
		}

		const new_results = [];

		[...Object.values(obj_results)].forEach((question) => {
			const new_question = structuredClone(question);
			const all_nums = [];

			question.results.forEach((result) => {
				if (!all_nums.includes(result.count)) {
					all_nums.push(result.count);
				}
			});

			all_nums.sort().reverse();

			const top = all_nums.slice(0, result_count);
			new_question.results = question.results.filter((result) => {
				return top.includes(result.count);
			});

			new_results.push(new_question);
		});

		ls_results = [...new_results];
	}

	onMount(loadCallback);
	afterNavigate(loadCallback);
</script>

<div class="relative m-5">
	<h1 class="mb-7 text-5xl dark:text-white">
		Ergebnisse |
		{#if type === "student"}
			Schüler
		{:else}
			Lehrer
		{/if}
	</h1>
	<div class="sticky top-0 z-20 flex w-full justify-center bg-white bg-white p-3 p-3">
		<input
			class="range-lg mx-72 my-4 w-full cursor-pointer text-white"
			type="range"
			min="1"
			max="10"
			bind:value={result_count}
			on:change={() => {
				limit_results();
			}}
		/>
	</div>
	<div class="flex flex-row flex-wrap justify-center">
		{#each ls_results as { question, results }}
			<div class="m-2 md:w-4/6 2xl:w-2/6 3xl:w-1/6">
				<Evaluation answers={results} {question} />
			</div>
		{/each}
	</div>
	<button
		class="mt-2 w-full rounded-xl bg-slate-500 p-4 text-lg text-white hover:cursor-pointer"
		type="submit"
		on:click={() => {
			downloadText(
				JSON.stringify(
					ls_results.map((pair) => {
						return { answers: pair.results, question: pair.question };
					}),
				),
				`results_${type}.json`,
			);
		}}
	>
		Ergebnisse exportieren
	</button>
</div>
