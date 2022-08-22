<script>
	import { Stretch } from 'svelte-loading-spinners';
	import { page } from '$app/stores';

	let connections = [];

	async function loadPage() {
		const response = await fetch('/api/connections/' + $page.data.userData.username);
		if (!response.ok) {
			return Promise.reject(response.status);
		}
		connections = await response.json();
	}
</script>

<div class="w-full h-full">
	{#await loadPage()}
		<div class="w-full h-fit flex flex-col justify-center items-center">
			<div class="w-full h-[calc(100vh/2-100px)]" />
			<Stretch size="50" color="#1E3A8A" unit="px" />
		</div>
	{:then}
		<div class="flex flex-col p-4">
			<p class="mt-4 text-2xl w-full bg-blue-900 text-white font-semibold rounded-t-md py-1 px-2">
				Connections
			</p>
			<div class="border-2 border-t-0 border-blue-900 p-2 rounded-b-md">
				<div class="flex flex-col gap-1">
					{#each connections as connection}
						<p
							on:click={() => location.assign(`/client/${connection.identifier}`)}
							class="font-semibold px-1 flex items-center rounded-sm hover:cursor-pointer hover:bg-[#eeeeee]"
						>
							{connection.name}
						</p>
					{/each}
				</div>
			</div>
		</div>
	{:catch status}
		<div />
	{/await}
</div>
