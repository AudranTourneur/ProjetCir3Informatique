<script lang="ts">
	
	import SignInOrSignUp from '$lib/SignInOrSignUp.svelte';

	let toggleDisplayModal = false;
	let res = ''
	function testBDD() {
		// fetch('http://localhost:8080/testBDD')
		// 	.then((response) => response.json())
		// 	.then((data) => {
		// 		res = JSON.stringify(data)
		// 	})
		console.log('nop');
  }
</script>

<main>

	<label for="my-modal-6" class="btn">open modal</label>

	<input type="checkbox" id="my-modal-6" class="modal-toggle" />
	<div class="modal modal-bottom sm:modal-middle">
		<div class="modal-box">
			<div class="modal-action" style="margin:0;">
				<label for="my-modal-6" class="btn">
					Close
				</label>
			</div>
			<SignInOrSignUp/>
		</div>
	</div>
</main>