<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';

	import { fade, fly } from 'svelte/transition';

	export let isActive: boolean;
	export let canCancel: boolean = false;

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
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isActive}
	<div
		class="fixed z-20 inset-0 overflow-y-auto"
		role="dialog"
		aria-modal="true"
		in:fly={{ y: -1000, duration: 500 }}
		out:fade
		bind:this={modal}
	>
		<div
			class="flex items-end justify-center min-h-screen pt-4 px-2 pb-20 text-center sm:block sm:p-0"
		>
			<div class="fixed inset-0 bg-base-300 bg-opacity-75 transition-opacity" aria-hidden="true" />

			<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
				>&#8203;</span
			>

			<div
				class="inline-block align-bottom bg-base-300 rounded-lg text-left shadow-xl transform transition-all sm:my-4 sm:align-middle sm:max-w-xl sm:w-xl sm:w-full overflow-y-visible"
			>
				<div class="bg-base-100 px-4 pt-5 pb-2 sm:p-6 sm:pb-2 w-full">
					<div class="w-full">
						<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
							<div class="flex justify-between w-full">
								<div class="flex-1">
									<h3 class="text-lg leading-6 font-medium" id="modal-title">
										<slot name="title" />
									</h3>
								</div>
								<div class="flex-initial">
									{#if canCancel}
										<button on:click={() => (isActive = false)}>
											<span class="font-bold text-xl text-center mr-3"
												><i class="fas fa-times" /></span
											>
										</button>
									{/if}
								</div>
							</div>
							<div class="mt-2 mr-4">
								<slot name="content" />
							</div>
						</div>
					</div>
				</div>
				<div class="bg-base-200 px-4 py-1 sm:px-6 sm:flex sm:flex-row-reverse">
					<slot name="buttons" />
				</div>
			</div>
		</div>
	</div>
{/if}
