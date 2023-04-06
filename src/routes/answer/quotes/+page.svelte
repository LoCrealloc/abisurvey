<script lang="ts">
	import { onMount } from "svelte";
	import { order_possiblities } from "$lib/client/utils";
	import type { Possibility } from "$lib/common_types";
	import { scale } from "svelte/transition";

	import { edited, actionCall } from "$lib/client/stores/refresh";

	export let data;

	interface Quote {
		id?: number;
		course: string;
		parts: Array<QuotePart>;
	}

	interface QuotePart {
		id?: number;
		content: string;
		answerPossibilityId?: number;
	}

	let possibilities: Array<Possibility>;
	let possibilityMap: Record<string, string> = {};

	onMount(() => {
		data.possibilities.forEach((possibility: Possibility) => {
			possibilityMap[possibility.id] = `${possibility.forename} ${possibility.surname}`;
		});
		possibilities = data.possibilities;

		quotes = data.quotes;

		console.log(quotes);
	});

	let quotes: Array<Quote> = [];

	let current: null | string | number = null;

	let new_lines: Array<QuotePart> = [{ content: "" }];
	let new_quote: Quote = {
		course: "",
		parts: new_lines,
	};

	let searchResults: Array<Possibility> = [];

	function search(term: string) {
		edited.set(true);

		searchResults = order_possiblities(term, [...possibilities]).slice(0, 4);
	}

	function addNewPart() {
		new_lines.push({
			content: "",
		});
		new_lines = [...new_lines];
	}

	function addPart(quoteIndex: number) {
		quotes[quoteIndex].parts.push({
			content: "",
		});
		quotes = [...quotes];
	}

	function getNameFor(id: number): string {
		if (id !== null && id.toString() in possibilityMap) {
			return possibilityMap[id];
		}

		return "";
	}

	function addQuote() {
		quotes.push(new_quote);

		new_lines = [{ content: "" }];
		new_quote = {
			course: "",
			parts: new_lines,
		};

		quotes = [...quotes];
	}

	function removeQuote(index: number) {
		quotes.splice(index, 1);
		quotes = [...quotes];
	}

	function removeNewPart(index: number) {
		if (new_lines.length > 1) {
			new_lines.splice(index, 1);
			new_lines = [...new_lines];
		}
	}

	function removePart(quoteIndex: number, partIndex: number) {
		if (quotes[quoteIndex].parts.length > 1) {
			quotes[quoteIndex].parts.splice(partIndex, 1);
			quotes = [...quotes];
		}
	}
</script>

<div class="mx-2 lg:mx-8 xs:m-0">
	<h1 class="my-5 text-5xl dark:text-white">Zitate</h1>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Zitat hinzufügen</h2>
	<form on:submit|preventDefault={addQuote}>
		<fieldset
			class="mt-2 rounded-xl border-4 border-solid border-slate-900 bg-slate-500 dark:bg-sky-700"
		>
			<legend class="mx-5 w-72 text-left text-slate-900 md:w-96"
				><input
					required
					type="text"
					placeholder="Kurs.."
					bind:value={new_quote.course}
					class="h-full w-full rounded-xl border-2 border-solid border-slate-900 p-2"
				/></legend
			>
			<div class="mt-2">
				{#each new_lines as line, i}
					<div
						class="mx-1 mb-1 grid grid-cols-3 grid-rows-2 place-items-stretch gap-2 rounded-lg bg-slate-600 p-3 sm:grid-cols-6 sm:grid-rows-1"
					>
						<div class="col-span-3 w-full place-self-center sm:col-span-3">
							<input
								required
								class="w-full rounded-lg p-3 text-black"
								value={line.content}
								type="text"
								on:input|preventDefault={(event) => {
									line.content = event.target.value;
								}}
								placeholder="Neues Zitat.."
							/>
						</div>
						<div class="relative col-span-2 w-full place-self-center sm:col-span-2">
							<input
								required
								class="w-full w-full rounded-lg p-3 text-black"
								on:focusin={(event) => {
									current = `new-${i}`;
									search(event.target.value);
								}}
								on:focusout={(event) => {
									current = null;
									if (line.answerPossibilityId !== undefined) {
										event.target.value = getNameFor(line.answerPossibilityId);
									} else {
										event.target.value = "";
									}
								}}
								on:input|preventDefault={(event) => search(event.target.value)}
								value={line.answerPossibilityId !== undefined
									? getNameFor(line.answerPossibilityId)
									: ""}
								placeholder="Sprecher.."
							/>
							{#if current === `new-${i}`}
								<div
									transition:scale
									class="absolute left-2 top-12 z-10 w-fit rounded-xl rounded-t-none border-2 border-solid border-slate-900 bg-white"
								>
									{#each searchResults as possibility}
										<button
											class="w-full border-b-2 p-1.5 text-left text-lg hover:bg-slate-500"
											on:click={(event) => {
												event.preventDefault();
											}}
											on:mousedown={() => {
												line.answerPossibilityId = possibility.id;
											}}
										>
											{`${possibility.forename} ${possibility.surname}`}
										</button>
										<br />
									{/each}
								</div>
							{/if}
						</div>
						<div class="col-span-1 w-full place-self-center">
							<button
								class="w-full rounded-xl bg-white p-3 hover:bg-red-600"
								on:click|preventDefault={() => {
									removeNewPart(i);
								}}
							>
								Löschen
							</button>
						</div>
					</div>
				{/each}
			</div>
			<div class="grid gap-4 p-3">
				<div class="w-full">
					<button
						class="w-full rounded-xl bg-white p-3 hover:bg-sky-600 dark:hover:bg-slate-500"
						on:click|preventDefault={() => {
							addNewPart();
						}}
					>
						Neue Zeile
					</button>
				</div>
				<div>
					<input
						type="submit"
						class="w-full cursor-pointer rounded-xl bg-white p-3 hover:bg-sky-600 dark:hover:bg-slate-500"
						value="Hinzufügen"
					/>
				</div>
			</div>
		</fieldset>
	</form>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Eingereichte Zitate</h2>
	<form
		method="POST"
		on:submit={() => {
			actionCall.set(true);
		}}
	>
		{#each quotes as quote, i}
			<fieldset
				class="mt-2 rounded-xl border-4 border-solid border-slate-900 bg-slate-500 dark:bg-sky-700"
			>
				<legend class="mx-5 w-72 text-left text-slate-900 md:w-96"
					><input
						required
						type="text"
						placeholder="Kurs.."
						bind:value={quote.course}
						name="course"
						class="h-full w-full rounded-xl border-2 border-solid border-slate-900 p-2"
					/></legend
				>
				<div class="mt-2">
					{#each quote.parts as part, j}
						<div
							class="mx-1 mb-1 grid grid-cols-3 grid-rows-2 place-items-stretch gap-2 rounded-lg bg-slate-600 p-3 sm:grid-cols-6 sm:grid-rows-1"
						>
							<div class="col-span-3 w-full place-self-center sm:col-span-3">
								<input
									required
									type="text"
									name="content"
									value={part.content}
									class="w-full rounded-lg p-3"
								/>
							</div>
							<div class="relative col-span-2 w-full place-self-center sm:col-span-2">
								<input
									required
									class="w-full rounded p-3 text-black"
									on:focusin={(event) => {
										current = `${i}-${j}`;
										search(event.target.value);
									}}
									on:focusout={(event) => {
										current = null;
										if (part.answerPossibilityId !== undefined) {
											event.target.value = getNameFor(part.answerPossibilityId);
										} else {
											event.target.value = "";
										}
									}}
									on:input|preventDefault={(event) => search(event.target.value)}
									value={part.answerPossibilityId !== undefined
										? getNameFor(part.answerPossibilityId)
										: ""}
								/>
								{#if part.answerPossibilityId !== undefined}
									<input
										type="text"
										value={part.answerPossibilityId}
										hidden
										name="possibility-id"
									/>
								{/if}
								{#if current === `${i}-${j}`}
									<div
										transition:scale
										class="absolute z-10 w-fit rounded-xl rounded-t-none border-2 border-solid border-slate-900 bg-white"
									>
										{#each searchResults as possibility}
											<button
												class="w-full border-b-2 p-1.5 text-left text-lg hover:bg-slate-500"
												on:click={(event) => {
													event.preventDefault();
												}}
												on:mousedown={() => {
													part.answerPossibilityId = possibility.id;
												}}
											>
												{`${possibility.forename} ${possibility.surname}`}
											</button>
											<br />
										{/each}
									</div>
								{/if}
							</div>
							<div class="col-span-1 w-full place-self-center">
								<button
									class="w-full rounded-xl bg-white p-3 hover:bg-red-600"
									on:click|preventDefault={() => {
										removePart(i, j);
									}}
								>
									Löschen
								</button>
							</div>
						</div>
						{#if part.id !== undefined}
							<input hidden type="text" name="part-id" value={part.id} />
						{/if}
					{/each}
				</div>
				<div class="grid gap-4 p-3">
					<div class="w-full">
						<button
							class="w-full rounded-xl bg-white p-3 hover:bg-sky-600 dark:hover:bg-slate-500"
							on:click|preventDefault={() => {
								addPart(i);
							}}
						>
							Neue Zeile
						</button>
					</div>
					<div>
						<input
							on:click|preventDefault={() => removeQuote(i)}
							type="submit"
							class="w-full cursor-pointer rounded-xl bg-white p-3 hover:bg-red-600"
							value="Löschen"
						/>
					</div>
				</div>
				{#if quote.id !== undefined}
					<input hidden type="text" name="id" value={quote.id} />
				{/if}
			</fieldset>
		{/each}
		<input
			class="mt-8 w-full cursor-pointer rounded-xl bg-slate-500 p-4 text-lg text-white hover:bg-sky-700 hover:bg-sky-600 dark:bg-sky-700 dark:hover:bg-slate-500"
			type="submit"
			value="Absenden"
		/>
	</form>
</div>
