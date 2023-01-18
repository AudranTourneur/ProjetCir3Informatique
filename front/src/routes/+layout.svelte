<script>
	import { PUBLIC_API_HOST } from "$env/static/public";
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

		async function registerData() {
			let url = `${API_HOST}/userExists`
			let user = {
				email: "lucas@lucas.com",
				password: "LUCAS"
			}
			await fetch(url, {
				method: "POST",
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user)
			}).then((response) => response.json())
					.then(async (data) => {
						console.log(data)
						if (data.status === 0) {
							console.log("l'utilisateur n'existe pas!")
							url = `${API_HOST}/createAccount`
							
							await fetch(url, {
								method: "POST",
								mode: "cors",
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify(user)
							}).then((response) => response.json())
									.then((data) => {
										console.log(data);
									})
						} else {
							console.log("status != 0")
						}
					});

		}

		async function loginData(){

			let url = `${API_HOST}/createAccount`
			let user = {
				email: "lucas@ldqsucas.com",
				password: "LUCAS"
			}
			await fetch(url, {
				method: "POST",
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user)
			}).then((response) => response.json())
					.then(async (data) => {
						console.log(data)
					});
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

