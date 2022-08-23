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
			on:click={() => (clipboardVisible = !clipboardVisible)}
			class="m-3 mb-0 h-8 flex justify-center items-center rounded-md hover:bg-blue-800 hover:cursor-pointer duration-100 {!clipboardVisible
				? ''
				: 'bg-blue-800'}"
		>
			<Icon path={mdiClipboardOutline} />
			{#if clipboardVisible}
				<div class='relative left-16 -top-4 w-[300px] h-[300px] flex flex-col items-center gap-2'>
					<p class='font-semibold text-[15px]'>Session Clipboard Data</p>
					<textarea name="sessionClipboard" id="sessionClipboard" cols="20" rows="5" class='overflow-y-scroll'></textarea>
				</div>
			{/if}
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
