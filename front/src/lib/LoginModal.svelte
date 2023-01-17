<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';

	import { fade, fly } from 'svelte/transition';

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
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isActive}
	<div
		class="fixed z-20 inset-0 overflow-y-auto bg-black bg-opacity-50"
		role="dialog"
		aria-modal="true"
		in:fly={{ y: -1000, duration: 500 }}
		out:fade
		bind:this={modal}
	>

	<div class="flex justify-center items-center h-full">
		<div class="flex flex-col items-center w-[380px] h-[360px] bg-base-200 rounded-xl px-4 gap-3">
			<div class="flex justify-between items-center w-full my-4">
				<div />
			<h1 class="text-3xl font-bold">Sign in</h1>
			<button on:click={() => isActive = false}>
				<span class="m-2 text-xl"><i class="fa-solid fa-xmark"></i></span>
			</button>
			</div>

			

			<div class="form-control w-full max-w-xs">
  			<label class="label">
  			  <span class="label-text"><span> <i class="fa-solid fa-envelope"></i> </span>Email</span>
  			</label>
			  <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
			</div>


	<div class="form-control w-full max-w-xs">
  			<label class="label">
  			  <span class="label-text"><span><i class="fa-solid fa-key"></i></span> Password</span>
  			</label>
			  <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
			</div>

			<div class="flex justify-end w-full px-8 my-2">
			<button class="btn btn-md btn-success" class:loading={isLoading} on:click={() => isLoading = true}>Sign in</button>
			</div>

		</div>
	</div>

	</div>
{/if}
