<script>
  import { onMount } from "svelte";

  export let data;

  onMount(() => {
    let iframe = document.getElementById('connectionIFrame');
    iframe.contentWindow.body.addEventListener('click', (e) => {
      alert(e.target)
    })
  })

</script>

<iframe id='connectionIFrame' class='h-[calc(100vh-50px)] w-screen' src={data.clientURL} title={data.name}>

</iframe>