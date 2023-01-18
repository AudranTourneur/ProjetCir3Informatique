<script>
	import "$style/app.css"
	import Navbar from "../lib/Navbar.svelte";
</script>

<svelte:head>
	<title>Junia Planning Manager</title>

	<script>
		if (document) {
			let mode = window.localStorage.getItem('theme') || 'light';
			// || window.matchMedia('(prefers-color-scheme: dark)').matches
			if (mode === 'dark') {
				document.documentElement.dataset.theme = 'dark';
			} else {
				document.documentElement.dataset.theme = 'light';
			}
			console.log('mode=', mode);
			//$userTheme = mode;
		}

		async function requestData() {
			let url = "http://10.224.2.237:3001"
			await fetch(url, {
				method: "POST",
				mode: 'cors',
				cache: 'no-cache'
			}).then((res) => console.log(res))

		}
	</script>
</svelte:head>

<!--<Navbar></Navbar>-->
<slot />
<!--<div class="bg-base-100">
  <slot />
</div>-->

<style lang="scss">
	:global(body, html) {
		min-height: 100vh;
		background-color: grey;
	}

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
</style>

