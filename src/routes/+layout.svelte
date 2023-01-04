<script>
	import { userId } from "$lib/client/stores/auth";
	export let data;

	import "../app.css";

	$: userId.set(data.userId);
</script>

<div class="h-full dark:bg-slate-900">
	<slot />
</div>
