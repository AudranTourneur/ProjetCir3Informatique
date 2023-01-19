<script>
    import { TimePicker } from 'svelte-time-picker'
    import Modal from '$lib/ui/Modal.svelte'
    import { fade } from 'svelte/transition'

    export let infoModal;
    export let showModal;



    let date = infoModal;

    console.log(date);

    let options = {
        /* Global colors */
        bgColor: '#2f855a',
        /* Components styles */
        buttonClassName: 'buttons-button',
        buttonBarClassName: 'buttons-bar',
        timeClassName: 'buttons-time',
        /* Options */
        minutesIncrement: 5,
        hasButtons: true,
        is24h: true,
        zIndex: 200
    }

    function cancelCallback () {
        showModal = false
    }
    function changeCallback () {
    }
    function okCallback (event) {
        infoModal = event.detail
        showModal = false
    }
    function closeCallback() {
        showModal = false
    }
</script>

<Modal bind:isActive={showModal}>
    <div slot="title">Choisir l'Horaire</div>
    <div slot="content" class="flex">
    <TimePicker {options} {date}
        on:ok={okCallback}
        on:cancel={cancelCallback}
        on:close={closeCallback}
        on:change={changeCallback}
        />
    </div>
</Modal>

<style>
    .buttons-bar {
        border-bottom-left-radius: 0.75rem;
        border-bottom-right-radius: 0.75rem;
    }
    .buttons-button {
        border-radius: 0.5rem;
        border: 1px solid #fed7d7;
        color: #9b2c2c !important;
    }
    .buttons-button:hover {
        background-color: #9b2c2c !important;
        color: #fff !important;
    }
    .buttons-time {
        background-color: #9b2c2c;
        border-top-left-radius: 0.75rem;
        border-top-right-radius: 0.75rem;
    }
</style>