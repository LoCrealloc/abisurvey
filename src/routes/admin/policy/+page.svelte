<script lang="ts">
	import { onMount, tick } from "svelte";

	export let data;

	let policy_text = "";

	let policy_area;

	onMount(async () => {
		policy_text = data.privacy;
		await tick();

		policy_area.style.height = policy_area.scrollHeight + "px";
	});
</script>

<div class="m-5">
	<h1 class="text-5xl dark:text-white">Richtlinien-Editor</h1>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Datenschutzrichtlinie</h2>
	<form method="POST">
		<div class="rounded-xl bg-slate-500 p-5">
			<textarea
				name="privacy"
				class="w-full rounded-lg p-3 text-black"
				placeholder="Neue Richtlinie.."
				bind:this={policy_area}
				bind:value={policy_text}
				rows="5"
				oninput="this.style.height = ''; this.style.height = this.scrollHeight +'px'"
			/>
		</div>
		<input
			class="mt-8 w-full cursor-pointer rounded-xl bg-slate-500 p-4 text-lg text-white"
			type="submit"
			value="Felder aktualisieren"
		/>
	</form>
</div>
