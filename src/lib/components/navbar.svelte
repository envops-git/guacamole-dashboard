<script>
	import { fade, fly } from 'svelte/transition';
	import { sidebarVisible } from '$lib/stores.js';
	import Icon from 'mdi-svelte';
	import { mdiMenu, mdiTriangleSmallDown, mdiAccount, mdiLogout } from '@mdi/js';
	import { page } from '$app/stores';

	let showDropdown = false;
	let dropdownWidth;

	async function handleLogout() {
		const response = await fetch('/api/logout');
		if (response.status == 204) {
			location.assign('/login');
		} else {
			alert('Something went wrong, please try again');
			return;
		}
	}
</script>

<header
	class="w-full shadow-md h-[50px] bg-blue-900 flex items-center px-4 justify-between border-b-2 border-white"
	id="nav"
>
	<div class="flex items-center">
		<slot name="brand">
			<p class="text-white font-semibold text-lg select-none">Access</p>
		</slot>
	</div>
	{#if $page.data.userData != undefined}
		<button
			bind:clientWidth={dropdownWidth}
			on:click={() => (showDropdown = !showDropdown)}
			class="w-fit min-w-[120px] flex justify-center items-center h-[48px] hover:bg-blue-800 pl-3 pr-1 duration-100"
		>
			<div class="flex gap-1 text-white">
				<p class="font-semibold">{$page.data.userData.username}</p>
				<Icon path={mdiTriangleSmallDown} />
			</div>
		</button>
	{/if}
	{#if showDropdown && dropdownWidth != undefined}
		<div
			transition:fade={{ duration: 100 }}
			style="width: {dropdownWidth}px ;"
			class="h-fit absolute right-[16px] top-[50px] z-10 bg-blue-900 border-2 border-t-0 border-white text-sm"
		>
			<button
				class="w-full h-[50px] hover:bg-blue-800 duration-100 flex justify-center items-center"
			>
				<div class="flex gap-1 text-white">
					<Icon path={mdiAccount} />
					<p class="font-semibold">Profile</p>
				</div>
			</button>
			<button
				on:click={handleLogout}
				class="w-full h-[50px] hover:bg-blue-800 duration-100 flex justify-center items-center"
			>
				<div class="flex gap-1 text-white">
					<Icon path={mdiLogout} />
					<p class=" font-semibold">Logout</p>
				</div>
			</button>
		</div>
	{/if}
</header>
