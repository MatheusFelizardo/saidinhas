<template>

  <Teleport to="#main-layout">
    <div ref="editExpenseModalRef" id="edit-expense-modal" class="pointer-events-auto translate-y-[100%] fixed w-full h-[calc(100%-184px)] bottom-0 bg-indigo-500 rounded-t-[46px] p-4">
      
      <form @submit.prevent="onSubmit">
        <h3 class="text-xl font-light mb-6 mt-0 text-white text-center">Editing your expense</h3>
        <div class="mb-5">
            <label for="title" class="block mb-0.5 text-xs font-bold text-white">TITLE*</label>
            <input 
              :value="props.data.title"
              type="text" 
              id="title" 
              class="bg-transparent border-b border-gray-300 text-white text-sm outline-none  block w-full py-1 placeholder-white placeholder-opacity-20 " placeholder="Coffee at the bakery" required>
        </div>

        <div class="mb-5">
          <label for="description" class="block mb-0.5 text-xs font-bold text-white">ADITIONAL NOTE</label>
          <input 
              :value="props.data.description"
              type="text" 
              id="description" 
              class="bg-transparent border-b border-gray-300 text-white text-sm outline-none  block w-full py-1 placeholder-white placeholder-opacity-20 " placeholder="I forgot to eat at home">
        </div>

        <div class="mb-5">
          <div>
            <label for="amount" class="block mb-0.5 text-xs font-bold text-white">PRICE</label>
            <input 
            :value="Number(props.data.amount).toFixed(2)"
            type="text"
            @input="validateInputNumber" 
            id="amount" 
            class="bg-transparent border-b border-gray-300 text-white text-sm outline-none  block w-full py-1 placeholder-white placeholder-opacity-20 " placeholder="10" required>
          </div>
        </div>

        <div class="mb-5">
          <label for="currency" class="block mb-0.5 text-xs font-bold text-white">CURRENCY</label>
          <select disabled id="currency" class="bg-transparent border-b border-gray-300 text-white text-sm outline-none  block w-full py-1 placeholder-white placeholder-opacity-20 ">
            <option value="EUR">Euro</option>
            <option value="USD">Dolar</option>
            <option value="BRL">Real</option>
            <option value="GBP">Pound Sterling</option>
          </select>
        </div>


        <div class="mt-6">
          <template v-if="!isSaving">
            <!-- button submit -->
            <button type="submit" class="w-full flex justify-center items-center bg-yellow-300 text-zinc-800 font-semibold text-sm p-1.5 rounded-sm mb-3">SAVE</button>
            <!-- button cancel -->
            <button 
            type="button" 
            class="w-full flex justify-center items-center bg-gray-200 text-zinc-800 font-semibold text-sm p-1.5 rounded-sm" @click="handleCloseModal">CANCEL</button>
          </template>
          <template v-else>
            <div class="flex items-center gap-2 mb-3 text-white">
              <SpinIcon class="text-white" />
              <span>Saving changes...</span>
            </div>
          </template>
        </div>
      </form>
    </div>
  </Teleport>
</template>

<script setup>
  import SpinIcon from './icons/SpinIcon.vue';
  import gsap from 'gsap'
  import { validateInputNumber } from '../utils'
  import { storeToRefs } from 'pinia';

  const { $expenseStore, $toast, $userStore } = useNuxtApp()
  const { user } = storeToRefs($userStore)

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
    },
    updateDataEvent: Function
  })

  const emits = defineEmits(['updateDataEvent']);

  const isSaving = ref(false)
  const editExpenseModalRef = ref(null)

  onMounted(() => {
    setTimeout(()=> gsap.to('#edit-expense-modal', {y: 0, duration: 0.3, onComplete: () => {
      const mainLayout = document.querySelector('#main-layout')
      mainLayout.style.overflow = 'hidden'
      mainLayout.style.pointerEvents = 'none'

      window.addEventListener('click', detectClickOutside)

      const currency = document.getElementById('currency')
      currency.value = user.value.currency || 'EUR'
      
    }}), 100)

    const currency = document.getElementById('currency')
    currency.value = props.data.currency
  })

  onBeforeUnmount(()=> {
    const mainLayout = document.querySelector('#main-layout')
    mainLayout.style.overflow = ''
    mainLayout.style.pointerEvents = ''
  })

  const onSubmit = async (e) => {
    const form = e.target
    const title = form.title.value
    const description = form.description.value
    const amount = parseFloat(form.amount.value).toFixed(2)
    const currency = form.currency.value


    if ( title === props.data.title && 
      (description || null) === props.data.description  && 
      amount === props.data.amount ) {
        handleCloseModal()
        return
    } 

    const formatedData = {
      id: props.data.id,
      title,
      description,
      amount,
      currency
    }

    const newData = await $expenseStore.updateExpense(formatedData)

    emits('updateDataEvent')

    if (!newData.error) {
      new $toast({
        id: 'expense_update_sucessfully_toast',
        message: 'Expense updated sucessfully.',
        color: 'bg-green-500 text-white'
      })
      
    } else {
      new $toast({
        id: 'expense_update_error_toast',
        message: 'Failure on update expense.',
        color: 'bg-red-500 text-white'
      })
    }
    handleCloseModal()
  }

  const handleCloseModal = () => {
    gsap.to('#edit-expense-modal', {y: '100%', duration: 0.3, onComplete: ()=> {
      props.closeModal()
    }})
  }

  const detectClickOutside = (e) => {
    if (props.isModalOpen && editExpenseModalRef?.value) {
      if (editExpenseModalRef?.value.contains(e.target)) {
        return
      }
      handleCloseModal()
    }
  }
  


</script>
