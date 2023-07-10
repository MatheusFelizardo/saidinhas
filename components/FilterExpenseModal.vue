<template>
  <Teleport to="#main-layout">
    <div 
      ref="filterModalRef" 
      class="py-4 pointer-events-auto absolute top-[184px] translate-x-[100%] w-full min-h-[80px] bg-red-400">
      <button @click="handleCloseModal" class="text-white absolute right-1 top-1">
        <CloseIcon class="w-[26px] h-[26px]" />
      </button>

      <div class="flex flex-col justify-center items-center h-full w-full">
        <div class="text-white text-center text-xl">
          <p>
            Please select the month 
          </p>
        </div>

        <CustomSelect :options="monthsWithExpenses" :selected="selected" @updateSelected="handleUpdateSelected"/>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
  import gsap from 'gsap'
  import { storeToRefs } from 'pinia';
  import CloseIcon from './icons/CloseIcon.vue';
  import CustomSelect from './CustomSelect.vue';
  import { capitalize } from '~/utils';

  const { $expenseStore, $userStore, $toast } = useNuxtApp()
  const { monthsWithExpenses } = storeToRefs($expenseStore)
  const filterModalRef = ref(null)
  const selected = ref(null)
  const route = useRoute()
  
  const props = defineProps({
    isOpen: Boolean,
    closeModal: Function
  })

  onUnmounted(()=> {

    const mainLayout = document.querySelector('#main-layout')
    mainLayout.style.overflow = ''
    mainLayout.style.pointerEvents = ''
  })

  onMounted(() => {
    setTimeout(()=> {
      gsap.to(filterModalRef.value, {
        x: 0,
        duration: 0.3,
        onComplete: () => {
          const mainLayout = document.querySelector('#main-layout')
          mainLayout.style.overflow = 'hidden'
          mainLayout.style.pointerEvents = 'none'

        }
      })

    }, 100)
  })

  const handleCloseModal = () => {
    gsap.to(filterModalRef.value, {
      x: '100%',
      duration: 0.3,
      onComplete: () => {
        const mainLayout = document.querySelector('#main-layout')
        mainLayout.style.overflow = ''
        mainLayout.style.pointerEvents = ''
        props.closeModal()
      }
    })
  }

  const handleUpdateSelected = (value) => {
    selected.value = value

    if (value === capitalize(route?.params.month)) {
      new $toast({
        id: 'failure_to_filter_toast',
        message: 'You are already on this month.',
        color: 'bg-red-500 text-white'
      })


      return props.closeModal()
    }

    setTimeout(()=> {
      handleCloseModal()      
    }, 1000)

    setTimeout(()=> {
      navigateTo(`/expenses/${value.toLowerCase()}`)
      new $toast({
        id: 'sucessfully_filtered_toast',
        message: `Filtered to ${value} sucessfully.`,
        color: 'bg-green-500 text-white'
      })
    }, 1500)
  }

</script>