<script lang="ts">
	import LoginModal from '$lib/LoginModal.svelte';
	import FilterBar from '$lib/FilterBar.svelte';

	function testBDD() {
		// fetch('http://localhost:8080/testBDD')
		// 	.then((response) => response.json())
		// 	.then((data) => {
		// 		res = JSON.stringify(data)
		// 	})
		console.log('nop');
	}

	let isLoginModalOpen = false;
</script>

<main>
	<button class="btn" on:click={testBDD}>test bdd</button>
	<button class="btn" on:click={()=>isLoginModalOpen = true}>toggle modal</button>

	<div class="sideBtn__container">
		<div class="border">
			<div class="accountBtn">
				<i class='bx bxs-user' on:click={() => isLoginModalOpen = true}></i>
			</div>
			<hr>
			<div class="modeBtn">
				<i class='bx bxs-moon' ></i>
			</div>
		</div>
	</div>

	<FilterBar>
	</FilterBar>

</main>

<LoginModal bind:isActive={isLoginModalOpen} />

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

	main {
		min-height: 100vh;
	}

	.sideBtn__container {
		position: absolute;
		right: 0;
		padding: 25px;

		.border {
			display: flex;
			flex-direction: column;
			gap: 5px;
			border: solid 3px #212629;
			border-radius: 5px;
			background-color: #212629;
			padding: 2px;

			hr {
				border: 1px solid #666b6e;
			}
		}

		i {
			color: #666b6e;
			font-size: var(--fs-l);
			&:hover {
				cursor: pointer;
				opacity: .8
			}
		}

	}
</style>
