<script lang="ts">
	import LoginModal from '$lib/LoginModal.svelte';

	function testBDD() {
		// fetch('http://localhost:8080/testBDD')
		// 	.then((response) => response.json())
		// 	.then((data) => {
		// 		res = JSON.stringify(data)
		// 	})
		console.log('nop');
  }

  let isModalOpen = false;
</script>

<main>
	<button class="btn" on:click={testBDD}>test bdd</button>

	<button class="btn" on:click={()=>isModalOpen = true}>toggle modal</button>
</main>


<LoginModal bind:isActive={isModalOpen} />	