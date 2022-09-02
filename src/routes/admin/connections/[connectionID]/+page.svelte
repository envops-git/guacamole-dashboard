<script>
	import { BarLoader } from 'svelte-loading-spinners';
	import { page } from '$app/stores';

	export let data;

	let updating = false;
	let deleting = false;

	let connectionName = data.connectionName;
	let protocol = data.protocol;

	let hostname = data.hostname;

	let port = data.port || '';

	let sshPublicKey = data.sshPublicKey || '';
	let sshPrivateKey = data.sshPrivateKey || '';
	let sshPassphrase = data.sshPassphrase || '';

	let enableSFTP = data.enableSFTP;
	let sftpHostname = data.sftpHostname || '';
	let sftpPort = data.sftpPort;

	let sftpRootDirectory = data.sftpRootDirectory || '';
	let sftpUsername = data.sftpUsername || '';
	let sftpPassword = data.sftpPassword || '';
	let sftpKeepAlive = data.sftpKeepAlive || '';

	let username = data.username || '';
	let password = data.password || '';
	let domain = data.domain || '';
	let securityMode = data.securityMode || 'any';

	let disableAuth = data.disableAuth;
	let ignoreCert = data.ignoreCert;

	let maxNumberConnections = data.maxNumberConnections || undefined;
	let maxNumberConnectionsPerUser = data.maxNumberConnectionsPerUser || undefined;

	async function updateConnection() {
		updating = true;

		const response = await fetch('/api/connections', {
			method: 'PUT',
			body: JSON.stringify({
				connectionID: $page.params.connectionID,
				connectionName,
				protocol,
				hostname,
				port,
				sshPublicKey,
				sshPrivateKey,
				sshPassphrase,
				username,
				password,
				domain,
				securityMode,
				disableAuth,
				ignoreCert,
				maxNumberConnections,
				maxNumberConnectionsPerUser,
				enableSFTP,
				sftpHostname,
				sftpPort,
				sftpKeepAlive,
				sftpRootDirectory,
				sftpUsername,
				sftpPassword
			})
		});

		if (!response.ok) {
			updating = false;
			alert('Failed to update connection');
			return;
		}
		location.assign('/admin/connections');
	}

	async function deleteConnection() {
		deleting = true;

		const response = await fetch('/api/connections', {
			method: 'DELETE',
			body: $page.params.connectionID
		});

		if (!response.ok) {
			deleting = false;
			alert('Failed to delete connection');
			return;
		}
		location.assign('/admin/connections');
	}

</script>

<div class="w-full h-[calc(100vh-100px) flex flex-col items-center py-3 px-4">
	<div class="w-[850px] h-full p-4 px-6 border-2 border-blue-900 rounded bg-gray-200">
		<div class="w-full flex justify-start gap-5 pb-4 border-b-2 border-gray-300">
			<div class="flex gap-3 items-center">
				<p class="font-semibold text-gray-700 w-[158px]">Connection Name:</p>
				<input
					bind:value={connectionName}
					class="rounded font-semibold text-[15px] text-gray-700 w-[200.5px]"
					type="text"
					disabled
				/>
			</div>
			<div class="flex gap-3 items-center w-fit h-full">
				<p class="font-semibold text-gray-700 text-sm w-[157px]">Protocol:</p>
				<select
					class="font-semibold text-gray-700 w-[200px]"
					bind:value={protocol}
					name="protocol"
					id="protocol"
					disabled
				>
					<option class="font-semibold text-gray-700" value="VNC">VNC</option>
					<option class="font-semibold text-gray-700" value="RDP">RDP</option>
					<option class="font-semibold text-gray-700" value="SSH">SSH</option>
				</select>
			</div>
		</div>
		<div class="w-full h-full pt-3">
			<p class="font-semibold text-gray-700 whitespace-nowrap w-[160px] pb-2">Concurrency Limits</p>
			<div class="w-full flex justify-start gap-5 pb-4 border-b-2 border-gray-300">
				<div class="flex gap-3 items-center">
					<p class="font-semibold text-sm text-gray-700 w-[160px]">
						Maximum number of connections:
					</p>
					<input
						bind:value={maxNumberConnections}
						class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
						type="number"
					/>
				</div>
				<div class="flex gap-3 items-center">
					<p class="font-semibold text-gray-700 w-[160px] text-sm">
						Maximum number of connections per user:
					</p>
					<input
						bind:value={maxNumberConnectionsPerUser}
						class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
						type="number"
					/>
				</div>
			</div>

			<p class="font-semibold text-gray-700 whitespace-nowrap w-[160px] pb-2 pt-3">Parameters</p>
			<div class="w-full flex justify-start gap-5 pb-4">
				<div class="flex gap-3 items-center">
					<p class="font-semibold text-sm text-gray-700 w-[160px]">Hostname:</p>
					<input
						bind:value={hostname}
						class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
						type="text"
					/>
				</div>
				<div class="flex gap-3 items-center">
					<p class="font-semibold text-gray-700 w-[160px] text-sm">Port:</p>
					<input
						bind:value={port}
						class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
						type="number"
					/>
				</div>
			</div>
			{#if protocol == 'SSH'}
				<div class="w-full flex justify-start gap-5 pb-4">
					<div class="flex gap-3 items-center">
						<p class="font-semibold text-gray-700 w-[158px] text-sm">Public Key (Base64):</p>
						<input
							bind:value={sshPublicKey}
							class="rounded font-semibold text-[15px] text-gray-700 w-[590px]"
							type="text"
						/>
					</div>
				</div>
			{/if}
			<p class="font-semibold text-gray-700 text-[15px] whitespace-nowrap w-[160px] pb-2 pt-3">
				Authentication
			</p>
			<div class="w-full flex justify-start gap-5 pb-4">
				<div class="flex gap-3 items-center">
					<p class="font-semibold text-sm text-gray-700 w-[160px]">Username:</p>
					<input
						bind:value={username}
						class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
						type="text"
					/>
				</div>
				<div class="flex gap-3 items-center">
					<p class="font-semibold text-gray-700 w-[160px] text-sm">Password:</p>
					<input
						bind:value={password}
						class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
						type="password"
					/>
				</div>
			</div>
			{#if protocol == 'RDP'}
				<div class="w-full flex justify-start gap-5 pb-4">
					<div class="flex gap-3 items-center">
						<p class="font-semibold text-sm text-gray-700 w-[160px]">Domain:</p>
						<input
							bind:value={domain}
							class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
							type="text"
						/>
					</div>
					<div class="flex gap-3 items-center w-fit h-full">
						<p class="font-semibold text-gray-700 text-sm w-[158px]">Security mode:</p>
						<select
							class="font-semibold text-gray-700 w-[200px]"
							bind:value={securityMode}
							name="securityMode"
							id="securityMode"
						>
							<option class="font-semibold text-gray-700" value="any">Any</option>
							<option class="font-semibold text-gray-700" value="rdp">RDP Encryption</option>
							<option class="font-semibold text-gray-700" value="tls">TLS Encryption</option>
						</select>
					</div>
				</div>

				<div class="w-full flex justify-start gap-5 pb-4 ">
					<div class="flex gap-3 items-center w-[370px] ">
						<p class="font-semibold text-sm text-gray-700 w-[160px]">Disable Authentication</p>
						<input bind:checked={disableAuth} type="checkbox" class="w-5 h-5" />
					</div>
					<div class="flex gap-3 items-center">
						<p class="font-semibold text-sm text-gray-700 w-[160px]">Ignore server certificate</p>
						<input class="w-5 h-5" bind:checked={ignoreCert} type="checkbox" />
					</div>
				</div>
			{/if}
			{#if protocol == 'SSH'}
				<div class="w-full flex justify-start gap-5 pb-4">
					<div class="flex gap-3 items-center">
						<p class="font-semibold text-gray-700 w-[158px] text-sm">Private Key:</p>
						<input
							bind:value={sshPrivateKey}
							class="rounded font-semibold text-[15px] text-gray-700 w-[590px]"
							type="text"
						/>
					</div>
				</div>
				<div class="w-full flex justify-start gap-5 pb-4">
					<div class="flex gap-3 items-center">
						<p class="font-semibold text-sm text-gray-700 w-[160px]">Passphrase:</p>
						<input
							bind:value={sshPassphrase}
							class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
							type="text"
						/>
					</div>
				</div>
			{/if}
			<p class="font-semibold text-gray-700 text-[15px] whitespace-nowrap w-[160px] pb-2 pt-2">
				SFTP
			</p>
			<div class="w-full flex justify-start gap-5 pb-4 ">
				<div class="flex gap-3 items-center w-[370px] ">
					<p class="font-semibold text-sm text-gray-700 w-[160px]">Enable SFTP</p>
					<input bind:checked={enableSFTP} type="checkbox" class="w-5 h-5" />
				</div>
			</div>
			{#if protocol == 'RDP' || protocol == 'VNC'}
				<div class="w-full flex justify-start gap-5 pb-4">
					<div class="flex gap-3 items-center">
						<p class="font-semibold text-sm text-gray-700 w-[160px]">Hostname:</p>
						<input
							bind:value={sftpHostname}
							class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
							type="text"
						/>
					</div>
					<div class="flex gap-3 items-center">
						<p class="font-semibold text-gray-700 w-[160px] text-sm">Port:</p>
						<input
							bind:value={sftpPort}
							class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
							type="number"
						/>
					</div>
				</div>
				<div class="w-full flex justify-start gap-5 pb-4">
					<div class="flex gap-3 items-center">
						<p class="font-semibold text-sm text-gray-700 w-[160px]">Username:</p>
						<input
							bind:value={sftpUsername}
							class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
							type="text"
						/>
					</div>
					<div class="flex gap-3 items-center">
						<p class="font-semibold text-gray-700 w-[160px] text-sm">Password:</p>
						<input
							bind:value={sftpPassword}
							class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
							type="password"
						/>
					</div>
				</div>
				<div class="w-full flex justify-start gap-5 pb-4">
					<div class="flex gap-3 items-center">
						<p class="font-semibold text-gray-700 w-[158px] text-sm">Public Key (Base64):</p>
						<input
							bind:value={sshPublicKey}
							class="rounded font-semibold text-[15px] text-gray-700 w-[590px]"
							type="text"
						/>
					</div>
				</div>
				<div class="w-full flex justify-start gap-5 pb-4">
					<div class="flex gap-3 items-center">
						<p class="font-semibold text-gray-700 w-[158px] text-sm">Private Key:</p>
						<input
							bind:value={sshPrivateKey}
							class="rounded font-semibold text-[15px] text-gray-700 w-[590px]"
							type="text"
						/>
					</div>
				</div>
				<div class="w-full flex justify-start gap-5 pb-4">
					<div class="flex gap-3 items-center">
						<p class="font-semibold text-sm text-gray-700 w-[160px]">Passphrase:</p>
						<input
							bind:value={sshPassphrase}
							class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
							type="text"
						/>
					</div>
					<div class="flex gap-3 items-center">
						<p class="font-semibold text-gray-700 w-[160px] text-sm">SFTP Keep-alive interval:</p>
						<input
							bind:value={sftpKeepAlive}
							class="rounded font-semibold text-[15px] text-gray-700 max-w-[200px]"
							type="number"
						/>
					</div>
				</div>
			{/if}
			<div class="w-full flex justify-start gap-5 pb-4">
				<div class="flex gap-3 items-center">
					<p class="font-semibold text-gray-700 w-[158px] text-sm">File browser root directory:</p>
					<input
						bind:value={sftpRootDirectory}
						class="rounded font-semibold text-[15px] text-gray-700 w-[590px]"
						type="text"
					/>
				</div>
			</div>
		</div>
	</div>
	<div class="w-full flex items-start justify-center">
		<div class="flex justify-between w-fit h-full">
			<button
				on:click={updateConnection}
				class="p-[6px] mt-3 m-1 bg-blue-700 text-white hover:bg-blue-500 w-[150px] h-9 rounded-sm duration-100 focus:outline-0"
				disabled={updating}
			>
				{#if !updating}
					<p class="font-semibold text-sm">Update Connection</p>
				{:else}
					<div class="flex justify-center">
						<BarLoader size="50" color="#ffffff" unit="px" duration="2s" />
					</div>
				{/if}
			</button>
			<button
				on:click={() => location.assign('/admin/connections')}
				class="p-[6px] mt-3 m-1 bg-blue-700 text-white hover:bg-blue-500 w-[150px] h-9 rounded-sm duration-100 focus:outline-0"
				disabled={updating}
			>
				<p class="font-semibold text-sm">Cancel</p>
			</button>
			<button
				on:click={deleteConnection}
				class="p-[6px] mt-3 m-1 bg-red-700 text-white hover:bg-red-500 w-[150px] h-9 rounded-sm duration-100 focus:outline-0"
				disabled={deleting}
			>
				{#if !deleting}
					<p class="font-semibold text-sm">Delete Connection</p>
				{:else}
					<div class="flex justify-center">
						<BarLoader size="50" color="#ffffff" unit="px" duration="2s" />
					</div>
				{/if}
			</button>
		</div>
	</div>
</div>

<style>
	select {
		transition-duration: 100ms;
		border-width: 2px;
		border-style: solid;
		border-color: var(--blue-700);
		border-radius: 4px;
		padding-left: 6px;
		padding-right: 6px;
		padding-top: 4px;
		padding-bottom: 4px;
		min-height: 40px;
		font-size: 14px;
		background-color: transparent;
	}

	select:focus {
		outline-width: 0px;
		border-style: solid;
		border-color: var(--blue-500);
		border-radius: 4px;
	}

	select:hover {
		border-style: solid;
		border-color: var(--blue-500);
		border-radius: 4px;
	}
</style>
