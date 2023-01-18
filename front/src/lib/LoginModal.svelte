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
								document.getElementById("loginErrorOutput").textContent = "user does not exist!"
								break;
							case 1:
								console.info("user connected!");
								//localStorage.setItem("token", data.token);
								location.href = "/"
								break;
							case 2:
								console.info("invalid password!");
								document.getElementById("loginErrorOutput").textContent = "invalid password!"
								break;
							default:
								break;
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
								document.getElementById("registerErrorOutput").textContent = "user is already registered!"
								break;
							case 2:
								console.info("not data received in the header!")
								document.getElementById("registerErrorOutput").textContent = "not data sent in the header"
								break;
							default:
								break;
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
				<div class="flex flex-col items-center w-[380px] h-[400px] bg-base-200 rounded-xl px-4 gap-3">
					<div class="flex justify-between items-center w-full my-4">
						<div />
						<h1 class="text-3xl font-bold">Sign in</h1>
						<button on:click={() => isActive = false}>
							<span class="m-2 text-xl"><i class="fa-solid fa-xmark"></i></span>
						</button>
					</div>

					<div class="bg-red-500 w-[340px]">
						<pre id="loginErrorOutput"></pre>
					</div>

					<div class="form-control w-full max-w-xs">
						<label class="label">
							<span class="label-text"><span> <i class="fa-solid fa-envelope"></i> </span>Email</span>
						</label>
						<input on:input={(event) => user.email = event.target.value} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
					</div>

					<div class="form-control w-full max-w-xs">
						<label class="label">
							<span class="label-text"><span><i class="fa-solid fa-key"></i></span> Password</span>
						</label>
						<input on:input={(event) => user.password = event.target.value} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
					</div>

					<div class="flex justify-end w-full px-8 my-2">
						<button on:click={() => sendData()} class="btn btn-md btn-success" class:loading={isLoading} on:click={() => isLoading = true}>Sign in</button>
					</div>

					<pre on:click={()=> changeModal()}>Créer un compte</pre>

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
				<div class="flex flex-col items-center w-[380px] h-[400px] bg-base-200 rounded-xl px-4 gap-3">
					<div class="flex justify-between items-center w-full my-4">
						<div />
						<h1 class="text-3xl font-bold">Create an account</h1>
						<button on:click={() => isActive = false}>
							<span class="m-2 text-xl"><i class="fa-solid fa-xmark"></i></span>
						</button>
					</div>

					<div class="bg-red-500 w-[340px]">
						<pre id="registerErrorOutput"></pre>
					</div>

					<div class="form-control w-full max-w-xs">
						<label class="label">
							<span class="label-text"><span> <i class="fa-solid fa-envelope"></i> </span>Email</span>
						</label>
						<input on:input={(event) => user.email = event.target.value} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
					</div>

					<div class="form-control w-full max-w-xs">
						<label class="label">
							<span class="label-text"><span><i class="fa-solid fa-key"></i></span> Password</span>
						</label>
						<input on:input={(event) => user.password = event.target.value} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
					</div>

					<div class="flex justify-end w-full px-8 my-2">
						<button on:click={()=> sendData()} class="btn btn-md btn-success" class:loading={isLoading} on:click={() => isLoading = true}>Register</button>
					</div>

					<pre on:click={()=> changeModal()}>Se connecter</pre>

				</div>
			</div>
		</div>
	{/if}
{/if}
