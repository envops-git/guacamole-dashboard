<script>
	import { mdiHome } from '@mdi/js';
  import Icon from 'mdi-svelte';
	let items = [{ name: 'Home', path: '/', icon: mdiHome }];
</script>

<div class="w-full h-full bg-[#dddddd] border-r-2 border-white">
  {#each items as item }
    <div on:click={() => location.assign(item.path)} class='w-full h-11 hover:bg-[#eeeeee] hover:cursor-pointer flex justify-start items-center pl-6'>
      <Icon size=0.9 path={item.icon}/>
      <p class='font-semibold ml-4'>{item.name}</p>
    </div>
  {/each}
</div>
