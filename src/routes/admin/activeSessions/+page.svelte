<script>
	import { onMount } from 'svelte';
	import { Stretch } from 'svelte-loading-spinners';
	import Icon from 'mdi-svelte';
	import { mdiAlertBox, mdiDelete } from '@mdi/js';

	let loading = true;
	let error = false;

	let activeConnections = [];

	onMount(async () => {
		try {
			const response = await fetch('/api/activeSessions');

			if (!response.ok) {
				console.log(response.status);
				error = true;
				loading = false;
				return;
			}

			activeConnections = await response.json();

			loading = false;
		} catch (err) {
			console.log(err);
			error = true;
			loading = false;
			return;
		}
	});

	async function disconnectChecked() {
    const deleteList = activeConnections.filter((connection) => {
      connection.checked == true;
    })
  }
</script>

<div class="w-full h-[calc(100vh-100px) flex flex-col items-center pt-6 px-4">
	<p class="font-semibold text-xl">Active Sessions</p>
	<div class="w-full h-fit mt-2 border-2 border-blue-900 rounded-md">
		<div class="w-full h-[50px] bg-blue-900 grid grid-cols-12">
			<div class="h-full col-span-1 w-[50px] p-[10px] flex justify-center items-center">
				<button
					class="bg-blue-400 w-full h-full text-white flex justify-center items-center rounded-[4px] hover:bg-blue-300 duration-100"
					on:click={disconnectChecked}
				>
					<Icon path={mdiDelete} />
				</button>
			</div>
			<div class="h-full w-full col-span-3 flex justify-center items-center">
				<p class="font-semibold text-white">Username</p>
			</div>
			<div class="h-full w-full col-span-4 flex justify-center items-center">
				<p class="font-semibold text-white">Connection Name</p>
			</div>
			<div class="h-full w-full col-span-4 flex justify-center items-center">
				<p class="font-semibold text-white">Active Since</p>
			</div>
		</div>
		{#if loading}
			<div class="w-full h-[100px] flex flex-col justify-center items-center">
				<Stretch size="50" color="#1E3A8A" unit="px" />
			</div>
		{:else if error}
			<div
				class="w-full h-[50px] text-red-400 font-semibold flex justify-center items-center gap-2"
			>
				<Icon path={mdiAlertBox} />
				Error loading active Connections
			</div>
		{:else if activeConnections.length}
			{#each activeConnections as connection, i}
				<div
					class="w-full min-h-[40px] {i == activeConnections.length - 1
						? ''
						: 'border-b-2'}  border-blue-900 bg-gray-200 grid grid-cols-12"
				>
					<div class="h-[40px] w-[50px] col-span-1 p-[10px] flex justify-center items-center">
            <input bind:checked={connection.checked} class='w-5 h-5' type="checkbox">
          </div>
					<div class="h-full w-full col-span-3 flex justify-center items-center">
						<p class="font-semibold text-gray-700">{connection.username}</p>
					</div>
					<div class="h-full w-full col-span-4 flex justify-center items-center">
						<p class="font-semibold text-gray-700">{connection.name}</p>
					</div>
					<div class="h-full w-full col-span-4 flex justify-center items-center">
						<p class="font-semibold text-gray-700">{new Date(connection.startDate).toDateString() + ', ' + new Date(connection.startDate).toTimeString().split('(')[0].split(' ')[0]}</p>
					</div>
				</div>
			{/each}
		{:else}
			<div
				class="w-full h-[50px] text-gray-700 font-semibold flex justify-center items-center gap-2"
			>
				No Active Sessions
			</div>
		{/if}
	</div>
</div>
