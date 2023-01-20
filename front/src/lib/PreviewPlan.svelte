<script lang="ts">
	import { PUBLIC_API_HOST } from "$env/static/public";
	import type { Plan } from "$lib/types";

	export let plan: Plan;

	export let toDelete: Plan | null;

	export let mode: 'admin' | 'user';

	function deletePlan() {
        console.log('deleting', plan)
		toDelete = plan;

		if (
			document.activeElement &&
			'blur' in document.activeElement &&
			document.activeElement.blur instanceof Function
		)
			document.activeElement.blur();
	}
</script>

<div class="flex flex-col md:flex-row bg-base-200 gap-4 rounded-3xl items-center p-3">
	<div>
		<div class="flex justify-center items-center w-56 h-56 p-2">
            <img src="{PUBLIC_API_HOST}/images/{plan.imageId}.png" alt="Plan"/>
			
		</div>
	</div>
	<div class="flex flex-col flex-1 justify-around h-full mx-4 flex-shrink">
		<div class="flex justify-center mb-2">
			{#if plan.name}
				<span class="text-xl font-bold">
					{plan.name}
				</span>	
			{:else}
				<i>Unnamed plan</i>
			{/if}
		</div>
		<div class="flex justify-between items-end">
			<div class="flex gap-3">
			
				{#if mode === 'admin'}
				<button on:click={() => deletePlan()} class="btn btn-outline btn-error w-32"
								>Supprimer</button
							>

				<a href="/plan/{plan._id}">
					<button class="btn btn-outline btn-info">Modifier</button>
				</a>
				{/if}

				<a
					class="btn btn-outline btn-primary" href="/plan/{plan._id}">Voir</a
				>
			</div>
		</div>
	</div>
</div>
