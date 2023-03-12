<script lang="ts">
	import { onMount } from "svelte";

	interface profileField {
		id?: number;
		field: string;
	}

	export let data;

	let fields: Array<profileField> = [];

	let picture_count = 0;

	onMount(() => {
		fields = data.fields.map((field: profileField) => {
			return {
				id: field.id,
				field: field.field,
			};
		});

		picture_count = data.picture_count;
	});

	let new_field = "";

	$: new_profilefield = {
		field: new_field,
	};

	function add_field() {
		fields.push(new_profilefield);
		new_field = "";
		fields = [...fields];
	}

	function remove_field(event: Event, index: number) {
		event.preventDefault();
		fields.splice(index, 1);
		fields = [...fields];
	}
</script>

<div class="m-5">
	<h1 class="text-5xl dark:text-white">Steckbrief-Manager</h1>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Bilderanzahl</h2>
	<form method="POST" action="?/count">
		<div
			class="grid grid-cols-5 grid-rows-1 place-items-stretch rounded-xl bg-slate-500 p-5 text-white"
		>
			<div class="col-span-4">
				<input
					bind:value={picture_count}
					class="w-full rounded-lg p-3 text-black"
					type="number"
					placeholder="Bilderanzahl.."
					name="count"
				/>
			</div>
			<div class="place-self-center">
				<input type="submit" value="Speichern" class="rounded-xl bg-white p-3 text-slate-900" />
			</div>
		</div>
	</form>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Feld hinzufügen</h2>
	<form on:submit|preventDefault={add_field}>
		<div
			class="grid grid-cols-5 grid-rows-1 place-items-stretch rounded-xl bg-slate-500 p-5 text-white"
		>
			<div class="col-span-4">
				<input
					bind:value={new_field}
					class="w-full rounded-lg p-3 text-black"
					type="text"
					placeholder="Neues Feld.."
				/>
			</div>
			<div class="place-self-center">
				<input type="submit" value="Hinzufügen" class="rounded-xl bg-white p-3 text-slate-900" />
			</div>
		</div>
	</form>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Aktuelle Felder</h2>
	<form class="my-5" method="POST" action="?/update">
		{#if fields.length > 0}
			{#each fields as field, i}
				<div
					class="my-2 grid grid-cols-5 grid-rows-1 place-items-stretch rounded-xl bg-slate-500 p-5 text-white"
				>
					<div class="col-span-4">
						<input
							on:input|preventDefault={(event) => {
								field.field = event.target.value;
							}}
							value={field.field}
							class="w-full rounded-lg p-3 text-black"
							type="text"
							placeholder="Neues Feld"
							name="field"
						/>
					</div>
					<div class="place-self-center">
						<button
							class="rounded-xl bg-white p-3 text-slate-900"
							on:click={(event) => remove_field(event, i)}>Entfernen</button
						>
					</div>
					{#if field.id}
						<input hidden name="id" value={field.id} />
					{/if}
				</div>
			{/each}
		{:else}
			<h1 class="m-8 text-center dark:text-white">Es sind noch keine Felder vorhanden.</h1>
		{/if}
		<input
			class="mt-8 w-full rounded-xl bg-slate-500 p-4 text-lg text-white"
			type="submit"
			value="Felder aktualisieren"
		/>
	</form>
</div>
