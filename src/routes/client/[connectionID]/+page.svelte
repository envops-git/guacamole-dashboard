<script>
	import Icon from 'mdi-svelte';
	import { Stretch } from 'svelte-loading-spinners';
	import {
		mdiVolumeHigh,
		mdiVolumeOff,
		mdiArrowLeft,
		mdiMicrophone,
		mdiMicrophoneOff,
		mdiClipboardOutline
	} from '@mdi/js';
	import Guacamole from 'guacamole-common-js';

	export let data;

	let toolbarVisible = false;
	let soundEnabled = true;
	let microphoneEnabled = false;
	let clipboardVisible = false;

	let loaded = false;
	let scale = 1;
	let client;
	let tunnel;

	let displayHeight;
	let displayWidth;

	let initialWidth;
	let initialHeight;

	async function loadPage() {
		try {
			const response = await fetch('/api/connections/token/' + data.connectionID);

			if (!response.ok) {
				console.log(response.status);
				location.assign('/');
			}
			const token = await response.text();

			tunnel = new Guacamole.WebSocketTunnel('wss://test.envops.com/tunnel');
			client = new Guacamole.Client(tunnel);
			document.getElementById('display').appendChild(client.getDisplay().getElement());
			client.connect(
				'token=' + token + '&width=' + displayWidth + '&height=' + (displayHeight - 50)
			);
			initialWidth = displayWidth;
			initialHeight = displayHeight;
			client.onerror = (error) => {
				console.log(error);
				location.assign('/');
			};

			let mouse = new Guacamole.Mouse(client.getDisplay().getElement());

			mouse.onmousedown = mouse.onmouseup = (state) => client.sendMouseState(state);
			mouse.onmousemove = function (mouseState) {
				mouseState.x = mouseState.x * scale;
				mouseState.y = mouseState.y * scale;
				client.sendMouseState(mouseState);
			};
			let keyboard = new Guacamole.Keyboard(document);

			keyboard.onkeydown = function (keysym) {
				client.sendKeyEvent(1, keysym);
			};

			keyboard.onkeyup = function (keysym) {
				client.sendKeyEvent(0, keysym);
			};
			loaded = true;
		} catch (error) {
			console.log(error);
			// alert('Something went wrong');
			location.assign('/');
		}
	}
</script>

<svelte:window
	bind:innerWidth={displayWidth}
	bind:innerHeight={displayHeight}
	on:resize={() => {
		if (loaded) {
			scale = Math.min(displayWidth / initialWidth, displayHeight / initialHeight);
			client.getDisplay().scale(scale);
		}
	}}
/>

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

<div
	id="display"
	class="w-full h-[100vh-50px] z-0 hover:cursor-none flex justify-center {loaded ? 'bg-black' : ''}"
>
	{#await loadPage()}
		<div class="w-full h-fit flex flex-col justify-center items-center">
			<div class="w-full h-[calc(100vh/2-100px)]" />
			<Stretch size="50" color="#1E3A8A" unit="px" />
		</div>
	{/await}
</div>
