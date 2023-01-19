<script lang="ts">
	import LoginModal from '$lib/LoginModal.svelte';
	import { Datepicker } from 'svelte-calendar';

	import MapClient from './mapClient/MapClient.svelte';
	
	let isLoginModalOpen = false;
</script>

<main class="flex flex-col min-h-[100vh] p-0 m-0">

	<div class="map__responsive">
		<MapClient />
	</div>

	<!-- Floor input -->
	<div class="flex flex-col absolute p-[25px] m-0 gap-[15px] z-10">
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
	<div id="filterContainer" class="w-full absolute overflow-hidden rounded-t-lg p-[25px] z-0">
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

				<!--<div class="flex items-center justify-center p-[15px]">
					<div class="flex justify-center">
						<div class="timepicker flex flex-row gap-[10px] items-center" data-mdb-with-icon="false" id="input-toggle-timepicker">
							<i class='bx bx-time-five'></i>
							<input id="startTimeInput" type="text"
								   class="form-control w-32 block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
								   placeholder="start time" data-mdb-toggle="input-toggle-timepicker" />
						</div>
					</div>
				</div>

				<div class="h-full border-r-[1px] border-[#959896]"></div>

				<div class="flex items-center justify-center p-[15px]">
					<div class="flex justify-center">
						<div class="timepicker flex flex-row gap-[10px] items-center" data-mdb-with-icon="false" id="input-toggle-timepicker">
							<i class='bx bx-time'></i>
							<input id="endTimeInput" type="text"
								   class="form-control w-32 block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
								   placeholder="end time" data-mdb-toggle="input-toggle-timepicker" />
						</div>
					</div>
				</div>

				<div class="h-full border-r-[1px] border-[#959896]"></div>-->

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

</main>

<LoginModal bind:isActive={isLoginModalOpen} />

<style lang="scss">
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