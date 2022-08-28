<script>
  import AdminNav from '$lib/components/admin/adminNav.svelte'
</script>

<div class="w-full h-full">
	<AdminNav />
	<div class="w-full h-full">
		<slot />
	</div>
</div>