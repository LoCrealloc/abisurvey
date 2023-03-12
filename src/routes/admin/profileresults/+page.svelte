<script lang="ts">
	import { onMount } from "svelte";

	import Profile from "$lib/client/components/Profile.svelte";

	interface Attribute {
		answer: string;
		userId: number;
		profileFieldId: number;
	}

	interface Picture {
		userId: number;
		image: string;
	}

	interface User {
		id: number;
		name: string;
	}

	interface Field {
		id: number;
		field: string;
	}

	export let data;

	let attributes: Record<string, Record<string, string> | Record<string, never>> = {};
	let pictures: Record<string, Array<string>> = {};
	let users: Array<User> = [];
	let fields: Array<Field> = [];

	onMount(() => {
		data.users.forEach((user: User) => {
			attributes[user.id.toString()] = {};
			pictures[user.id.toString()] = [];
		});

		data.attributes.forEach((attribute: Attribute) => {
			attributes[attribute.userId.toString()][attribute.profileFieldId.toString()] =
				attribute.answer;
		});

		data.pictures.forEach((picture: Picture) => {
			pictures[picture.userId].push(picture.image);
		});

		users = data.users;
		fields = data.fields;
	});
</script>

{#each users as { name, id }}
	<Profile
		user={name}
		attributes={attributes[id.toString()]}
		{fields}
		pictures={pictures[id.toString()]}
	/>
{/each}
