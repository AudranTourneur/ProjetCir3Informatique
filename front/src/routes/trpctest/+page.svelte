<script lang="ts">
	import {getTRPCClient} from '$lib/clientTRPC'

 const trpc = getTRPCClient()
// Notice the <AppRouter> generic here.


	let res: string = "";

	async function launch() {
		const serverRes = await trpc.userCreate.mutate({name: "bonjour"})
		res = JSON.stringify(serverRes)
	}

	let resGet = ""

	let id = "1"

	async function get() {
		const user = await trpc.userById.query(id)
		resGet = JSON.stringify(user)	
	}

</script>

res = {res}

<button class="btn" on:click={launch}>
	click pls
</button>

resGet = {resGet}
<input class="input input-primary" bind:value={id} />
<button class="btn" on:click={get}>get by id</button>