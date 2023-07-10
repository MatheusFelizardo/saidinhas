<template>
  <Teleport to="#main-layout">

    <div ref="deleteExpenseModalRef" 
    id="delete-expense-modal" 
    class="pointer-events-auto translate-x-[100%] h-[calc(100%-184px)] fixed w-full bottom-0 bg-indigo-500 rounded-t-[46px] p-4">
      <h3 class="text-xl text-white font-light mt-[30px] mb-3 text-center">Deleting <span class="font-bold text-white uppercase">{{ props.data.title }}</span></h3>

      <form @submit.prevent="onSubmit">
        <p class="font-semibold text-white text-left mb-2">Are you sure you want to delete this expense?</p>
        <!-- change irreversible div -->
        <div class="text-left">
          <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
            <p>This action is <strong>irreversible</strong>, once you delete this expense, you won't be able to recover it.</p>
          </div>
        </div>

        <template v-if="!isDeleting">
          <!-- button submit -->
          <button 
            type="submit" 
            class="mt-2 w-full flex justify-center items-center bg-red-500 text-white font-bold text-sm rounded-lg p-2.5 mb-3">DELETE</button>
            <button type="button" class="w-full flex justify-center items-center bg-gray-300 text-zinc-800 font-bold text-sm rounded-lg p-2.5 " @click="handleCloseModal">CANCEL</button>
        </template>
        <template v-else>
          <!-- show deleting text with spinning -->
          <div class="flex items-center mt-4 gap-2">
            <SpinIcon class="text-white" />
            <span class="text-white">Deleting</span>
          </div>
        </template>
      </form>
    </div>
  </Teleport>
</template>

<script setup>
  import SpinIcon from '@/components/icons/SpinIcon.vue'
  import gsap from 'gsap'

  const { $expenseStore, $toast } = useNuxtApp()
  const props = defineProps({
    isModalOpen: Boolean,
    closeModal: Function,
    data: {
      id: String,
      title: String,
      description: String,
      amount: String,
      currency: String,
      date: String
    }
  })
  const isDeleting = ref(false)
  const deleteExpenseModalRef = ref(null)

  onBeforeUnmount(()=> {
    const mainLayout = document.querySelector('#main-layout')
    mainLayout.style.overflow = ''
    mainLayout.style.pointerEvents = ''
  })

  onMounted(() => {
    
    setTimeout(()=> {
      gsap.to('#delete-expense-modal', {x: 0, duration: 0.3, onComplete: () => {
        const mainLayout = document.querySelector('#main-layout')
        mainLayout.style.overflow = 'hidden'
        mainLayout.style.pointerEvents = 'none'

        window.addEventListener('click', detectClickOutside)
        
      }})
    })
  })

  const onSubmit = async (e) => {
    isDeleting.value = true
    const response = await $expenseStore.deleteExpense(props.data.id)
    handleCloseModal()
    isDeleting.value = false

    if (!response.error) {
      new $toast({
        id: 'expense_delete_sucessfully_toast',
        message: 'Expense deleted sucessfully.',
        color: 'bg-green-500 text-white'
      })
    } else {
      new $toast({
        id: 'expense_delete_error_toast',
        message: 'Failure on delete the expense.',
        color: 'bg-red-500 text-white'
      })
    }
  }

  const handleCloseModal = () => {
    gsap.to('#delete-expense-modal', {x: '100%', duration: 0.3, onComplete: ()=> {
      props.closeModal()
    }})
  }

  const detectClickOutside = (e) => {
    if (props.isModalOpen && deleteExpenseModalRef?.value) {
      if (deleteExpenseModalRef?.value.contains(e.target)) {
        return
      }
      handleCloseModal()
    }
  }

</script>
