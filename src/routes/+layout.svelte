<script>
	import '../app.css';
	import Navbar from '$lib/components/navbar.svelte';
</script>

<div class="w-full h-full">
	<Navbar />
	<div class="w-full h-full">
		<slot />
	</div>
</div>
