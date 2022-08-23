<script>
	import Icon from 'mdi-svelte';

	import {
		mdiVolumeHigh,
		mdiVolumeOff,
		mdiArrowLeft,
		mdiMicrophone,
		mdiMicrophoneOff,
		mdiClipboardOutline,
		mdiDownload,
		mdiUpload,
		mdiCogOutline,
		mdiTrashCanOutline
	} from '@mdi/js';

	export let clipboardData = '';
	export let toolbarVisible = false;
	export let soundEnabled = true;
	export let microphoneEnabled = false;
	export let clipboardVisible = false;
	export let downloadsVisible = false;
	export let uploadsVisible = false;
	export let settingsVisible = false;
	export let client;
</script>

<div
	class="z-10 absolute top-[50px] {toolbarVisible
		? 'left-0'
		: '-left-16'} w-16 h-[calc(100vh-50px)] flex items-center justify-center border-r-2 border-white bg-blue-900 transition-all"
>
	<div
		on:click={() => (toolbarVisible = !toolbarVisible)}
		class="absolute top-[calc(50vh-80px)] -right-[26px] h-20 w-6 border border-l-0 border-white bg-blue-900 rounded-r-md hover:cursor-pointer flex flex-col justify-center items-center gap-2"
	>
		<div class="w-1 h-1 bg-white rounded-sm" />
		<div class="w-1 h-1 bg-white rounded-sm" />
		<div class="w-1 h-1 bg-white rounded-sm" />
	</div>
	<div class="flex flex-col w-full h-fit text-white ">
		{#if clipboardVisible}
			<div
				class="absolute left-[78px] bottom-[16px] w-fit h-[300px] bg-white p-3 rounded-md flex flex-col items-center gap-2 z-0"
			>
				<button
					on:click={() => (clipboardVisible = false)}
					class="absolute top-3 right-3 text-gray-500 hover:text-gray-400 duration-100 font-semibold select-none"
				>
					X
				</button>
				<p class="font-semibold text-[15px] text-gray-900 select-none w-full text-center">
					Session Clipboard Data
				</p>
				<div class="flex gap-2">
					<div
						class="font-semibold text-[14px] text-white select-none rounded-sm bg-gray-300 p-1 flex gap-1 items-center"
					>
						<p class="p-1 pt-0 rounded-sm bg-gray-600">Shift</p>
						<p class="p-1 pt-0 rounded-sm bg-gray-600">+</p>
						<p class="p-1 pt-0 rounded-sm bg-gray-600">C</p>
					</div>
					<p class="font-semibold text-[14px] text-gray-700">to Copy</p>
				</div>
				<textarea
					bind:value={clipboardData}
					cols="40"
					rows="10"
					class="overflow-y-scroll focus:outline-none border-2 rounded-sm border-gray-900 text-gray-900"
				/>
			</div>
		{/if}
		<div
			on:click={() => (toolbarVisible = false)}
			class="m-3 mb-0 h-8 flex justify-center items-center rounded-md hover:bg-blue-800 hover:cursor-pointer duration-100"
		>
			<Icon path={mdiArrowLeft} />
		</div>
		<div
			on:click={() => (soundEnabled = !soundEnabled)}
			class="m-3 mb-0 h-8 flex justify-center items-center rounded-md hover:bg-blue-800 hover:cursor-pointer duration-100 {soundEnabled
				? ''
				: 'bg-blue-800'}"
		>
			<Icon path={soundEnabled ? mdiVolumeHigh : mdiVolumeOff} />
		</div>
		<div
			on:click={() => (microphoneEnabled = !microphoneEnabled)}
			class="m-3 mb-0 h-8 flex justify-center items-center rounded-md hover:bg-blue-800 hover:cursor-pointer duration-100 {microphoneEnabled
				? ''
				: 'bg-blue-800'}"
		>
			<Icon path={microphoneEnabled ? mdiMicrophone : mdiMicrophoneOff} />
		</div>
		<div
			class="m-3 mb-0 h-8 flex justify-center items-center rounded-md hover:bg-blue-800 duration-100 {!clipboardVisible
				? ''
				: 'bg-blue-800'}"
		>
			<button
				on:click={() => (clipboardVisible = !clipboardVisible)}
				class="w-[38px] h-[32px] flex items-center justify-center"
			>
				<Icon path={mdiClipboardOutline} />
			</button>
		</div>
		<div
			on:click={() => (downloadsVisible = !downloadsVisible)}
			class="m-3 mb-0 h-8 flex justify-center items-center rounded-md hover:bg-blue-800 hover:cursor-pointer duration-100 {!downloadsVisible
				? ''
				: 'bg-blue-800'}"
		>
			<Icon path={mdiDownload} />
		</div>
		<div
			on:click={() => (uploadsVisible = !uploadsVisible)}
			class="m-3 mb-0 h-8 flex justify-center items-center rounded-md hover:bg-blue-800 hover:cursor-pointer duration-100 {!uploadsVisible
				? ''
				: 'bg-blue-800'}"
		>
			<Icon path={mdiUpload} />
		</div>
		<div
			on:click={() => (settingsVisible = !settingsVisible)}
			class="m-3 mb-0 h-8 flex justify-center items-center rounded-md hover:bg-blue-800 hover:cursor-pointer duration-100 {!settingsVisible
				? ''
				: 'bg-blue-800'}"
		>
			<Icon path={mdiCogOutline} />
		</div>
		<div
			on:click={() => client.disconnect()}
			class="m-3 mb-0 h-8 flex justify-center items-center rounded-md hover:bg-blue-800 hover:cursor-pointer duration-100 text-red-800"
		>
			<Icon path={mdiTrashCanOutline} />
		</div>
	</div>
</div>
