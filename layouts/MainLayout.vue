<template>
  <div id="main-layout" class="h-full pb-5 max-w-[475px] m-auto bg-zinc-800 relative overflow-x-hidden overflow-y-auto shadow-white shadow-2xl">
    <div id="menu_wrapper" class="sticky top-0 bg-zinc-800 z-10">

    </div>
    <slot></slot>
  </div>
</template>

<script setup>
  import Menu from '@/components/Menu.vue'
  import { storeToRefs } from 'pinia';
  const { $userStore } = useNuxtApp()
  const { authenticated } = storeToRefs($userStore)
</script>
