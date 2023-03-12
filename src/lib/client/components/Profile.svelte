<script lang="ts">
	interface Field {
		id: number;
		field: string;
	}

	export let user: string,
		fields: Array<Field>,
		attributes: Record<string, string>,
		pictures: Array<string>;
</script>

<div class="mx-2 lg:mx-8 xs:m-0">
	<fieldset
		class="my-2 w-full rounded-xl border-4 border-solid border-slate-900 bg-slate-500 dark:bg-sky-700"
	>
		<legend
			class="mx-5 w-72 rounded-xl border-2 border-solid border-slate-900 bg-white p-2 text-left text-slate-900 md:w-96"
			>{user}</legend
		>
		<div class="grid grid-cols-1 items-start md:grid-cols-3">
			{#each fields as { field, id }}
				{@const attribute = attributes[id.toString()]}

				<div class="m-2 flex flex-col">
					<h1 class="my-auto mt-0.5 ml-0.5 text-xl text-slate-900 dark:text-white">{field}</h1>
					{#if attribute !== undefined && attribute.trim() !== ""}
						<span
							class="border-1 break-all rounded-xl border-solid border-slate-900 bg-white p-2 text-left text-slate-900"
						>
							{attribute}
						</span>
					{:else}
						<span class="my-auto ml-0.5 text-sm opacity-90"> Keine Antwort</span>
					{/if}
				</div>
			{/each}
		</div>
		{#if pictures.length > 0}
			<div
				class="mx-auto grid max-w-4xl grid-flow-row place-items-center gap-2 p-8 sm:grid-flow-col"
			>
				{#each pictures as picture, i}
					<div class="relative inline-block w-full">
						<img
							src={picture}
							alt={`Nr. ${i}`}
							class="w-full rounded-xl border-4 border-slate-900 dark:border-sky-700"
							loading="lazy"
						/>
					</div>
				{/each}
			</div>
		{/if}
	</fieldset>
</div>
