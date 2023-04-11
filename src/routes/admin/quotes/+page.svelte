<script lang="ts">
	import { onMount } from "svelte";
	import type { Possibility } from "$lib/common_types";

	export let data;

	interface Quote {
		id?: number;
		course: string;
		parts: Array<QuotePart>;
		user: string;
	}

	interface QuotePart {
		id?: number;
		content: string;
		answerPossibilityId?: number;
	}

	let possibilityMap: Record<string, string> = {};

	onMount(() => {
		data.possibilities.forEach((possibility: Possibility) => {
			possibilityMap[possibility.id] = `${possibility.forename} ${possibility.surname}`;
		});
		quotes = data.quotes;
	});

	let quotes: Array<Quote> = [];

	function getNameFor(id: number): string {
		if (id !== null && id.toString() in possibilityMap) {
			return possibilityMap[id];
		}

		return "";
	}
</script>

<div class="mx-2 lg:mx-8 xs:m-0">
	<h1 class="my-5 text-5xl dark:text-white">Zitate</h1>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Eingereichte Zitate</h2>
	{#if quotes.length > 0}
		{#each quotes as quote}
			<fieldset
				class="mt-2 rounded-xl border-4 border-solid border-slate-900 bg-slate-500 dark:bg-sky-700"
			>
				<legend class="mx-5 w-72 text-left text-slate-900 md:w-96"
					><input
						readonly
						type="text"
						placeholder="Kurs.."
						value={quote.course}
						class="w-full rounded-xl border-2 border-solid border-slate-900 p-2"
					/></legend
				>
				<div class="mt-2">
					{#each quote.parts as part}
						<div
							class="mx-1 mb-1 grid grid-cols-1 grid-rows-2 place-items-stretch gap-2 rounded-lg bg-slate-600 p-3 sm:grid-cols-4 sm:grid-rows-1"
						>
							<div class="col-span-1 w-full place-self-center sm:col-span-3">
								<input readonly type="text" value={part.content} class="w-full rounded-lg p-3" />
							</div>
							<div class="col-span-1 w-full place-self-center sm:col-span-1">
								<input
									readonly
									class="w-full rounded p-3 text-black"
									value={part.answerPossibilityId !== undefined
										? getNameFor(part.answerPossibilityId)
										: ""}
								/>
							</div>
						</div>
					{/each}
					<div class="my-2 grid grid-cols-1 grid-rows-1 justify-items-center">
						<h2 class="text-white">
							Eingereicht von <span class="text-lg text-teal-400">{quote.user}</span>
						</h2>
					</div>
				</div>
			</fieldset>
		{/each}
	{:else}
		<h1 class="m-8 text-center text-white">Es sind noch keine Fragen vorhanden.</h1>
	{/if}
</div>
