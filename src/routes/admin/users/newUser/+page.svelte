<script>
	import { Stretch, BarLoader } from 'svelte-loading-spinners';
	import Icon from 'mdi-svelte';
	import { mdiAlertBox } from '@mdi/js';

	let connections = [];

	let username = '';
	let password = '';
	let confirmPassword = '';

	let creating = false;
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

	async function getConnections() {
		const response = await fetch('/api/connections');
		if (!response.ok) {
			return Promise.reject();
		}
		connections = await response.json();
	}

	async function createUser() {
    if (username == '') {
      alert('username cant be empty');
      return;
    }
    if (password == '') {
      alert('password cant be empty');
      return;
    }
    if (password != confirmPassword) {
      alert('Passwords must match');
      return;
    }
    creating = true;
    const checkedConnections = connections.filter((connection) => connection.checked);
    const response = await fetch('/api/users', {
			method: 'POST',
			body: JSON.stringify({
				username,
        password,
				permissions: {
					administer: administerSystem,
					createUsers,
					createGroups,
					createConnections
				},
				connections: checkedConnections
			})
		});

		if (!response.ok) {
			creating = false;
			alert('Failed to create user');
			return;
		}
		location.assign('/admin/users');
  }
</script>

<div class="w-full h-[calc(100vh-100px) flex flex-col items-center py-3 px-4">
	<div
		class="w-full grid grid-cols-12 gap-5 justify-start p-4 border-2 border-blue-900 rounded bg-gray-200"
	>
		<div class="col-span-6 flex flex-col w-full h-full">
			<p class="font-semibold text-lg w-full text-center">User</p>
			<div class="w-full h-full border-2 border-blue-900 rounded p-3 gap-2 flex flex-col mt-2">
				<div class="flex gap-3 items-center">
					<p class="font-semibold text-gray-700 whitespace-nowrap w-[160px]"
						>Username:</p
					>
					<input
						bind:value={username}
						class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
						type="text"
					/>
				</div>
				<div class="flex gap-3 items-center">
					<p class="font-semibold text-gray-700 whitespace-nowrap w-[160px]"
						>Password:</p
					>
					<input
						bind:value={password}
						class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
						type="password"
					/>
				</div>
        <div class="flex gap-3 items-center">
					<p class="font-semibold text-gray-700 whitespace-nowrap w-[160px]"
						>Confirm Password:</p
					>
					<input
						bind:value={confirmPassword}
						class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
						type="password"
					/>
				</div>
			</div>
		</div>
		<div class="col-span-6 flex flex-col w-full h-full">
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
				on:click={createUser}
				class="p-[6px] mt-3 m-1 bg-blue-700 text-white hover:bg-blue-500 w-[120px] h-9 rounded-sm duration-100 focus:outline-0"
				disabled={creating}
			>
				{#if !creating}
					<p class="font-semibold text-sm">Create User</p>
				{:else}
					<div class="flex justify-center">
						<BarLoader size="50" color="#ffffff" unit="px" duration="2s" />
					</div>
				{/if}
			</button>
			<button
				on:click={() => location.assign('/admin/users')}
				class="p-[6px] mt-3 m-1 bg-blue-700 text-white hover:bg-blue-500 w-[120px] h-9 rounded-sm duration-100 focus:outline-0"
				disabled={creating}
			>
				<p class="font-semibold text-sm">Cancel</p>
			</button>
		</div>
	</div>
</div>
