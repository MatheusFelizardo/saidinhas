<template>
  <div v-if="!selectedMonth">
    <Menu v-if="authenticated">
     <div class="flex flex-col relative justify-center items-center gap-1">
        <button 
        @click="()=> {isModalOpen = true}" 
        class="bg-yellow-300 p-2 flex justify-center items-center rounded-md font-semibold min-w-[160px] text-sm">
        add new expense 
      </button>

      <NuxtLink 
        to="/dashboard"
        class="text-sm text-indigo-300 font-bold">
        back to dashboard
      </NuxtLink >
     </div>
    </Menu>
    <MenuSkeleton v-else />


    <main>
      <header class="h-[60px] p-5 my-2 flex justify-center items-center">
        <div>
          <div v-if="expenses.length === 0 && !loading">
            <h1 class=" text-white font-semibold">Please add your first expense</h1>
          </div>
          <h1 
            v-else 
            :class="expenses.length === 0 && loading ? 'bg-gray-50 text-gray-50 px-4' : '' " 
            class=" text-white text-xl font-semibold text-center">You spent <span class="text-yellow-300 font-bold">

              {{getCurrencySymbol(user.currency)}}{{totalOfThisMonth.toFixed(2)}}
            </span> in 
            <NuxtLink :to="currentMonth && `/expenses/${currentMonth}`">
              {{currentMonth}}
            </NuxtLink>
          </h1>
            
          <div 
          v-if="hasExpenseInAnotherMonth" 
          @click="showFilterModal = true" 
          class="mt-3 text-white text-center text-sm flex items-center justify-center gap-2">
            <p>
              Explore other months' expenses
            </p>
            <span>
              <FilterExpenseIcon />
            </span>
          </div>

          </div>
  
        
      </header>
  
      <section class=" mt-5">
        <div class="pb-4 h-full max-h-full overflow-hidden bg-indigo-500 rounded-t-[46px] relative">
          
  
          <header 
          class="flex justify-center items-center pt-4 ">
            <h2 class="text-white font-light text-md ">Here are your expenses</h2>
  
            <div class="relative left-1 -top-0.5">
              <InfoMarkerIcon class="text-white w-[20px] h-[20px]" @click="showExpenseInfoModal = !showExpenseInfoModal" />
            </div>
          </header>
  
          <div id="cards_wrapper" class="relative overflow-auto">
            <div class="p-2.5 text-white flex flex-col gap-2">
              <div v-if="expenses.length === 0 && loading">
                Loading...
              </div>
  
              <div class="text-white" v-if="expenses.length === 0 && !loading">
                No expenses found
              </div>
  
              <template v-else v-for="(expense) in expensesReverseList" :key="expense.id" >
                <ExpenseCard :id="expense.id" :title="expense.title" :description="expense.description" :amount="expense.amount" :currency="expense.currency" :date="expense.created_at" />
              </template>
             
            </div>
            
          </div>
        </div>
        <!-- todo: condition v-if to show see more button -->
      </section>
  
      <template v-if="isModalOpen">
        <AddExpenseModal  :is-modal-open="isModalOpen" :closeModal="closeModal" />
      </template>
  
      <template v-if="showExpenseInfoModal">
        <ExpenseInfoModal :close="handleCloseExpenseInfoModal"/>
      </template>
      
      <template v-if="showFilterModal">
        <FilterExpenseModal :isOpen="showFilterModal" :closeModal="()=> showFilterModal = false" />
      </template>
    </main>
  </div>
  <template v-else>
    <NuxtPage />
  </template>
</template>

<script setup>
  import Menu from '@/components/Menu.vue'
  import InfoMarkerIcon from '@/components/icons/InfoMarkerIcon.vue'
  import ExpenseInfoModal from '@/components/ExpenseInfoModal.vue'
  import AddExpenseModal from '@/components/AddExpenseModal.vue'
  import { storeToRefs } from 'pinia';
  import FilterExpenseIcon from '~/components/icons/FilterExpenseIcon.vue';
  import { capitalize, getCurrencySymbol } from '~/utils';
import MenuSkeleton from '~/components/skeletons/MenuSkeleton.vue';
  const { $expenseStore, $userStore } = useNuxtApp()
  const { expenses, totalOfThisMonth, currentMonth, hasExpenseInAnotherMonth } = storeToRefs($expenseStore)
  const { user, token, authenticated } = storeToRefs($userStore)
  const loading = ref(true)
  const isModalOpen = ref(false)
  const totalOnThisMonth = ref(0)
  const showExpenseInfoModal = ref(false)
  const showFilterModal = ref(false)
  const route = useRoute()
  const selectedMonth = ref(null)

  const expensesReverseList = computed(() => {
    return [...expenses.value].reverse()
  })

  const closeModal = () => {
    isModalOpen.value = false
  }

  onMounted(async () => {
    const infoModalStorage = localStorage.getItem('infoModal') 

    if (!infoModalStorage) {
      showExpenseInfoModal.value = true
    } 

    if (route.params.month) {
      selectedMonth.value = capitalize(route.params.month)
    }

    if (expenses.value.length > 0 ) {
      return loading.value = false
    }

    const loggedUser = await $userStore.loggedUser()

    if (loggedUser.error) {
      navigateTo('/')
      return
    }
    const response = await $expenseStore.getAllExpenses($userStore.user.id)

    if (expenses.value.length === 0) {
      loading.value = false
      return
    }
 
    totalOnThisMonth.value = await $expenseStore.calcTotalOfCurrentMonth()
    loading.value = false
  })

  const handleCloseExpenseInfoModal = () => {
    showExpenseInfoModal.value = !showExpenseInfoModal

    localStorage.setItem('infoModal', 'true')
  }

  watchEffect(()=> {
    if (route.params.month) {
      selectedMonth.value = capitalize(route.params.month)
    }
  })

</script>