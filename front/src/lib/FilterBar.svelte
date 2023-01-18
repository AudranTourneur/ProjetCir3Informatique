<script>
    import { Datepicker } from 'svelte-calendar';
</script>

<div class="filter__container">
    <Datepicker format="DD/MM/YYYY"></Datepicker>
</div>


<style lang="scss">
    .filter__container {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      border: 1px solid white;
      border-radius: 5px;
      padding: 10px;
      background-color: white;
    }

    input[type="date"], input[type="time"] {
      border: none;
      border-radius: 4px;
      font-size: 16px;
      padding: 12px;
      background-color: #f2f2f2;
      color: #333333;
      width: 100%;
      margin-bottom: 20px;
    }

    button {
      border: none;
      border-radius: 4px;
      padding: 12px;
      background-color: #007aff;
      color: #ffffff;
      font-size: 16px;
      cursor: pointer;
      width: 100%;
      margin-top: 20px;
    }

</style>