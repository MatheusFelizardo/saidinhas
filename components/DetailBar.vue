<template>
  <div :class="props.isPageLoading ? 'text-slate-200 bg-slate-200 w-fit m-auto' : 'bg-blue-300' "  class="w-full h-[10px] "></div>
  <div :class="props.isPageLoading ? 'text-slate-200 bg-slate-200 w-fit m-auto' : 'bg-blue-300'" class="w-full h-[10px] fixed bottom-0 max-w-[475px]"></div>
</template>

<script setup>
  const props = defineProps({
    color: String,
    isPageLoading: Boolean
  })
</script>