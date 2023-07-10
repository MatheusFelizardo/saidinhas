<template>
  <Teleport to="#__nuxt">
    <div ref="modalRef" class="absolute w-[90%] translate-y-[-300%] p-2 pb-4 bg-purple-700 top-[20%] left-[50%] translate-x-[-50%] rounded-lg ">
      <!-- <p class="text-white font-semibold text-md mb-4">Infos</p> -->
      <button @click="close" role="button" class="absolute right-1 top-1" >
        <CloseIcon class="text-white font-bold" />
        <span class="sr-only">Close button</span>
      </button>

      <div class="text-white text-md text-center mt-[30px]">
        <p class="text-left mt-2">
          The total value showed in the dashboard is the sum of all expenses in the current month. But the dashboard can show expense from other months too if you had just few expenses registered in the current month. You can click in the month name to see just the expenses from that month.
          
        </p>

        <p class="flex items-center text-left mt-4">
          Tap the expense to edit (<EditIcon class="inline w-[18px]" />) or delete (<DeleteIcon class="inline w-[22px]" />).
        </p>

        <p class="flex items-center text-left mt-4">
          You can also filter expenses by month (<FilterExpenseIcon class="inline w-[18px]" />).
        </p>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
  import EditIcon from '@/components/icons/EditIcon.vue'
  import DeleteIcon from '@/components/icons/DeleteIcon.vue'
  import CloseIcon from '@/components/icons/CloseIcon.vue'
  import FilterExpenseIcon from './icons/FilterExpenseIcon.vue';
  import gsap from 'gsap'
  const modalRef = ref(null)

  onMounted(() => {
    setTimeout(() => {
      gsap.to(modalRef.value, {
        y: 0,
        duration: 1,
        ease: 'bounce.out',
      })
    }, 100)
  })

  const props = defineProps({
    close: Function
  })
</script>
