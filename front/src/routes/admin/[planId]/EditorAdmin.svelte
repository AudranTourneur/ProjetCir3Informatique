<script lang="ts">
	import { Floor } from '$lib/Floor';
	import type { Room } from '$lib/Room';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { writable, type Writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import type { Plan } from '../../../../../../back/src/types';
	import { goto } from '$app/navigation';

	export let plan: Plan;

	console.log('init data with', plan);

	let isAdding = false;
	let isModifying = false;
	let el: HTMLDivElement;

	let currentlySelectedRoom: Writable<Room | null> = writable(null);

	let inputName: string;
	let inputCapacity: number;
	let inputProjector: boolean;

	let tabPoint: number[][] = [];

	let points = [];

	let internalRooms = plan.rooms.map((room) => {
		points = room.points.map((p) => [p.x, p.y]);
		return {
			points: points,
			name: room.name,
			capacity: room.capacity,
			hasProjector: room.hasProjector
		};
	});

	let floor: null | Floor = null;

	console.log(
		'receiving',
		internalRooms.map((r) => r.points)
	);

	function getUnusedRoomName(): string {
		if (!floor) return '';
		const allRoomNames: string[] = floor.rooms.map((room) => room.name);
		console.log('All names', allRoomNames)
		let nameCandidate = 'Unnamed room'

		while (allRoomNames.includes(nameCandidate)) {
			nameCandidate = 'New '+ nameCandidate;
		}

		return nameCandidate;
	}

	let width = 0;
	let height = 0;

	onMount(() => {
		width = window.innerWidth;
		height = window.innerHeight;

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
			.attr('id', 'main-svg')
			.on('click', (event) => {
				if (isAdding) {
					let pointer = d3.pointer(event);
					if (tabPoint.length == 0) {
						tabPoint.push([pointer[0], pointer[1]]);

						svg
							.append('polyline')
							.attr('points', tabPoint.toString())
							.style('stroke', 'blue') // set the line colour
							.style('fill', 'none'); // set the fill colour

						svg
							.append('circle')
							.attr('cx', pointer[0])
							.attr('cy', pointer[1])
							.attr('r', 10) // set the radius
							.style('stroke', 'yellow') // set the line colour
							.style('fill', 'yellow') // set the fill colour
							.on('click', () => {
								isAdding = false;

								let data = {
									points: tabPoint,
									name: getUnusedRoomName(),
									capacity: 10,
									hasProjector: false,
								};
								floor.newRoom(data);

								console.log(data);

								tabPoint = [];
								svg.selectAll('circle').remove();
								svg.selectAll('polyline').remove();
							});
					} else {
						tabPoint.push([pointer[0], pointer[1]]);
						
						svg
							.append('polyline')
							.attr('points', tabPoint.toString())
							.style('stroke', 'blue') // set the line colour
							.style('fill', 'none'); // set the fill colour

						svg
							.append('circle')
							.attr('cx', pointer[0])
							.attr('cy', pointer[1])
							.attr('r', 4) // set the radius
							.style('stroke', 'red') // set the line colour
							.style('fill', 'red'); // set the fill colour

					
					}
				}
			});

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
					hasProjector: r.hasProjector
				};
			});

			floor = new Floor(internalRooms, 'Name', currentlySelectedRoom);

			floor.update();
		};

		setTimeout(updateHeight, 1);
	});

	function cancelSelection() {
		isAdding = false;
		tabPoint = [];
		const svg = d3.select('#main-svg');
		svg.selectAll('circle').remove();
		svg.selectAll('polyline').remove();
	}

	function startDraw() {
		isAdding = true;
	}

	function updateInputs() {
		if (!$currentlySelectedRoom) return;

		inputName = $currentlySelectedRoom.name;
		inputCapacity = $currentlySelectedRoom.capacity;
		inputProjector = $currentlySelectedRoom.hasProjector;
		isNameInvalid = false;
	}

	function unselect() {
		d3.selectAll('#main-svg > polygon').attr('stroke', '#f00');
		firstTime = false;
		$currentlySelectedRoom = null;
	}

	function saveInput() {
		if (!$currentlySelectedRoom) return;

		$currentlySelectedRoom.name = inputName;
		$currentlySelectedRoom.capacity = inputCapacity;
		$currentlySelectedRoom.hasProjector = inputProjector;

		unselect();
	}
	function cancelInput() {
		console.log('cancel')
		unselect();
		if (!$currentlySelectedRoom) return;
		inputName = $currentlySelectedRoom.name;
		inputCapacity = $currentlySelectedRoom.capacity;
		inputProjector = $currentlySelectedRoom.hasProjector;
	}

	function edit() {
		if (!$currentlySelectedRoom) return;
		isModifying = true;
		$currentlySelectedRoom.editPolygon();
	}

	let firstTime = false;

	$: {
		if ($currentlySelectedRoom) {
			console.log('yo')
			updateInputs()
		}
		//if ($currentlySelectedRoom && !firstTime) {
		//	firstTime = true;
//
		//	inputName = $currentlySelectedRoom!.name;
		//	inputCapacity = $currentlySelectedRoom!.capacity;
		//	inputProjecteur = $currentlySelectedRoom!.projecteur;
		//}
	}

	function del() {
		if (!$currentlySelectedRoom || !floor) return;
		floor.delete($currentlySelectedRoom);
		floor.update();
		unselect();
	}

	async function finishEdition() {
		isAdding = false;
		isModifying = false;
		if ($currentlySelectedRoom) {
			$currentlySelectedRoom.stopEditPolygon();
		}

		console.log('floor = ', floor);

		const body = {
			email: localStorage.getItem('email'),
			token: localStorage.getItem('token'),
			plan: {
				...plan,
				rooms: floor.rooms.map((r) => {
					return {
						name: r.name,
						points: r.points.map((e) => ({ x: e[0] / width, y: e[1] / height })),
						capacity: r.capacity,
						hasProjector: r.hasProjector,
						hasWhiteboard: false,
						hasBlackboard: false,
						description: ''
					};
				})
			},
			test: 'oui'
		};

		console.log('body', body);

		await fetch(`${PUBLIC_API_HOST}/updatePlan`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		console.log(
			'sending',
			body.plan.rooms.map((r) => r.points)
		);

		goto('/admin')
		setTimeout(() => {
			location.reload()
		}, 300)
	}

	function endEditMode() {
		isAdding = false;
		isModifying = false;
		if ($currentlySelectedRoom) {
			$currentlySelectedRoom.stopEditPolygon();
		}
		$currentlySelectedRoom = null;
	}

	let isNameInvalid = false;

	function checkNameValidity() {
		if (!$currentlySelectedRoom || !floor) return;
		const allRoomNames: string[] = floor.rooms.map((room) => room.name);
		isNameInvalid = allRoomNames.includes(inputName)
		console.log('check', inputName, 'vs', allRoomNames, isNameInvalid)
	}

	function manageResize() {
		console.log('resize')
	}
</script>

<svelte:window on:resize={manageResize} />

<div class="absolute overflow-hidden" bind:this={el} />

<!-- Span bottom edge -->
<div class="absolute left-0 bottom-0 w-full">
	<div class="absolute inset-x-0 bottom-0">
		{#if !$currentlySelectedRoom}
			<div class="flex justify-center  bg-black bg-opacity-50 p-2 gap-2" transition:slide>
				{#if !isAdding}
					<button class="btn btn-primary" on:click={startDraw}>Dessiner des salles</button>
					<button class="btn btn-success" on:click={finishEdition}>Terminer l'édition</button>
				{:else}
					<button class="btn btn-warning" on:click={cancelSelection}>Cancel</button>
				{/if}
			</div>
		{:else if !isModifying}
			<div class="flex justify-center  bg-black bg-opacity-70 p-2 h-[400px]" transition:slide>
				<div class="flex flex-col gap-2">
					<div class="form-control w-full max-w-xs">
						<label for="input-nom" class="label">
							<span class="label-text text-white">Nom de la salle</span>
						</label>
						<input
							id="input-nom"
							bind:value={inputName}
							on:input={checkNameValidity}
							type="text"
							placeholder="Type here"
							class="input input-bordered w-full max-w-xs input-sm input-info"
						/>
						{#if isNameInvalid}
							<div class="text-red-500">Ce nom est déjà utilisé</div>
						{/if}
					</div>

					<div class="form-control w-full max-w-xs">
						<label for="input-capacite" class="label">
							<span class="label-text text-white">Capacité de la salle</span>
						</label>
						<input
							id="input-capacite"
							bind:value={inputCapacity}
							type="text"
							placeholder="Type here"
							class="input input-bordered w-full max-w-xs input-sm input-info"
						/>
					</div>

					<div class="text-white">
						Projecteur :
						<input class="toggle toggle-info" type="checkbox" bind:checked={inputProjector} />
					</div>
					<div class="mt-8 flex flex-col gap-6">
						<div class="flex gap-4">
							<button class="btn btn-info w-32" on:click={edit}>Modifier</button>
							<button class="btn btn-error w-32" on:click={del}>Supprimer</button>
						</div>

						<div class="flex gap-4">
							<button class="btn btn-warning btn-outline w-32" on:click={cancelInput}>Annuler</button>
							<button class="btn btn-success w-32" on:click={saveInput} disabled={isNameInvalid}>OK</button>
						</div>
					</div>	
				</div>
			</div>
		{:else}
			<div class="flex justify-center  bg-black bg-opacity-70 p-2" transition:slide>
				<button class="btn btn-info" on:click={endEditMode}>Terminer la modification des salles</button>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(html, body) {
		overflow: hidden;
	}
</style>
