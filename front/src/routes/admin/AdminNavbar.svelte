<script lang="ts">
    export let tabActive: 'board' | 'editor' = 'board';
</script>

<div class="tabs">
  <a href="/admin" class="tab tab-bordered" class:tab-active={tabActive === 'board'}>Board</a> 
  <a href="/admin/editor" class="tab tab-bordered" class:tab-active={tabActive === 'editor'}>Editor</a> 
</div>