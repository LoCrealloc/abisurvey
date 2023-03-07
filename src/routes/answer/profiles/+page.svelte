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

	interface Picture {
		id?: number;
		image: string;
	}

	export let data;

	let fields: Array<Field> = [];

	let attributes: Record<string, Attribute> = {};

	let images: Record<string, Picture> = {};

	let picture_count = 0;

	let inputs;

	onMount(() => {
		fields = data.fields;

		data.attributes.forEach((attribute) => {
			attributes[attribute.profileFieldId.toString()] = {
				id: attribute.id,
				answer: attribute.answer,
			};
		});

		picture_count = data.picture_count;

		inputs = Array(picture_count);

		data.pictures.forEach((picture, i) => {
			images[i.toString()] = {
				id: picture.id,
				image: picture.image,
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

	function getImageB64(image: Blob, num: number) {
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			const str_num = num.toString();

			if (str_num in images) {
				images[str_num]["image"] = e.target.result.toString();
			} else {
				images[str_num] = {
					image: e.target.result.toString(),
				};
			}
		};
	}

	function calculate_rows(value: string): number {
		let calculated_rows = (value.match(/\n/g) || []).length + 1;
		return calculated_rows < 5 ? calculated_rows : 5;
	}
</script>

<div class="mx-2 lg:mx-8 xs:m-0">
	<h1 class="my-5 text-5xl dark:text-white">Steckbrief</h1>
	<form class="my-5" method="POST" action="?/fields">
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
								event.target.rows = calculate_rows(value);
							}}
							class="m-5 mx-auto block w-11/12 rounded-lg border-solid p-2 text-start"
							placeholder="Deine Antwort.."
							name="answer"
							rows={calculate_rows(getAttributeFor(id))}
							value={getAttributeFor(id)}
							maxlength="500"
						/>

						{#if id.toString() in attributes && "id" in attributes[id.toString()]}
							<input hidden name="attributeId" value={attributes[id.toString()].id} />
						{/if}
						<input hidden name="fieldId" value={id} />
					</div>
				</fieldset>
			{/each}
			<div class="mx-auto grid max-w-4xl place-items-center gap-2 p-8 sm:grid-cols-2">
				{#each [...Array(picture_count).keys()] as i}
					<div class="relative inline-block w-full">
						{#if i in images}
							<button
								class="absolute right-2 top-2 z-10 origin-top-right rounded-full bg-white p-2 text-xl opacity-75"
								on:click|preventDefault={() => {
									delete images[i];
									images = structuredClone(images);
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									class="scale-150"
									viewBox="0 0 16 16"
								>
									<path
										d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
									/>
								</svg>
							</button>
							<img
								src={images[i]["image"]}
								alt={`Nr. ${i}`}
								on:click|preventDefault={() => inputs[i].click()}
								on:keypress={() => {
									return 0;
								}}
								class="w-full cursor-pointer rounded-xl border-4 border-slate-900 dark:border-sky-700"
							/>
						{:else}
							<button
								class="w-full rounded-xl bg-slate-500 p-5 text-lg text-white hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-slate-500"
								on:click|preventDefault={() => inputs[i].click()}>Bild hochladen..</button
							>
						{/if}
						<input
							class="hidden"
							type="file"
							accept=".png,.jpg"
							bind:this={inputs[i]}
							on:change={(event) => {
								getImageB64(event.target.files[0], i);
							}}
						/>
						{#if i.toString() in images}
							<input hidden type="text" value={JSON.stringify(images[i.toString()])} name="image" />
						{/if}
					</div>
				{/each}
			</div>
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
