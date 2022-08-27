<script>
	import Icon from 'mdi-svelte';
	import { mdiEye, mdiEyeOff } from '@mdi/js';
	import { BarLoader } from 'svelte-loading-spinners';

	let showPassword = false;

	let password = '';
	let username = '';

	let usernameError = false;
	let passwordError = false;
	let loginError = false;

	let loginInProgress = false;

	async function handleLogin() {
		loginError = false;
		usernameError = false;
		passwordError = false;
		let error = false;
		if (username == '') {
			error = true;
			usernameError = true;
		}
		if (password == '') {
			error = true;
			passwordError = true;
		}
		if (error) {
			return;
		}

		loginInProgress = true;

		try {
			const response = await fetch('/api/login', {
				method: 'POST',
				body: JSON.stringify({
					username,
					password
				})
			});
			if (response.status == 500) {
				loginInProgress = false;
				alert('Something went wrong, please try again');
				return;
			}
			if (response.status == 403) {
				loginInProgress = false;
				loginError = true;
				setTimeout(() => {
					loginError = false;
				}, 3000);
				return;
			}

			if (response.status == 201) {
				location.assign('/');
			}
		} catch (error) {
			console.log(error);
			loginInProgress = false;
			showError = true;
			errorMsg = 'Internal error';
			return;
		}
	}
</script>

<div
	class="w-full h-[calc(100vh-50px)] flex flex-col justify-center items-center pb-20 from-blue-700 to-blue-900 bg-gradient-to-b"
>
	<div class="w-[250px] h-[300px] rounded-sm bg-white border">
		<form
			class="w-full flex flex-col items-center px-[20px] py-3"
			id="login"
			on:submit|preventDefault={handleLogin}
		>
			<p class="w-full flex justify-start text-black text-2xl font-semibold select-none">Login</p>
			<div class="w-[100%] mt-8" on:click={() => (usernameError = false)}>
				<input
					class=" duration-100 {usernameError
						? 'border-2 border-red-300 hover:border-red-300 '
						: ''}"
					disabled={loginInProgress}
					id="username"
					name="username"
					type="text"
					placeholder="Username"
					bind:value={username}
				/>
				<div class="h-4 w-full">
					{#if usernameError}
						<p class="text-xs text-red-400">Required</p>
					{/if}
				</div>
			</div>
			<div
				on:click={() => (passwordError = false)}
				class="w-[100%] mt-3 flex flex-nowrap items-center"
			>
				{#if showPassword}
					<input
						class=" duration-100 {passwordError
							? 'border-2 border-red-300 hover:border-red-300 '
							: ''}"
						id="password"
						name="password"
						disabled={loginInProgress}
						type="text"
						placeholder="Password"
						bind:value={password}
					/>
				{:else}
					<input
						class=" duration-100 {passwordError
							? 'border-2 border-red-300 hover:border-red-300 '
							: ''}"
						id="password"
						name="password"
						disabled={loginInProgress}
						type="password"
						placeholder="Password"
						bind:value={password}
					/>
				{/if}
				<div
					on:click={() => {
						if (loginInProgress) {
							return;
						}
						showPassword = !showPassword;
						passwordError = false;
					}}
					class="w-[30px] ml-[-40px] z-10 hover:cursor-pointer flex justify-center items-center hover:opacity-60 rounded-lg duration-150"
				>
					<Icon path={showPassword ? mdiEyeOff : mdiEye} />
				</div>
			</div>
			<div class="h-4 w-full">
				{#if passwordError}
					<p class="text-xs text-red-400">Required</p>
				{/if}
			</div>
			<button
				type="submit"
				class="p-[6px] mt-3 m-1 bg-blue-700 text-white hover:bg-blue-500 w-full h-9 rounded-sm duration-100 focus:outline-0"
				disabled={loginInProgress}
			>
				{#if !loginInProgress}
					<p class="font-semibold text-sm">Login</p>
				{:else}
					<div class="flex justify-center">
						<BarLoader size="50" color="#ffffff" unit="px" duration="2s" />
					</div>
				{/if}
			</button>
			<div class="h-4 w-full">
				{#if loginError}
					<p class="text-xs text-red-400">Wrong username or password</p>
				{/if}
			</div>
		</form>
	</div>
</div>
