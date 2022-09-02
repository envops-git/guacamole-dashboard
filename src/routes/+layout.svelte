<script>
	import '../app.css';
	import Navbar from '$lib/components/navbar.svelte';
</script>

<div class="w-full h-full min-w-[850px] overflow-auto">
	<Navbar />
	<div class="w-full h-full overflow-auto">
		<slot />
	</div>
</div>
