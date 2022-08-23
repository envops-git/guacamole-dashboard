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
	let loaded = false;

	let toolbarVisible = false;
	let soundEnabled = true;
	let microphoneEnabled = false;
	let clipboardVisible = false;

	let client;
	let tunnel;

	let innerHeight;
	let innerWidth;

	function getScale(height, width) {
		let scale = 1;
		scale = Math.min(height / 1080, width / 1920);
		return scale;
	}

	$: scale = getScale(innerHeight - 50, innerWidth);
	$: console.log(scale);

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

			client.onstatechange = (state) => {
				console.log(state);
				if (state == 5) {
					location.assign('/');
				}
			};
			document.getElementById('displayCenter').appendChild(client.getDisplay().getElement());
			client.connect('token=' + token + '&width=1920&height=1080');

			client.getDisplay().getElement().style.border="4px, solid, #700;"

			let mouse = new Guacamole.Mouse(client.getDisplay().getElement());
			mouse.onmouseup = (state) => client.sendMouseState(state);
			mouse.onmousedown = (state) => client.sendMouseState(state);
			mouse.onmousemove = function (mouseState) {
				mouseState.x = mouseState.x * (1 / scale);
				mouseState.y = mouseState.y * (1 / scale);
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

<svelte:window bind:innerHeight bind:innerWidth />

<div id="display" class="w-full h-[calc(100vh-50px)] z-0 bg-black overflow-hidden">
	<div
		id="displayCenter"
		style="width:1920; height:1080; transform-origin: 0px 0px; transform:scale({scale},{scale});"
		class="flex justify-center items-start z-0"
	/>
	{#await loadPage()}
		<div class="w-full h-fit flex flex-col justify-center items-center">
			<div class="w-full h-[calc(100vh/2-100px)]" />
			<Stretch size="50" color="#1E3A8A" unit="px" />
		</div>
	{/await}
</div>

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
		</div>
	</div>
</div>
