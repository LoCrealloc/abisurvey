<script lang="ts">
	let code = "";
	let email = "";
	let gender = "";

	$: hideEmail = code.length == 8;
	$: hideGender = email !== "";
	$: hidePrivacy = gender !== "";
</script>

<div class="text-center dark:text-white ">
	<h1 class="my-5 text-3xl">Willkommen bei der Abizeitungs-Umfrage</h1>
	<h3 class="m-2 text-lg">Bitte gib unten den Code ein, den du von unserem Team erhalten hast</h3>
	<div class="mx-1">
		<form method="POST">
			<div>
				<input
					class="my-1 w-80 rounded-xl rounded-xl border-2 border-solid border-sky-500 bg-white p-3 text-xl text-black"
					type="text"
					placeholder="Code eingeben.."
					name="code"
					bind:value={code}
					required
				/>
			</div>
			{#if hideEmail}
				<div>
					<input
						class="my-1 w-80 rounded-xl border-2 border-solid border-sky-500 bg-white p-3 text-xl text-black"
						type="email"
						placeholder="Email-Adresse eingeben..."
						name="email"
						bind:value={email}
						required
					/>
				</div>
			{/if}
			{#if hideGender}
				<div>
					<label class="mr-3 text-xl" for="gender">Geschlecht:</label>
					<select
						class="my-1 w-44 rounded-xl border-2 border-solid border-sky-500 bg-white p-3 text-xl text-black"
						id="gender"
						name="gender"
						required
						bind:value={gender}
					>
						<option value="m"> Männlich </option>
						<option value="w"> Weiblich </option>
						<option value="d"> Divers </option>
					</select>
				</div>
			{/if}
			{#if hidePrivacy}
				<div class="my-1">
					<input
						id="accept_privacy"
						type="checkbox"
						required
						name="accept_privacy"
						class="mr-2 scale-150"
					/>
					<label for="accept_privacy"
						>Ich habe die <a class="text-sky-500 hover:underline" href="/policy"
							>Datenschutzrichtlinie</a
						> gelesen und akzeptiere sie.</label
					>
				</div>
				<div>
					<input
						class="my-1 w-80 rounded-xl rounded-xl border-2 border-solid border-sky-500 bg-sky-500 p-3 text-xl text-slate-900"
						type="submit"
						value="Registrieren"
					/>
				</div>
			{/if}
		</form>
		<div class="my-3 text-slate-900 dark:text-white">
			Du hast bereits einen Account? <a class="text-sky-500 hover:underline" href="/login">Login</a>
		</div>
	</div>
</div>
