<script>

    import SignIn from '$lib/SignIn.svelte'
    import SignUp from '$lib/SignUp.svelte';
    let alreadyHaveAnAccount = true;
</script>

{#if alreadyHaveAnAccount}
    <SignIn bind:alreadyHaveAnAccount={alreadyHaveAnAccount}/>
{:else}
    <SignUp bind:alreadyHaveAnAccount={alreadyHaveAnAccount}/>
{/if}




