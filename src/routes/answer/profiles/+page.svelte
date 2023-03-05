<script lang="ts">
	import { onMount } from "svelte";

	interface Attribute {
		id?: number;
		answer: string;
	}

	interface Field {
		id: number;
		field: string;
	}

	export let data;

	let fields: Array<Field> = [];

	let attributes: Record<string, Attribute> = {};

	onMount(() => {
		fields = data.fields;

		data.attributes.forEach((attribute) => {
			attributes[attribute.profileFieldId.toString()] = {
				id: attribute.id,
				answer: attribute.answer,
			};
		});
	});

	function getAttributeFor(id: number) {
		if (id.toString() in attributes) {
			return attributes[id].answer;
		}
		return "";
	}

	function setAttributeFor(id: number, value: string) {
		const str_id = id.toString();
		if (str_id in attributes) {
			attributes[str_id].answer = value;
		} else {
			attributes[str_id] = {
				answer: value,
			};
		}
	}
</script>

<div class="mx-2 lg:mx-8 xs:m-0">
	<h1 class="my-5 text-5xl dark:text-white">Steckbrief</h1>
	<form class="my-5" method="POST">
		{#if fields.length > 0}
			{#each fields as { field, id }}
				<fieldset
					class="mt-2 rounded-xl border-4 border-solid border-slate-900 bg-slate-500 dark:bg-sky-700"
				>
					<legend
						class="mx-5 w-72 rounded-xl border-2 border-solid border-slate-900 bg-white p-2 text-left text-slate-900 md:w-96"
						>{field}</legend
					>
					<div>
						<textarea
							on:input|preventDefault={(event) => {
								let value = event.target.value;
								setAttributeFor(id, value);
								let calculated_rows = (value.match(/\n/g) || []).length + 1;
								event.target.rows = calculated_rows < 5 ? calculated_rows : 5;
							}}
							class="m-5 mx-auto block w-11/12 rounded-lg border-solid p-2 text-start"
							placeholder="Deine Antwort.."
							name="answer"
							rows="1"
							value={getAttributeFor(id)}
						/>

						{#if id.toString() in attributes && "id" in attributes[id.toString()]}
							<input hidden name="attributeId" value={attributes[id.toString()].id} />
						{/if}
						<input hidden name="fieldId" value={id} />
					</div>
				</fieldset>
			{/each}
		{:else}
			<h1 class="m-8 text-center dark:text-white">Es sind noch keine Fragen vorhanden.</h1>
		{/if}
		<input
			class="mt-8 w-full cursor-pointer rounded-xl bg-slate-500 p-4 text-lg text-white hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-slate-500"
			type="submit"
			value="Absenden"
		/>
	</form>
</div>
