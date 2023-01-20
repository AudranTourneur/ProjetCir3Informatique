<script lang="ts">
	import { Floor } from '$lib/Floor';
	import type { Room } from '$lib/Room';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { writable, type Writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import TimePlan from './TimePlan.svelte';
	import LoginModal from '$lib/LoginModal.svelte';
	import { Datepicker } from 'svelte-calendar';
	import type { Plan } from '../../../../../back/src/types';
	import dayjs from 'dayjs';
	import { PUBLIC_API_HOST } from '$env/static/public';

	export let plan: Plan;

	let isLoginModalOpen = false;

	let el: HTMLDivElement;

    let dataDay : any = [];

	let currentlySelectedRoom: Writable<Room | null> = writable(null);

	$: {
		console.log('room', currentlySelectedRoom)
	}
	
	let isReservationPossible : boolean;

    let infoModal1 : Date;
    let infoModal2 : Date;

    let points = [
		[0, 0],
		[0.5, 0.5],
		[0, 1]
	];

    let internalRooms = plan.rooms.map((room) => {
		points = room.points.map((p) => [p.x, p.y]);
		return {
			points: points,
			name: room.name,
			capacity: room.capacity,
			projecteur: room.hasProjector
		};
	});

	let date = new Date();
	let day = date.getDay();
	let month = date.getMonth();
	let year = date.getFullYear();

	let infoDate = {
		year: year,
		month: month,
		day: day
	};

    
	let floor: null | Floor = null;


	let allReservationsForTheDay: Array<any> = [];

	async function getPlanReservation(): Promise<Array<any>> {
		if (!$dateStore || !$dateStore.selected) return;
		const displayedDate =  $dateStore.selected.toISOString().split('T')[0];

		console.log('sending', plan._id, displayedDate)

		const res = await fetch(`${PUBLIC_API_HOST}/getAllReservationsForPlan/${plan._id}`)
		const data = await res.json()
		const reservations = data.data
		console.log('received reservations', data.data)	

		return reservations
	}

	function getReservationsForDateAndRoom(date: Date, roomName: string): Array<any> {
		const dateKey = buildKey(date)
		const roomReservations = allReservationsForTheDay.filter((r) => r.roomName === roomName && r.date === buildKey(date))
		console.log('reservations for date AND room', dateKey, roomName, '=>', roomReservations)
		return roomReservations
	}

	onMount(async () => {
		let width = window.innerWidth;
		let height = window.innerHeight;

		let svg = d3
			.select(el)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.style('background-color', 'lightgrey')
			// @ts-ignore
			.call(d3.zoom()
					.on('zoom', (event) => {
						svg.attr('transform', event.transform);
					})
					.scaleExtent([innerWidth / width - 0.4, 4.5])
			)
			.append('g')
			.attr('id', 'main-svg');
		let image = svg
            .append('image')
            .attr('xlink:href', `${PUBLIC_API_HOST}/images/${plan.imageId}.png}`)
            .attr('width', width);

		const updateHeight = () => {
			height = image.node()?.getBBox().height!;
			console.log('la height vaut', height);
			console.log(svg.node());
			if (height === 0) {
				console.log('not loaded yet, retrying in 10ms');
				setTimeout(updateHeight, 10);
				return;
			}

			svg.attr('height', height);

			internalRooms = internalRooms.map((r) => {
				return {
					points: r.points.map((p) => [p[0] * width, p[1] * height]),
					name: r.name,
					capacity: r.capacity,
					projecteur: r.projecteur
				};
			});

			floor = new Floor(internalRooms, 'Name', currentlySelectedRoom);

			floor.update();
		};

		setTimeout(updateHeight, 1);

		allReservationsForTheDay = await getPlanReservation()
		initDay()
	});

	function unselect() {
		d3.selectAll('#main-svg > polygon').attr('stroke', '#f00');
		$currentlySelectedRoom = null;
	}

	function padNumber(n: number) {
		return n < 10 ? '0' + n : n;
	}

	function buildKey(date: Date): string {
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		const day = date.getDate()
		return `${year}-${padNumber(month)}-${padNumber(day)}`
	}

    async function initDay() {
		//const key = $dateStore.selected.toISOString().split('T')[0];
		const key = buildKey($dateStore.selected)
		dataDay = allReservationsForTheDay.filter(e => e.date === key);
		//console.log('dataDay', key, dataDay, $dateStore.selected, $dateStore.selected.toISOString(), $dateStore.selected.getDate())
		console.log('======================', key)
		console.log('============================', dataDay)

    }
    
    async function saveInput() {
        let url = PUBLIC_API_HOST + "/bookRoom";
        let displayedDate = {
            planId: plan._id,
            email: localStorage.getItem('email'),
            date: buildKey($dateStore.selected),
            startTime: infoModal1.getTime(),
            endTime: infoModal2.getTime(),
            roomName: $currentlySelectedRoom?.name,
            token: localStorage.getItem('token'),
        };

		console.log(infoModal1, infoModal2)
		console.log('display', displayedDate)

        await fetch(url, {
				method: "POST",
				mode: "cors",
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(displayedDate)
			})
            .then((res) => res.json())
            .then((data) => {
                dataDay = data.data;
				console.log('Registered', displayedDate.date, displayedDate.roomName)
				setTimeout(() => {
					location.reload()
				}, 500)
            });    
        }


	function cancelInput() {}

	function finishEdition() {
		if (!$currentlySelectedRoom) return;
	}

	let datePickerOpen = false;

	let dateStore;

	let currentDateKey = ''

	$: {
		if ($dateStore) {
			console.log('state update', $dateStore)
			datePickerOpen = $dateStore.open

			console.log($dateStore.selected)
			console.log(typeof $dateStore.selected)

			console.log('year', $dateStore.selected.getFullYear())
			console.log('month', $dateStore.selected.getMonth())
			console.log('day', $dateStore.selected.getDate())

            infoDate.year = $dateStore.selected.getFullYear()
            infoDate.month = $dateStore.selected.getMonth()
            infoDate.day = $dateStore.selected.getDate()

			console.log('info', infoDate)

			currentDateKey = buildKey($dateStore.selected)

			initDay();
		}
	}

	/*
	let fakeDatas = [
		{
			reservedBy:String,
		    date:Number,
		    startTime:Number,
		    endTime:Number,
		    roomName:String,
		}
	]
	*/

	function reloadPage() {
		setTimeout(() => {
			location.reload()
		}, 500)
	}


	let timePlanKey: string = ''
	$: timePlanKey = `${currentDateKey}/${$currentlySelectedRoom?.name}`

	$: {
		console.log('--------------------------------> key=', timePlanKey)
	}

</script>

<div class="absolute overflow-hidden" bind:this={el} />

<!-- Floor input -->
<div class="flex absolute p-[15px] m-0 gap-[15px] z-10 text-xl">
    <a href="/plan" class="btn" on:click={reloadPage}><span class="mr-2">
		<i class="fa-solid fa-door-open"></i>
	</span> Back</a>
</div>

<!-- Filter DATEPICKER -->
<div
	id="filterContainer"
	class="absolute {!datePickerOpen ? 'left-[25vw] w-[50vw]' : 'w-full h-full'} overflow-hidden rounded-t-lg p-[25px] z-20"
>
	<div class="flex justify-center">
		<div class="filter__container">
			<!-- DATE PICKER -->
			<div class="flex items-center justify-center p-[15px]">
				<div
					class="datepicker flex flex-row gap-[10px] items-center"
					data-mdb-toggle-button="false"
				>
				
				<span>

					<i class="bx bx-calendar" />
				</span>	
				<!--
					<Datepicker format="DD/MM/YYYY" bind:store={dateStore} theme={{calendar: {width: '500px'}}} />
-->
					<Datepicker bind:store={dateStore} let:key let:send let:receive>
						<button in:receive|local={{ key }} out:send|local={{ key }}>
							{#if $dateStore?.selected}
								{dayjs($dateStore.selected).format('DD/MM/YYYY')}
							{:else}
								Pick a Date
							{/if}
						</button>
					</Datepicker>

				</div>
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

<!--
<div class="flex flex-col absolute right-0 p-[25px] m-0 gap-[15px] z-10">
	<div class="btn__container">
		<div class="p-[10px]">
			<i class="bx bx-user" on:click={() => (isLoginModalOpen = true)} />
		</div>
		<div class="border-t-[1px] border-[#959896]" />
		<div class="p-[10px]">
			<i class="bx bx-moon" />
		</div>
	</div>

	<a href="/admin" class="btn__container">
		<div class="p-[10px]">
			<span>
				<i class="bx bx-crown" />
			</span>
		</div>
	</a>
</div>
-->

<!-- Span bottom edge -->
<div class="absolute left-0 bottom-0 w-full">
	<div class="absolute inset-x-0 bottom-0">
		{#if $currentlySelectedRoom}
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
						{#if $currentlySelectedRoom.hasProjector}
							<span class="label-text text-white">oui</span>
						{:else}
							<span class="label-text text-white">non</span>
						{/if}
					</div>
					<div>
						<div class="flex">
						<button class="btn btn-warning btn-outline w-32" on:click={cancelInput}>Annuler</button>
						{#if isReservationPossible}
							<button class="btn btn-success w-32" on:click={saveInput}>Réserver</button>							
						{:else}
							<button class="btn btn-failure w-32">Réserver</button>							
						{/if}
					</div>
					</div>
					<button class="btn btn-primary w-64" on:click={unselect}>OK</button>
					<div class="absolute bottom-2 left-0">
						{#if $currentlySelectedRoom}
							{#key timePlanKey}
								<TimePlan bind:isReservationPossible={isReservationPossible} bind:dataDay bind:infoDate bind:selectedDate1={infoModal1} bind:selectedDate2={infoModal2} reservations={getReservationsForDateAndRoom($dateStore.selected, $currentlySelectedRoom.name)}/>
							{/key}
						{/if}
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
				opacity: 0.75;
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
			opacity: 0.75;
		}
	}

	#searchBtn {
		cursor: pointer;
		font-size: var(--fs-l);
		color: white;
		&:hover {
			opacity: 0.75;
		}
	}
</style>
