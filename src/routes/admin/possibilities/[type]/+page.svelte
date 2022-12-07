<script lang="ts">
	import { onMount } from "svelte";
	import { afterNavigate } from "$app/navigation";

	export let data;

	let possibilities = [];

	function loadCallback() {
		possibilities = data.possibilities.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});

		console.log(possibilities);
	}

	onMount(loadCallback);

	afterNavigate(loadCallback);

	let new_possibility = "";
	let new_possibility_sex = "";

	function add_possibility() {
		possibilities.push({
			name: new_possibility,
			sex: new_possibility_sex,
		});
		possibilities = [...possibilities].sort((a, b) => {
			return a.name.localeCompare(b.name);
		});

		new_possibility = "";
		new_possibility_sex = "";
	}

	function remove_possibility(index: number) {
		possibilities.splice(index, 1);
		possibilities = [...possibilities];
	}
</script>

<div class="m-5">
	<h1 class="text-5xl dark:text-white">
		Möglichkeiten-Manager |
		{#if data.type === "student"}
			Schüler
		{:else}
			Lehrer
		{/if}
	</h1>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Möglichkeit hinzufügen</h2>
	<form on:submit|preventDefault={add_possibility}>
		<div
			class="grid grid-cols-5 grid-rows-1 place-items-stretch rounded-xl bg-slate-500 p-5 text-white"
		>
			<div class="col-span-2">
				<input
					bind:value={new_possibility}
					class="w-full rounded-lg p-3 text-black"
					type="text"
					placeholder="Neue Antwortmöglichkeit.."
				/>
			</div>
			<div class="col-span-2 place-self-center">
				<label class="mr-3" for="sex_new">Geschlecht</label>
				<select
					bind:value={new_possibility_sex}
					class="w-36 rounded-xl bg-white p-3 text-slate-900"
					id="sex_new"
					name="sex"
					required
				>
					<option value="m"> Männlich </option>
					<option value="w"> Weiblich </option>
				</select>
			</div>
			<div class="place-self-center">
				<input type="submit" value="Hinzufügen" class="rounded-xl bg-white p-3 text-slate-900" />
			</div>
		</div>
	</form>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Aktuelle Möglichkeiten</h2>
	<form class="my-5" method="POST">
		{#if possibilities.length > 0}
			{#each possibilities as possibility, i}
				<div
					class="my-2 grid grid-cols-5 grid-rows-1 place-items-stretch rounded-xl bg-slate-500 p-5 text-white"
				>
					<div class="col-span-2">
						<input
							on:input|preventDefault={(event) => {
								possibility.name = event.target.value;
							}}
							value={possibility.name}
							class="w-full rounded-lg p-3 text-black"
							type="text"
							placeholder="Neue Möglichkeit.."
							name="name"
						/>
					</div>
					<div class="col-span-2 place-self-center">
						<label class="mr-3" for={`sex-${i}`}>Geschlecht</label>
						<select
							value={possibility.sex}
							class="w-36 rounded-xl bg-white p-3 text-slate-900"
							id={`sex-${i}`}
							name="sex"
							required
						>
							<option value="m"> Männlich </option>
							<option value="w"> Weiblich </option>
						</select>
					</div>
					<div class="place-self-center">
						<button
							class="rounded-xl bg-white p-3 text-slate-900"
							on:click|preventDefault={() => remove_possibility(i)}>Entfernen</button
						>
					</div>
					{#if possibility.id}
						<input hidden name="id" value={possibility.id} />
					{/if}
				</div>
			{/each}
		{:else}
			<h1 class="m-8 text-center">Es sind noch keine Möglichkeiten vorhanden</h1>
		{/if}
		<input
			class="mt-8 w-full rounded-xl bg-slate-500 p-4 text-lg text-white"
			type="submit"
			value="Möglichkeiten aktualisieren"
		/>
	</form>
</div>
