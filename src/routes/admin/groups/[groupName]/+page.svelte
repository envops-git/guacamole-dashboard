<script>
	import { Stretch, BarLoader } from 'svelte-loading-spinners';
	import Icon from 'mdi-svelte';
	import { mdiAlertBox } from '@mdi/js';

	export let data;

	let users = [];
	let connections = [];

	let updating = false;
	let deleting = false;

	let groupName = data.groupName;
	let administerSystem = data.permissions.includes('ADMINISTER') ? true : false;
	let createUsers = data.permissions.includes('CREATE_USER') ? true : false;
	let createGroups = data.permissions.includes('CREATE_USER_GROUP') ? true : false;
	let createConnections = data.permissions.includes('CREATE_CONNECTION') ? true : false;

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
			if (data.users.includes(username)) {
				return { name: username, checked: true };
			} else {
				return { name: username, checked: false };
			}
		});
	}
	async function getConnections() {
		const response = await fetch('/api/connections');
		if (!response.ok) {
			return Promise.reject();
		}
		connections = await response.json();
		connections.forEach((connection) => {
			if (data.connections.includes(connection.id)) {
				connection.checked = true;
			}
		});
	}

	async function deleteGroup() {
		deleting = true;

    const response = await fetch('/api/groups', {
			method: 'DELETE',
      body: groupName
		});

		if (!response.ok) {
			updating = false;
			alert('Failed to update group');
			return;
		}
		location.assign('/admin/groups');
	}

	async function updateGroup() {
		updating = true;

    const checkedUsers = users.filter((user) => user.checked);
		const checkedConnections = connections.filter((connection) => connection.checked);

		const response = await fetch('/api/groups', {
			method: 'PUT',
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
		});

		if (!response.ok) {
			updating = false;
			alert('Failed to update group');
			return;
		}
		location.assign('/admin/groups');
	}

</script>

<div class="w-full h-[calc(100vh-100px) flex flex-col items-center py-3 px-4 ">
	<div
		class="w-full grid grid-cols-12 gap-5 justify-start p-4 border-2 border-blue-900 rounded bg-gray-200"
	>
		<div class="flex gap-3 items-center col-span-12">
			<label class="font-semibold text-gray-700 whitespace-nowrap" for="groupName"
				>Group Name:</label
			>
			<input
				disabled
				bind:value={groupName}
				class="rounded font-semibold text-gray-700 text-[16px]"
				id="groupName"
				type="text"
			/>
		</div>
		<div class="col-span-4 flex flex-col w-full h-full">
			<p class="font-semibold text-lg w-full text-center">Permissions</p>
			<div class="w-full h-full border-2 border-blue-900 rounded p-2 flex flex-col mt-2">
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
		<div class="col-span-8 flex flex-col w-full h-full">
			<p class="font-semibold text-lg w-full text-center pb-2">Users</p>
			<div class="w-full h-[220px] overflow-y-auto border-2 border-blue-900 p-2 rounded">
				{#await getUsers()}
					<div class="w-full h-full flex  justify-center items-center">
						<Stretch size="50" color="#1E3A8A" unit="px" />
					</div>
				{:then}
					{#each users as user, i}
						<div class="w-full h-[40px] border-b border-blue-900 flex items-center gap-1">
							<input bind:checked={user.checked} class="w-[20px] h-[20px]" type="checkbox" />
							<p class="p-1 font-semibold text-gray-700">{user.name}</p>
						</div>
					{/each}
				{:catch}
					<div
						class="w-full h-[50px] text-red-400 font-semibold flex justify-center items-center gap-2"
					>
						<Icon path={mdiAlertBox} />
						Error loading users
					</div>
				{/await}
			</div>
		</div>
		<div class="col-span-12 flex flex-col w-full h-full">
			<p class="font-semibold text-lg w-full text-center pb-2">Connections</p>
			<div class="w-full h-[220px] overflow-y-auto  border-2 border-blue-900 p-2 rounded">
				{#await getConnections()}
					<div class="w-full h-full flex  justify-center items-center">
						<Stretch size="50" color="#1E3A8A" unit="px" />
					</div>
				{:then}
					{#each connections as connection, i}
						<div class="w-full h-[40px] border-b border-blue-900 flex items-center gap-1">
							<input bind:checked={connection.checked} class="w-[20px] h-[20px]" type="checkbox" />
							<p class="p-1 font-semibold text-gray-700">{connection.name}</p>
						</div>
					{/each}
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
	</div>
	<div class="w-full flex items-start justify-center">
		<div class="flex justify-between w-fit h-full">
			<button
				on:click={updateGroup}
				class="p-[6px] mt-3 m-1 bg-blue-700 text-white hover:bg-blue-500 w-[120px] h-9 rounded-sm duration-100 focus:outline-0"
				disabled={updating}
			>
				{#if !updating}
					<p class="font-semibold text-sm">Update Group</p>
				{:else}
					<div class="flex justify-center">
						<BarLoader size="50" color="#ffffff" unit="px" duration="2s" />
					</div>
				{/if}
			</button>
			<button
				on:click={() => location.assign('/admin/groups')}
				class="p-[6px] mt-3 m-1 bg-blue-700 text-white hover:bg-blue-500 w-[120px] h-9 rounded-sm duration-100 focus:outline-0"
				disabled={updating}
			>
				<p class="font-semibold text-sm">Cancel</p>
			</button>
			<button
				on:click={deleteGroup}
				class="p-[6px] mt-3 m-1 bg-red-700 text-white hover:bg-red-500 w-[120px] h-9 rounded-sm duration-100 focus:outline-0"
				disabled={deleting}
			>
				{#if !deleting}
					<p class="font-semibold text-sm">Delete Group</p>
				{:else}
					<div class="flex justify-center">
						<BarLoader size="50" color="#ffffff" unit="px" duration="2s" />
					</div>
				{/if}
			</button>
		</div>
	</div>
</div>
