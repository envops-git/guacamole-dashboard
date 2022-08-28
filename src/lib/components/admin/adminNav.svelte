<script>
  let items = [
    {
      name: 'Active Sessions',
      path: '/admin/activeSessions'
    },
    {
      name: 'Connections',
      path: '/admin/connections'
    },
    {
      name: 'Users',
      path: '/admin/users'
    },
    {
      name: 'Groups',
      path: '/admin/groups'
    },
  ];
</script>

<header
	class="w-full shadow-md h-[50px] bg-gray-200 flex items-center border-b-2 border-blue-900 justify-evenly"
	id="nav"
>
  {#each items as item}
  <div on:click={() => location.assign(item.path)} class='h-full w-full hover:bg-gray-100 font-semibold text-gray-900 flex justify-center items-center hover:cursor-pointer duration-100'>
    {item.name}
  </div>
  {/each}
</header>
