<script>
	import { onMount } from 'svelte';
	import Icon from 'mdi-svelte';
	import {
		mdiVolumeHigh,
		mdiVolumeOff,
		mdiArrowLeft,
		mdiMicrophone,
		mdiMicrophoneOff,
		mdiClipboardOutline
	} from '@mdi/js';

	export let data;

	let toolbarVisible = false;
	let soundEnabled = true;
	let microphoneEnabled = false;
	let clipboardVisible = false;

	function waitForElement(id, callback) {
		let poops = setInterval(function () {
			if (document.getElementById(id)) {
				clearInterval(poops);
				callback();
			}
		}, 100);
	}

	onMount(() => {
		waitForElement('connectionIFrame', () => {
			let iframe = document.getElementById('connectionIFrame');
			console.log(iframe)
			iframe.contentDocument.body.addEventListener('click', (e) => {
				console.log(e);
				toolbarVisible = false;
			});
		});
	});
</script>

<div
	class="z-10 absolute {toolbarVisible
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
		</div>
	</div>
</div>

<iframe
	id="connectionIFrame"
	class="h-[calc(100vh-50px)] w-screen"
	src={data.clientURL}
	title={data.name}
/>
