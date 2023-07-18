<template>
    <nav class="animate-pulse">
      <div class="relative p-5 flex justify-between items-center">
        
        <button 
          class="w-16 h-16 rounded-full mr-2 bg-slate-200 flex justify-center items-center">
        </button>
  
        <button 
          disabled
          class="bg-slate-200 p-2 flex justify-center items-center rounded-md font-semibold min-w-[160px] text-sm">
        </button>
      </div>
    </nav>
</template>

<script setup> 
  import LogoutIcon from '@/components/icons/LogoutIcon.vue'
  import { storeToRefs } from 'pinia';
  import { gsap } from 'gsap'

</script>