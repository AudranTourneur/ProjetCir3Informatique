<script lang="ts">
    import { Floor } from '$lib/Floor';
    import type { Room } from '$lib/Room'
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { writable, type Writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import TimePlan from '../plan/TimePlan.svelte';
    import LoginModal from '$lib/LoginModal.svelte';
	import { Datepicker } from 'svelte-calendar';
	
	let isLoginModalOpen = false;

    let el : HTMLDivElement;

    let currentlySelectedRoom: Writable<Room | null> = writable(null)
	
    //let points = [
    //    [50, 50],
    //    [50, 150],
    //    [150, 150],
    //    [150, 50],
    //    [100, 100],
    //].map((p) => [p[0] + 100, p[1] + 300])

    let points = [
        [0, 0],
        [0.5, 0.5],
        [0, 1]
    ]

    let idSelectedFloor = 0;

    let date = new Date();
    let day = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();
    
    let infoDate = {
        "year": year,
        "month": month,
        "day": day
    }

    let tabFloor : Floor[] = [];

	onMount(() => {

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    let svg = d3.select(el)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style('background-color', 'lightgrey')
    // @ts-ignore
    .call(d3.zoom()
    .on("zoom", (event) => {
        svg.attr("transform", event.transform)
    })
    .scaleExtent([(innerWidth/width)-0.4,4.5])
    )
    .append("g")
    .attr("id","main-svg")
    let image = svg.append('image')
    .attr('xlink:href', '/Etage_2_clean.png')
    .attr("width", width)

    setTimeout(() => {
        height = image.node()?.getBBox().height!;
        svg.attr("height", height)

        let roomData = {
            points: points.map(p => [p[0] * width, p[1] * height]),
            name: "nom1",
            capacity: 10,
            projecteur: true,
        };
        tabFloor.push(new Floor([roomData],"bonjour", currentlySelectedRoom));
        tabFloor[idSelectedFloor].update()
    }, 1000);
	});

    function unselect() {
        d3.selectAll("#main-svg > polygon").attr('stroke', '#f00');
        $currentlySelectedRoom = null
    }

    function saveInput() {

    }
    function cancelInput() {

    }

    function finishEdition() {
        if (!$currentlySelectedRoom) return;
    }
</script>


<div class="absolute overflow-hidden" bind:this={el}></div>

<!-- Floor input -->
<div class="flex flex-col absolute p-[15px] m-0 gap-[15px] z-10">
    <div class="btn__container">
        <div class="dropdown">
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label tabindex="0" class="btn m-1">Click</label>
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><button>Item 1</button></li>
                <li><button>Item 2</button></li>
            </ul>
        </div>
    </div>
</div>

<!-- Filter DATEPICKER -->
<div id="filterContainer" class="absolute left-[30vw] w-[40vw] overflow-hidden rounded-t-lg p-[25px] z-0">
    <div class="flex justify-center">
        <div class="filter__container">

            <!-- DATE PICKER -->
            <div class="flex items-center justify-center p-[15px]">
                <div class="datepicker flex flex-row gap-[10px] items-center" data-mdb-toggle-button="false">
                    <Datepicker format="DD/MM/YYYY"></Datepicker>
                    <i class='bx bx-calendar'></i>
                    <input id="dateInput" type="text"
                            class="form-control w-32 block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            placeholder="Select a date"
                            data-mdb-toggle="datepicker"
                    />
                </div>
            </div>

            <div class="h-full border-r-[1px] border-[#959896]"></div>
            <div class="p-[15px]">
                <i id="searchBtn" class='bx bx-search-alt'></i>
            </div>

        </div>
    </div>

    <!--<div id="searchResult" class="search__container">
        <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
    </div>-->

</div>

<LoginModal bind:isActive={isLoginModalOpen} />

<!-- Aside btn (Compte / dark mode ...) -->
<div class="flex flex-col absolute right-0 p-[25px] m-0 gap-[15px] z-10">
    <div class="btn__container">
        <div class="p-[10px]">
            <i class='bx bx-user' on:click={() => isLoginModalOpen = true}></i>
        </div>
        <div class="border-t-[1px] border-[#959896]"></div>
        <div class="p-[10px]">
            <i class='bx bx-moon'></i>
        </div>
    </div>

    <div class="btn__container">
        <div class="p-[10px]">
            <!--<i class='bx bxs-user' on:click={() => isLoginModalOpen = true}></i>-->
            <i class='bx bx-crown' ></i>
        </div>
    </div>
</div>

<!-- Span bottom edge -->
<div class="absolute left-0 bottom-0 w-full">
    <div class="absolute inset-x-0 bottom-0">
    {#if !$currentlySelectedRoom}
        <div class="flex justify-center  bg-black bg-opacity-50 p-2 gap-2" transition:slide>
            <button class="btn btn-success" on:click={finishEdition}>Terminer l'édition</button>
        </div>
    {:else}
        <div class="flex justify-center  bg-black bg-opacity-70 p-2 h-[500px]" transition:slide>
            <div class="flex flex-col gap-2"> 
                <div class="form-control w-full max-w-xs">
                    <label for="input-nom" class="label">
                        <span class="label-text text-white">Nom de la salle : </span>
                    </label>
                    <span class="label-text text-white">{$currentlySelectedRoom.name}</span>
                </div>

                <div class="form-control w-full max-w-xs">
                    <label for="input-capacite" class="label">
                        <span class="label-text text-white">Capacité de la salle : </span>
                    </label>
                    <span class="label-text text-white">{$currentlySelectedRoom.capacity}</span>
                </div>

                <div class="text-white">
                    <label for="input-capacite" class="label">
                        <span class="label-text text-white">Projecteur : </span>
                    </label>
                    {#if $currentlySelectedRoom.projecteur}
                        <span class="label-text text-white">oui</span>
                    {:else}
                        <span class="label-text text-white">non</span>
                    {/if}
                </div>
                <div>
                    <button class="btn btn-warning btn-outline" on:click={cancelInput}>Annuler</button>
                    <button class="btn btn-success" on:click={saveInput}>Sauvegarder</button>
                </div>
                <button class="btn btn-primary w-[400px]" on:click={unselect}>OK</button>
                <div class="absolute bottom-2 left-0">
                    <TimePlan bind:infoDate={infoDate}>

                    </TimePlan >
                </div>
            </div>
        </div>
    {/if}
</div>
</div>

<style lang="scss">
    :global(html, body) {
        overflow: hidden;
    }
    :root {
  /* Responsive Elements */
  --fs-error: 10rem;
  --fs-3xl: 5rem;
  --fs-xxl: 3rem;
  --fs-xl: 2.5rem;
  --fs-l: 2rem;
  --fs-m: 1.5rem;
  --fs-sm: 1.25rem;
  --fs-s: 1rem;
  --fs-ss: 0.85rem;
}

main {
  overflow: hidden;
  background-color: white;
}

.map__responsive {
  overflow: hidden;

  iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
}

.btn__container {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  background-color: #313536;
  box-shadow: 0 0 3px #313536;

  i {
    color: #959896;
    font-size: var(--fs-l);
    &:hover {
      cursor: pointer;
      opacity: .75
    }
  }
}

.filter__container {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #313536;
  border-radius: 30px;
  color: white;

  i {
    font-size: var(--fs-l);
  }
}

.search__container {
  display: flex;
  flex-direction: column;
  padding: 25px;
}

#slideBtn {
  cursor: pointer;
  font-size: var(--fs-l);
  color: white;
  &:hover {
    opacity: .75;
  }
}

#searchBtn {
  cursor: pointer;
  font-size: var(--fs-l);
  color: white;
  &:hover {
    opacity: .75;
  }
}

</style>
