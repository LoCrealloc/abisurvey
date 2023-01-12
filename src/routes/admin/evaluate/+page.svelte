<script lang="ts">
	import { onMount } from "svelte";

	export let data;

	onMount(() => {
		console.log(data.answers);
	});
</script>

<h1>Hi</h1>
