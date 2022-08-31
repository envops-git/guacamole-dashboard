<script>
	import { onMount } from 'svelte';
	import { Stretch } from 'svelte-loading-spinners';
	import Icon from 'mdi-svelte';
	import { mdiAlertBox, mdiMagnify } from '@mdi/js';

	let loading = true;
	let error = false;

	let groups = [];
	let filteredGroups = [];

	onMount(async () => {
		try {
			const response = await fetch('/api/groups');

			if (!response.ok) {
				console.log(response.status);
				error = true;
				loading = false;
				return;
			}

			groups = await response.json();
			filterGroups('');
			loading = false;
		} catch (err) {
			console.log(err);
			error = true;
			loading = false;
			return;
		}
	});

	let searchValue = '';

	$: searchValue, filterGroups(searchValue);

	function filterGroups(searchValue) {
		if (searchValue == '') {
			filteredGroups = groups;
			return;
		}
		filteredGroups = groups.filter((groupName) => {
			return groupName.toLowerCase().includes(searchValue.toLowerCase());
		});
	}

	// async function disconnectChecked() {
	// 	const checkedConnections = activeConnections.filter((connection) => {
	// 		connection.checked == true;
	// 	});

	// 	const deleteList = checkedConnections.map((connection) => {
	// 		return connection.identifier;
	// 	});

	// 	const response = await fetch('/api/activeSessions', {
	// 		method: 'DELETE',
	// 		body: JSON.stringify(deleteList)
	// 	});

	// 	if (response.ok) {
	// 		activeConnections = activeConnections.filter((connection) => {
	// 			connection.checked != true;
	// 		});
	// 		return;
	// 	} else {
	// 		activeConnections.forEach((connection) => {
	// 			connection.checked = false;
	// 		})
	// 		alert('Failed to disconnect selected sessions');
	// 	}
	// }
</script>

<div class="w-full h-[calc(100vh-100px) flex flex-col items-center pt-6 px-4">
	<p class="font-semibold text-xl mb-5">Groups</p>
	<div class="w-full h-fit mt-2 border-2 border-blue-900 rounded-md bg-gray-200">
		<div class="w-full h-[40px] flex">
			<div class="flex justify-center items-center h-[40px] w-[40px] text-gray-700">
				<Icon path={mdiMagnify} />
			</div>
			<input
				bind:value={searchValue}
				placeholder="Filter by Group Name"
				class="border-0"
				type="text"
			/>
		</div>
		<div class="w-full h-[50px] bg-blue-900 flex items-center">
      <div class='w-[120px] h-full p-2'>
        <button
        on:click={() => location.assign('/admin/groups/newGroup')}
        class='border-2 border-white rounded w-full h-full hover:bg-blue-700 duration-100'>
          <p class='text-white font-semibold text-sm'> New Group </p>
        </button>
      </div>
			<div class="w-[calc(100%-120px)] flex justify-center items-center">
				<p class="font-semibold text-white pr-[120px]">Group Name</p>
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
				Error loading groups
			</div>
		{:else if groups.length}
			{#each filteredGroups as groupName, i}
				<button
					on:click={() => location.assign('/admin/groups/' + groupName)}
					class="w-full min-h-[40px] {i == filteredGroups.length - 1
						? ''
						: 'border-b-2'} hover:bg-gray-100 border-gray-300  flex justify-start pl-4 items-center duration-100"
				>
					<p class="font-semibold text-gray-700">{groupName}</p>
				</button>
			{/each}
		{:else}
			<div
				class="w-full h-[50px] text-gray-700 font-semibold flex justify-center items-center gap-2"
			>
				No Groups
			</div>
		{/if}
	</div>
</div>
