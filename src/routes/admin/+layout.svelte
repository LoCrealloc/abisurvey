<script lang="ts">
	import { isLoggedIn } from "$lib/client/stores/auth";
	export let data;

	$: isLoggedIn.set(data.loggedIn);
</script>

{#if data.loggedIn}
	<nav class="grid w-full bg-slate-800 p-9 text-white">
		<div class="w-full gap-8">
			<a class="p-5 hover:text-sky-500 hover:underline" href="/admin">Home</a>
			<a class="p-5 hover:text-sky-500 hover:underline" href="/admin/questions">Fragen</a>
			<a class="p-5 hover:text-sky-500 hover:underline" href="/admin/possibilities"
				>Antwortmöglichkeiten</a
			>
			<a class="p-5 hover:text-sky-500 hover:underline" href="/admin/users">Nutzer</a>
			<a class="p-5 hover:text-sky-500 hover:underline" href="/admin/codes">Codes</a>
			<a class="p-5 hover:text-sky-500 hover:underline" href="/admin/settings">Einstellungen</a>
		</div>
	</nav>
	<slot />
{:else}
	<div class="absolute flex h-full w-full items-center justify-center overflow-hidden">
		<a href="/login">
			<div class=" rounded-xl bg-slate-900 p-8 text-center dark:bg-white">
				<h3 class="text-xl text-white dark:text-black">Du bist nicht eingeloggt!</h3>
				<h3 class="text-lg text-sky-500 hover:underline">Login</h3>
			</div></a
		>
	</div>
{/if}
