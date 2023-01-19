<script lang="ts">
    import EditorAdmin from './EditorAdmin.svelte'

    export let data;

    const plan = data.plan
</script> 

{#if plan}
    <EditorAdmin {plan} />
    {:else}
    <p>Plan not found</p>
{/if}