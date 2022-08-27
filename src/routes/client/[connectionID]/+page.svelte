<script>
	import { Stretch } from 'svelte-loading-spinners';
	import ClientToolbar from '../../../lib/components/client/clientToolbar.svelte';
	import Guacamole from 'guacamole-common-js';
	import { onMount } from 'svelte';

	export let data;
	let loaded = false;

	let client;
	let tunnel;

	let innerHeight;
	let innerWidth;

	let clipboardData = '';

	function getScale(height, width) {
		let scale = 1;
		scale = Math.min(height / 1080, width / 1920) * 0.99;
		return scale;
	}

	$: scale = getScale(innerHeight - 50, innerWidth);

	function listenClipboardCopy() {
		var keyPressed = {};
		document.addEventListener(
			'keydown',
			function (e) {
				keyPressed[e.key + e.location] = true;
				if (
					(keyPressed.Shift1 == true || keyPressed.Shift2 == true) &&
					(keyPressed.C0 == true || keyPressed.c0 == true)
				) {
					navigator.clipboard.writeText(clipboardData);
					keyPressed = {}; // reset key map
				}
			},
			false
		);
		document.addEventListener(
			'keyup',
			function (e) {
				keyPressed[e.key + e.location] = false;

				keyPressed = {};
			},
			false
		);
	}

	onMount(() => {
		try {
			tunnel = new Guacamole.WebSocketTunnel('wss://test.envops.com/guacamole/websocket-tunnel');
			client = new Guacamole.Client(tunnel);

			document.getElementById('displayCenter').appendChild(client.getDisplay().getElement());
			client.connect(
				'token=' +
					data.authToken +
					'&GUAC_WIDTH=1920&GUAC_HEIGHT=1080&GUAC_DATA_SOURCE=' +
					data.dataSource +
					'&GUAC_ID=' +
					data.connectionID +
					'&GUAC_TYPE=c&GUAC_AUDIO=audio%2FL8&GUAC_AUDIO=audio%2FL16&GUAC_IMAGE=image%2Fjpeg&GUAC_IMAGE=image%2Fpng&GUAC_IMAGE=image%2Fwebp'
			);

			client.onclipboard = (clipboardStream, mimeType) => {
				clipboardStream.onblob = (base64str) => {
					clipboardData = decodeURIComponent(escape(window.atob(base64str)));
				};
			};

			client.onrequired = (params) => {
				console.log(params);
			};

			client.onfilesystem = (object, name) => {
				console.log(name);
				console.log(object);
			};

			client.onfile = (stream, mimeType, filename) => {
				console.log(mimeType, filename);
			};

			client.onstatechange = (state) => {
				if (state == 5) {
					location.assign('/');
				}
			};

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
			listenClipboardCopy();
		} catch (error) {
			console.log(error);
			// alert('Something went wrong');
			location.assign('/');
		}
	});
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<div id="display" class="w-full h-[calc(100vh-50px)] z-0 bg-black overflow-hidden">
	<div
		id="displayCenter"
		style="width:1920; height:1080; transform-origin: 0px 0px; transform:scale({scale},{scale}); position:absolute; left:{innerWidth -
			1920 * scale >
		0
			? (innerWidth - 1920 * scale) / 2
			: '0'}px; top: 50px;"
		class="z-0 hover:cursor-none"
	/>
</div>

{#if loaded}
	<ClientToolbar bind:client bind:clipboardData />
{:else}
	<div class="w-full h-fit flex flex-col justify-center items-center">
		<div class="w-full h-[calc(100vh/2-100px)]" />
		<Stretch size="50" color="#1E3A8A" unit="px" />
	</div>
{/if}
