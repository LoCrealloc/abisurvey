<script lang="ts">
	import { onMount } from "svelte";

	export let data;

	let codes = [];

	onMount(() => {
		codes = data.codes;
	});
</script>

<div class="m-5">
	<h1 class="text-5xl dark:text-white">Code-Manager</h1>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Codes generieren</h2>
	<form method="POST" action="?/generate">
		<div
			class="grid grid-cols-7 grid-rows-1 place-items-center rounded-xl bg-slate-500 p-5 text-white"
		>
			<div class="col-span-1">
				<p>Generiere</p>
			</div>
			<div class="col-span-1">
				<input class="w-full rounded-lg p-3 text-black" type="number" value="0" min="0" max="200" />
			</div>
			<div class="col-span-2">
				<p>neue Zugangscodes (momentan: {codes.length})</p>
			</div>
			<div class="col-span-3 w-full">
				<input
					type="submit"
					value="Generieren"
					class="w-full rounded-xl bg-white p-3 text-slate-900"
				/>
			</div>
		</div>
	</form>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Aktuelle Codes</h2>
	{#if codes.length > 0}
		{#each codes as code}
			<form method="POST" action="?/delete">
				<div
					class="grid grid-cols-3 grid-rows-1 place-items-center rounded-xl bg-slate-500 p-5 text-white"
				>
					<div class="col-span-1">
						<p class="w-full rounded-lg p-3 text-black">
							{code}
						</p>
					</div>
					<div class="col-span-2 w-full">
						<input
							type="submit"
							value="Entfernen"
							class="w-full rounded-xl bg-white p-3 text-slate-900"
						/>
					</div>
				</div>
			</form>
		{/each}
	{:else}
		<h1 class="m-8 text-center">Es sind noch keine Codes vorhanden</h1>
	{/if}
</div>
