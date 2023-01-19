<script lang="ts">
	import { PUBLIC_API_HOST } from '$env/static/public';
    import {createEventDispatcher, onDestroy} from 'svelte';
    import {fade, fly} from 'svelte/transition';

    export let isActive: boolean;
    export let canCancel: boolean = true;

    let modal: any;

    const dispatch = createEventDispatcher();
    const close = () => {
        dispatch('close');
        isActive = false;
    };

    const handleKeydown = (e: any) => {
        if (e.key === 'Escape') {
            close();
            return;
        }

        if (e.key === 'Tab') {
            // trap focus
            const nodes = modal.querySelectorAll('*');
            const tabbable: any[] = Array.from(nodes).filter((n: any) => n.tabIndex >= 0);

            let index = tabbable.indexOf(document.activeElement);
            if (index === -1 && e.shiftKey) index = 0;

            index += tabbable.length + (e.shiftKey ? -1 : 1);
            index %= tabbable.length;

            tabbable[index].focus();
            e.preventDefault();
        }
    };

    const previouslyFocused: any = typeof document !== 'undefined' && document.activeElement;

    if (previouslyFocused) {
        onDestroy(() => {
            if (previouslyFocused && previouslyFocused['focus']) previouslyFocused.focus();
        });
    }


    //export let transition
	let isLoading = false
	let isRegisterModal = false;
	let user = {
		email: "",
		password: ""
	}

    function changeModal() {
        isRegisterModal = !isRegisterModal;
    }

	let loginErrorOutput = ''
	let registerErrorOutput = ''

	async function sendData(){
		let url = undefined;
		// login
		console.log(user);
		if(!isRegisterModal){
			console.log("PROCESSING LOGIN")
			url = PUBLIC_API_HOST + "/signIn";
			await fetch(url, {
				method: "POST",
				mode: "cors",
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user)
			})
					.then((res) => res.json())
					.then((data) => {
						console.log(data.status)
						switch(data.status){
							case 0:
								console.info("user does not exist!");
								loginErrorOutput = "User does not exist!"
								break;
							case 1:
								console.info("user connected!", data);
								//location.href = "/"
								break;
							case 2:
								console.info("invalid password!");
								loginErrorOutput = "Invalid password!"
								break;
							default:
								break;
						}
						if (data.token) {
							localStorage.setItem("token", data.token);
							localStorage.setItem("email", user.email)
						}
						isLoading = false;
					})

		} else {
			// register
			console.log("register")
			url = `${PUBLIC_API_HOST}/userExists`
			await fetch(url, {
				method: "POST",
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user)
			})
					.then((response) => response.json())
					.then(async (data) => {
						switch(data.status){
							case 0:
								console.info("user does not exist!")
								url = `${PUBLIC_API_HOST}/createAccount`

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
											location.href = "/"
										})
								break;
							case 1:
								console.info("user already registered with that mail!");
								registerErrorOutput = "User is already registered!"
								break;
							case 2:
								console.info("not data received in the header!")
								registerErrorOutput = "Not data sent in the header"
								break;
							default:
								break;
						}

						if (data.token) {
							localStorage.setItem("token", data.token);
							localStorage.setItem("email", user.email)
						}
						isLoading = false;
					})
		}
	}

</script>

<svelte:window on:keydown={handleKeydown}/>

{#if isActive}
	{#if !isRegisterModal}
		<div
				class="fixed z-20 inset-0 overflow-y-auto bg-black bg-opacity-50"
				role="dialog"
				aria-modal="true"
				in:fly={{ y: -1000, duration: 500 }}
				out:fade
				bind:this={modal}
		>

			<div class="flex justify-center items-center h-full">
				<div class="flex flex-col items-center w-[380px] h-[460px] bg-base-200 rounded-xl px-4 gap-3">
					<div class="flex justify-between items-center w-full my-4">
						<div />
						<h1 class="text-3xl font-bold">Sign in</h1>
						<button on:click={() => isActive = false}>
							<span class="m-2 text-xl"><i class="fa-solid fa-xmark"></i></span>
						</button>
					</div>

					{#if loginErrorOutput}
					<div class="alert alert-error shadow-lg">
					  <div>
					    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
					    <span>{loginErrorOutput}</span>
					  </div>
					</div>
					{/if}

					<div class="form-control w-full max-w-xs">
						<label class="label">
							<span class="label-text"><span> <i class="fa-solid fa-envelope"></i> </span>Email</span>
						</label>
						<input bind:value={user.email} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
					</div>

					<div class="form-control w-full max-w-xs">
						<label class="label">
							<span class="label-text"><span><i class="fa-solid fa-key"></i></span> Password</span>
						</label>
						<input bind:value={user.password} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
					</div>

					<div class="flex justify-end w-full px-8 my-2">
						<button on:click={() => sendData()} class="btn btn-md btn-success" class:loading={isLoading} on:click={() => isLoading = true}>Sign in</button>
					</div>

					<button class="btn btn-link" on:click={()=> changeModal()}>Créer un compte</button>

				</div>
			</div>

		</div>
	{:else}
		<div
				class="fixed z-20 inset-0 overflow-y-auto bg-black bg-opacity-50"
				role="dialog"
				aria-modal="true"
				in:fly={{ y: -1000, duration: 500 }}
				out:fade
				bind:this={modal}
		>

			<div class="flex justify-center items-center h-full">
				<div class="flex flex-col items-center w-[380px] h-[460px] bg-base-200 rounded-xl px-4 gap-3">
					<div class="flex justify-between items-center w-full my-4">
						<div />
						<h1 class="text-3xl font-bold">Create an account</h1>
						<button on:click={() => isActive = false}>
							<span class="m-2 text-xl"><i class="fa-solid fa-xmark"></i></span>
						</button>
					</div>

					{#if registerErrorOutput}
						
						<div class="alert alert-error shadow-lg">
						  <div>
						    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
						    <span>{registerErrorOutput}</span>
						  </div>
						</div>
					{/if}

					<div class="form-control w-full max-w-xs">
						<label class="label">
							<span class="label-text"><span> <i class="fa-solid fa-envelope"></i> </span>Email</span>
						</label>
						<input bind:value={user.email} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
					</div>

					<div class="form-control w-full max-w-xs">
						<label class="label">
							<span class="label-text"><span><i class="fa-solid fa-key"></i></span> Password</span>
						</label>
						<input bind:value={user.password} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
					</div>

					<div class="flex justify-end w-full px-8 my-2">
						<button on:click={()=> sendData()} class="btn btn-md btn-success" class:loading={isLoading} on:click={() => isLoading = true}>Register</button>
					</div>

					<button class="btn btn-link" on:click={()=> changeModal()}>Créer un compte</button>

				</div>
			</div>
		</div>
	{/if}
{/if}
