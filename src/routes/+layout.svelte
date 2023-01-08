<script>
	import { userId } from "$lib/client/stores/auth";
	export let data;

	import "../app.css";
</script>

<div class="min-h-full">
	<slot />
</div>
<footer class="fixed bottom-0 grid w-full bg-slate-800 object-bottom p-9 text-white">
	<h3 class="text-center">
		Diese Webseite ist freie und quelloffene Software! <a
			class="text-blue-500 hover:underline"
			href="https://github.com/LoCrealloc/abisite">Schau dir unseren Code an!</a
		>
	</h3>
</footer>
