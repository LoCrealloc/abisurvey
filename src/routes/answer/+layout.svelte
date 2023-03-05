<script lang="ts">
	let show = false;
</script>

<nav
	class="flex w-full flex-row flex-wrap items-center border-b-2 border-slate-900 bg-slate-700 p-1 pl-8 pr-3 text-lg text-white opacity-95"
>
	<button
		on:click={() => {
			show = !show;
		}}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			fill="currentColor"
			class="bi bi-list scale-150"
			viewBox="0 0 16 16"
		>
			<path
				fill-rule="evenodd"
				d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
			/>
		</svg>
	</button>
	<div class="m-4 ml-auto rounded-full bg-slate-900 p-4 text-white">
		<a class="hover:text-sky-500 hover:underline" href="/logout">Logout</a>
	</div>
	{#if show}
		<br />
		<div class="flex w-full flex-col">
			<div class="mb-4">
				<a class="hover:text-white hover:underline" href="/answer/survey">Umfrage</a>
			</div>
			<div class="mb-4">
				<a class="hover:text-white hover:underline" href="/answer/profiles">Steckbrief</a>
			</div>
		</div>
	{/if}
</nav>

<slot />
