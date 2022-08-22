<script>
	import Guacamole from 'guacamole-common-js';

	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		let tunnel = new Guacamole.HTTPTunnel('https://test.envops.com/tunnel');
		let client = new Guacamole.Client(tunnel);

		document.body.appendChild(client.getDisplay().getElement());
		client.connect('token=' + data.token);
	});
</script>
