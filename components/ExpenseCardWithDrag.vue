<template>
  <div 
    ref="cardRef" 
    class="flex items-center gap-2 relative bg-yellow-300 pr-2 rounded-md" 
    @dragstart="handleDrag" 
    @touchstart="handleDrag" 
    @touchend="handleTouchEnd"
    @touchmove="handleMoving"

  >
    <div class="h-[65px] bg-zinc-800 p-2.5 flex justify-between flex-1 border-none rounded-l-md" @click="handleActive">
      <div class="max-w-[180px] flex flex-col justify-between">
        <h1 class="font-semibold text-sm">{{ props.title }}</h1>
        <p class="text-xs truncate">{{ props.description }}</p>
      </div>
  
      <div class="flex flex-col justify-between text-right">
        <h1 class="font-semibold text-sm">{{ `${props.currency === 'EUR' ? '€' : ''} ${props.amount}` }}</h1>
        <p class="text-xs">{{ formatDate(props.date) }}</p>
      </div>
    </div>

    <template v-if="isEditModalOpen">
      <EditExpenseModal :is-modal-open="isEditModalOpen" :closeModal="()=> {isEditModalOpen = false}" :data="props">
        <button class="w-full flex justify-center items-center bg-gray-300 text-white font-semibold text-sm rounded-lg p-2.5 dark:bg-stone-900" @click="()=> {isEditModalOpen = !isEditModalOpen}">Cancel</button>
      </EditExpenseModal>
    </template>

    <template v-if="isDeleteModalOpen">
      <DeleteExpenseModal :is-modal-open="isDeleteModalOpen" :closeModal="()=> {isDeleteModalOpen = false}" :data="props">
        <button type="button" class="w-full flex justify-center items-center bg-gray-300 text-white font-semibold text-sm rounded-lg p-2.5 dark:bg-stone-900" @click="()=> {isDeleteModalOpen = !isDeleteModalOpen}">Cancel</button>
      </DeleteExpenseModal>
    </template>

 
  </div>
</template>

<script setup>
  import EditExpenseModal from '@/components/EditExpenseModal.vue'
  import DeleteExpenseModal from '@/components/DeleteExpenseModal.vue'
  import { formatDate } from '@/utils';
  import EditIcon from '@/components/icons/EditIcon.vue'
  import DeleteIcon from '@/components/icons/DeleteIcon.vue'
  
  const { $expenseStore, $toast } = useNuxtApp()

  const props = defineProps({
    id: String,
    title: String,
    description: String,
    amount: String,
    currency: String,
    date: String
  })

  const isActive = ref(false)
  const isEditModalOpen = ref(false)
  const isDeleteModalOpen = ref(false)
  const startX = ref(0)
  const startY = ref(0)
  const cardRef = ref(null)
  const startTimestamp = ref(0)
  const touchActive = ref(false)
  const handleActive = () => {
    isActive.value = !isActive.value
  }

  const handleDrag = (e) => {
    startX.value = e.touches[0].clientX;
    startY.value = e.touches[0].clientY;
    startTimestamp.value = e.timeStamp
    touchActive.value = true
    // isEditModalOpen.value = true
  }

  const handleTouchEnd = async (e) => {
    if (!touchActive.value) return

    const element = cardRef.value
    const elementWidth = element.getBoundingClientRect().width
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX.value;

    const clickDuration = e.timeStamp - startTimestamp.value
    
    if (clickDuration <= 300) {
      isEditModalOpen.value = true
      element.style.transform = `translateX(0px)`
      return
    }

    if (deltaX >= elementWidth / 1.35) {
      element.style.display = "none"
      const deleteResponse = await $expenseStore.deleteExpense(props.id)
      if (deleteResponse.message) {
        new $toast({
          id: 'expense_deleted_sucessfully_toast',
          message: 'Expense deleted sucessfully.',
          color: 'bg-green-500 text-white'
        })

        return 
      }

      new $toast({
        id: 'expense_deleted_sucessfully_toast',
        message: 'Failured to delete expense.',
        color: 'bg-red-500 text-white'
      })

    } 
    
    if (deltaX >= elementWidth / 2) {
      new $toast({
        id: 'expense_deleted_sucessfully_toast',
        message: 'Drag to the end to delete.',
        color: 'bg-red-500 text-white'
      })
      
      element.style.transform = `translateX(0px)`
      return
    } 

    element.style.transform = `translateX(0px)`


  }

  const handleMoving = (e) => {
    const positionY = e.touches[0].clientY;
    const position = e.touches[0].clientX;
    const element = cardRef.value

    const actualPosition = positionY - startY.value
  
    if (actualPosition >= 30 || actualPosition <= -30) {
      element.style.transform = `translateX(0px)`
      touchActive.value = false
      if (e.cancelable) e.preventDefault();
      return
    }

    element.style.transition = 'transform 0.1s'
    element.style.transform = `translateX(${position - 50}px)`
  }



</script>
