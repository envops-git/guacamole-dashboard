<script>
	import Guacamole from 'guacamole-common-js';

	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		let tunnel = new Guacamole.WebSocketTunnel('wss://test.envops.com/tunnel');
		let client = new Guacamole.Client(tunnel);

		document.body.appendChild(client.getDisplay().getElement());
		client.connect('token=' + data.token);

		let mouse = new Guacamole.Mouse(client.getDisplay().getElement());

		mouse.onmousedown =
			mouse.onmouseup =
			mouse.onmousemove =
				function (mouseState) {
					client.sendMouseState(mouseState);
				};
		let keyboard = new Guacamole.Keyboard(document);

		keyboard.onkeydown = function (keysym) {
			client.sendKeyEvent(1, keysym);
		};

		keyboard.onkeyup = function (keysym) {
			client.sendKeyEvent(0, keysym);
		};
	});
</script>
