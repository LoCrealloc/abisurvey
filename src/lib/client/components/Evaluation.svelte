<script lang="ts">
	interface Answer {
		possibility: string;
		count: number;
	}

	import { LayerCake, Html } from "layercake";

	import CirclePack from "./layercake_components/Circlepack.svelte";

	export let answers: Array<Answer> = [];
	export let question = "";
</script>

<fieldset class="rounded-xl border-4 border-solid border-slate-900 bg-slate-500 dark:bg-sky-700">
	<legend
		class="mx-5 w-72 rounded-xl border-2 border-solid border-slate-900 bg-white p-2 text-left text-slate-900 md:w-96"
		>{question}</legend
	>
	<div class="chart-container">
		<LayerCake padding={{ top: 10, right: 10, bottom: 10, left: 10 }} data={answers}>
			<Html>
				<CirclePack
					idKey={"possibility"}
					valueKey={"count"}
					fill="#0ea5e9"
					stroke="#000000"
					textColor="#61004e"
					strokeWidth={1}
					spacing={3}
				/>
			</Html>
		</LayerCake>
	</div>
</fieldset>

<style>
	/*
    The wrapper div needs to have an explicit width and height in CSS.
    It can also be a flexbox child or CSS grid element.
    The point being it needs dimensions since the <LayerCake> element will
    expand to fill it.
  */
	.chart-container {
		width: 100%;
		height: 40em;
	}
</style>
