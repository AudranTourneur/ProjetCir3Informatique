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
	</script>
</svelte:head>

<Navbar></Navbar>

<div class="bg-base-100">
  <slot />
</div>

<style>
  :global(body, html) {
    height: 100vh;
  }
</style>