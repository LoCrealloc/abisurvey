<script lang="ts">
	import { onMount } from "svelte";

	export let data;

	let privay_policy = "";

	onMount(() => {
		privay_policy = data.privacy;
	});
</script>

<div class="mx-2 lg:mx-8 xs:m-0">
	<h1 class="my-5 text-5xl dark:text-white">Richtlinien</h1>
	<div
		class="mt-2 rounded-xl border-4 border-solid border-slate-900 bg-slate-500 p-5 dark:bg-sky-700"
	>
		<h1 class="my-2 text-xl text-white">Datenschutzrichtlinie</h1>
		<textarea
			disabled
			class="w-full rounded-lg bg-white p-3 text-black"
			value={privay_policy}
			oninput="this.style.height = ''; this.style.height = this.scrollHeight +'px'"
		/>
	</div>
</div>
