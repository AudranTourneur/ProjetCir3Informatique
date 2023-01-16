<script>
    let inputText = ""
</script>

<button class="btn btn-primary">test</button>

<div class="bg-green-400 w-32 h-32 rounded-xl"></div>

<p class="text-3xl text-red-500 underline">test</p>

<input type="checkbox" class="toggle">

test
<input type="text" class="input input-primary" bind:value={inputText}>

<h1>valeur tapé : {inputText}</h1>