<script>
    export let alreadyHaveAnAccount = false;

    let email = '';
    let password = '';
    let confPassword = '';

    async function signUp() {

    }
</script>

<div class="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
    <div class="flex justify-center self-center  z-10">
        <div class="p-12 bg-white mx-auto rounded-2xl w-100 ">
            <div class="mb-4">
                <h3 class="font-semibold text-2xl text-gray-800">Sign Up </h3>
            </div>
            <div class="space-y-5">
                <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700 tracking-wide">Email</label>
                    <input class=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                           type="" placeholder="mail@gmail.com" bind:value={email}>
                </div>
                <div class="space-y-2">
                    <label class="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                        Password
                    </label>
                    <input class="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                           type="" placeholder="Enter your password" bind:value={password}>
                </div>
                <div class="space-y">
                    <label class="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                        Confirm password
                    </label>
                    <input class="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                           type="" placeholder="Repeat  your password" bind:value={confPassword}>
                </div>
                <div>
                    <button type="submit" on:click={signUp()}
                            class="w-full flex justify-center bg-green-400  hover:bg-green-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500">
                        Sign up
                    </button>
                </div>
            </div>
            <div class="pt-5 text-center text-gray-400 text-xs">
                <button on:click={() => alreadyHaveAnAccount=!alreadyHaveAnAccount}>
                    Go sign in <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
    </div>
</div>