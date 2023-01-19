<script lang="ts">
	import { PUBLIC_API_HOST } from "$env/static/public";
	import type { Plan } from "$lib/types";

	export let plan: Plan;

	export let toDelete: Plan | null;

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
		<div>
			{#if plan.name}
				{plan.name}
			{:else}
				<i>Unnamed plan</i>
			{/if}
		</div>
		<div>
			{#if plan.description}
				{plan.description}
			{:else}
				<i>No description set</i>
			{/if}
		</div>
		<div class="flex justify-between items-end">
			<div class="flex gap-3">
				<button />
				<div class="dropdown dropdown-right">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<label tabindex="0" class="btn btn-circle btn-ghost btn-xl text-2xl">
						<span><i class="fa-solid fa-ellipsis-vertical" /></span>
					</label>
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<div
						tabindex="0"
						class="card compact dropdown-content shadow bg-base-100 rounded-box w-48"
					>
						<div class="card-body">
							<h2 class="card-title">Actions avancées</h2>
							<button on:click={() => deletePlan()} class="btn btn-outline btn-error w-32"
								>Supprimer</button
							>
						</div>
					</div>
				</div>

				<a href="/admin/{plan._id}">
					<button class="btn btn-outline btn-info">Modifier</button>
				</a>

				<button
					class="btn btn-outline btn-primary">Voir</button
				>
			</div>
		</div>
	</div>
</div>
