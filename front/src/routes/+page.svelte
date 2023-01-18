<script lang="ts">
	import LoginModal from '$lib/LoginModal.svelte';
	import RegisterModal from '$lib/RegisterModal.svelte';

	function testBDD() {
		// fetch('http://localhost:8080/testBDD')
		// 	.then((response) => response.json())
		// 	.then((data) => {
		// 		res = JSON.stringify(data)
		// 	})
		console.log('nop');
	}

	let isRegisterModalOpen = false;
	let isLoginModalOpen = false;
</script>

<main>
	<button class="btn" on:click={testBDD}>test bdd</button>
	<button class="btn" on:click={()=>isLoginModalOpen = true}>toggle modal</button>
	<button class="btn" on:click={()=>isRegisterModalOpen = true}>toggle modal</button>

	<div class="sideBtn__container">
		<div class="border">
			<div class="accountBtn">
				<i class='bx bxs-user'></i>
			</div>
			<hr>
			<div class="modeBtn">
				<i class='bx bxs-moon' ></i>
			</div>
		</div>
	</div>

</main>

<LoginModal bind:isActive={isLoginModalOpen} />
<RegisterModal bind:isActive={isRegisterModalOpen} />

<style lang="scss">
	:root {
		/* Responsive Elements */
		--fs-error: 10rem;
		--fs-3xl: 5rem;
		--fs-xxl: 3rem;
		--fs-xl: 2.5rem;
		--fs-l: 2rem;
		--fs-m: 1.5rem;
		--fs-sm: 1.25rem;
		--fs-s: 1rem;
		--fs-ss: 0.85rem;
	}

	.sideBtn__container {
		position: absolute;
		right: 0;
		padding: 25px;

		.border {
			display: flex;
			flex-direction: column;
			gap: 5px;
			border: solid 3px white;
			border-radius: 5px;
			background-color: white;
			padding: 2px;

			hr {
				border: 2px solid black;
			}
		}

		i {
			color: black;
			font-size: var(--fs-l);
			&:hover {
				cursor: pointer;
				opacity: .8
			}
		}

	}
</style>
