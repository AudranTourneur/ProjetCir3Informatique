<script lang="ts">
    import EditorAdmin from './EditorAdmin.svelte'

    export let data;

    const plan = data.plan
</script> 

<EditorAdmin floor={plan} />