<script>
	import { Stretch, BarLoader } from 'svelte-loading-spinners';
	import Icon from 'mdi-svelte';
	import { mdiAlertBox } from '@mdi/js';

	let users = [];
	let connections = [];

	let creating = false;
	let groupName = '';
	let administerSystem = false;
	let createUsers = false;
	let createGroups = false;
	let createConnections = false;

	$: administerSystem, checkAll(administerSystem);

	function checkAll(bool) {
		if (bool) {
			createUsers = true;
			createGroups = true;
			createConnections = true;
		} else {
			createUsers = false;
			createGroups = false;
			createConnections = false;
		}
	}

	async function getUsers() {
		const response = await fetch('/api/users');
		if (!response.ok) {
			return Promise.reject();
		}
		users = (await response.json()).map((username) => {
			return { name: username, checked: false };
		});
	}
	async function getConnections() {
		const response = await fetch('/api/connections');
		if (!response.ok) {
			return Promise.reject();
		}
		connections = await response.json();
	}

	async function createGroup() {
		if (groupName == '') {
			alert('Group must have a name');
			return;
		}
		creating = true;

		const checkedUsers = users.filter( user => user.checked);
		const checkedConnections = connections.filter( connection => connection.checked);

		const response = await fetch('/api/groups', {
			method: 'POST',
			body: JSON.stringify({
				groupName,
				permissions: {
					administer: administerSystem,
					createUsers,
					createGroups,
					createConnections
				},
				users: checkedUsers,
				connections: checkedConnections
			})
		})

		if (!response.ok) {
			creating = false;
			alert('Failed to create group')
			return;
		}
		location.assign('/admin/groups');
	}
</script>

<div class="w-full h-[calc(100vh-100px) flex flex-col items-center py-3 px-4 ">
	<p class="font-semibold text-xl mb-5">New Group</p>
	<div
		class="w-full grid grid-cols-12 gap-5 justify-start p-4 border-2 border-blue-900 rounded bg-gray-200"
	>
		<div class="col-span-4 flex flex-col p-3 h-[270px]">
			<div class="flex gap-3 items-center">
				<label class="font-semibold text-gray-700 whitespace-nowrap" for="groupName"
					>Group Name:</label
				>
				<input bind:value={groupName} class="rounded" id="groupName" type="text" />
			</div>
			<div class="w-[200px] flex flex-col mt-6">
				<p class="font-semibold text-lg underline-offset-4 underline">Permissions</p>
				<div class="flex justify-between items-center">
					<p class="font-semibold text-gray-700 whitespace-nowrap">Administer System</p>
					<input class="w-[20px] h-[20px]" bind:checked={administerSystem} type="checkbox" />
				</div>
				<div class="flex justify-between items-center">
					<p class="font-semibold text-gray-700 whitespace-nowrap">Create Users</p>
					<input class="w-[20px] h-[20px]" bind:checked={createUsers} type="checkbox" />
				</div>
				<div class="flex justify-between items-center">
					<p class="font-semibold text-gray-700 whitespace-nowrap">Create Groups</p>
					<input class="w-[20px] h-[20px]" bind:checked={createGroups} type="checkbox" />
				</div>
				<div class="flex justify-between items-center">
					<p class="font-semibold text-gray-700 whitespace-nowrap">Create Connections</p>
					<input class="w-[20px] h-[20px]" bind:checked={createConnections} type="checkbox" />
				</div>
			</div>
		</div>
		<div class="col-span-8 flex flex-col p-3 h-[270px]">
			<p class="font-semibold text-lg w-full text-center pb-2">Users</p>
			{#await getUsers()}
				<div class="w-full h-full flex  justify-center items-center">
					<Stretch size="50" color="#1E3A8A" unit="px" />
				</div>
			{:then}
				<div class="w-full h-full overflow-y-auto border-2 border-blue-900 p-2 rounded">
					{#each users as user, i}
						<div class="w-full h-[40px] border-b border-blue-900 flex items-center gap-1">
							<input bind:checked={user.checked} class="w-[20px] h-[20px]" type="checkbox" />
							<p class="p-1 font-semibold text-gray-700">{user.name}</p>
						</div>
					{/each}
				</div>
			{:catch}
				<div
					class="w-full h-[50px] text-red-400 font-semibold flex justify-center items-center gap-2"
				>
					<Icon path={mdiAlertBox} />
					Error loading users
				</div>
			{/await}
		</div>
		<div class="col-span-12 flex flex-col p-3 h-[270px]">
			<p class="font-semibold text-lg w-full text-center pb-2">
				Connections
			</p>
			{#await getConnections()}
				<div class="w-full h-full flex  justify-center items-center">
					<Stretch size="50" color="#1E3A8A" unit="px" />
				</div>
			{:then}
				<div class="w-full h-full overflow-y-auto  border-2 border-blue-900 p-2 rounded">
					{#each connections as connection, i}
						<div class="w-full h-[40px] border-b border-blue-900 flex items-center gap-1">
							<input bind:checked={connection.checked} class="w-[20px] h-[20px]" type="checkbox" />
							<p class="p-1 font-semibold text-gray-700">{connection.name}</p>
						</div>
					{/each}
				</div>
			{:catch}
				<div
					class="w-full h-[50px] text-red-400 font-semibold flex justify-center items-center gap-2"
				>
					<Icon path={mdiAlertBox} />
					Error loading connections
				</div>
			{/await}
		</div>
	</div>
	<div class="w-full flex items-start justify-center">
		<div class="flex justify-between w-fit h-full">
			<button
				on:click={createGroup}
				class="p-[6px] mt-3 m-1 bg-blue-700 text-white hover:bg-blue-500 w-[120px] h-9 rounded-sm duration-100 focus:outline-0"
				disabled={creating}
			>
				{#if !creating}
					<p class="font-semibold text-sm">Create Group</p>
				{:else}
					<div class="flex justify-center">
						<BarLoader size="50" color="#ffffff" unit="px" duration="2s" />
					</div>
				{/if}
			</button>
			<button
				on:click={() => location.assign('/admin/groups')}
				class="p-[6px] mt-3 m-1 bg-blue-700 text-white hover:bg-blue-500 w-[120px] h-9 rounded-sm duration-100 focus:outline-0"
				disabled={creating}
			>
				<p class="font-semibold text-sm">Cancel</p>
			</button>
		</div>
	</div>
</div>
