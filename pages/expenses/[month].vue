<template>
  <Teleport to="#main-layout" >
    <div>
      <Menu v-if="authenticated">
        <NuxtLink 
          to="/dashboard"
          class="bg-yellow-300 p-2 flex justify-center items-center rounded-md font-semibold min-w-[160px] text-sm">
          back to dashboard
        </NuxtLink>
      </Menu>

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
              class="mt-3 text-white text-center text-sm flex items-center gap-2">
                <p>
                  Browse expenses from different months
                </p>
                <span>
                  <FilterExpenseIcon />
                </span>
              </div>

            </div>
    
          
        </header>
    
        <section class="mt-5 ">
          <div class=" h-full max-h-full overflow-hidden bg-indigo-500 rounded-t-[46px] relative pb-10">
            
            <header 
            class="flex justify-center items-center pt-4 mb-4">
              <h2 class="text-white font-light text-md ">Your expenses in <strong>{{ selectedMonth }}</strong></h2>
            </header>
    
            <div id="cards_wrapper" class="relative overflow-auto">
              <div class="p-2.5 text-white flex flex-col gap-2">
                <div v-if="expenses.length === 0 && loading">
                  Loading...
                </div>
    
                <div class="text-white" v-if="expenses.length === 0 && !loading">
                  No expenses found
                </div>
    
                <template v-else v-for="expense in expensesReverseList" :key="expense.id">
                  <ExpenseCard 
                    @updateDataEvent="handleUpdateDataEvent"
                    :id="expense.id" 
                    :title="expense.title" 
                    :description="expense.description" 
                    :amount="expense.amount" 
                    :currency="expense.currency" 
                    :date="expense.created_at" 
                  />
                </template>
              </div>
              
            </div>
          </div>
          <!-- todo: condition v-if to show see more button -->
        </section>
        
        <template v-if="showFilterModal">
          <FilterExpenseModal :isOpen="showFilterModal" :closeModal="()=> showFilterModal = false" />
        </template>
      </main>
    </div>
  </Teleport>
</template>

<script setup>
  import Menu from '@/components/Menu.vue'
  import InfoMarkerIcon from '@/components/icons/InfoMarkerIcon.vue'
  import AddExpenseModal from '@/components/AddExpenseModal.vue'
  import { storeToRefs } from 'pinia';
  import { capitalize, getCurrencySymbol } from '~/utils';
  import FilterExpenseIcon from '~/components/icons/FilterExpenseIcon.vue';
  
  const route = useRoute()
  const { $expenseStore, $userStore, $toast } = useNuxtApp()
  const { hasExpenseInAnotherMonth, currentMonth } = storeToRefs($expenseStore)
  const selectedMonth = ref(null)
  const { user, token, authenticated } = storeToRefs($userStore)
  const loading = ref(true)
  const showExpenseInfoModal = ref(false)
  const showFilterModal = ref(false)
  const expenses = ref([])
  const totalOfThisMonth = ref(0)
  const expensesReverseList = computed(() => {
      return [...expenses.value].reverse()
    }
  )

  // TODO: update state after remove or edit an expense in the current month

  onMounted(async () => {
    await getMonthData()
    
    const infoModalStorage = localStorage.getItem('infoModal') 
    if (!infoModalStorage) {
      showExpenseInfoModal.value = true
    } 

    if (expenses.value.length > 0 ) {
      return loading.value = false
    }

    const loggedUser = await $userStore.loggedUser()
    if (loggedUser.error) {
      navigateTo('/')
      return
    }

    loading.value = false
  })

  const handleUpdateDataEvent = async () => {
    await getMonthData()
  }

  const getMonthData = async () => {
    const month =  capitalize(route.params.month)
    selectedMonth.value = month
    const expensesResp = await $expenseStore.getExpenseByMonth(month)
    expenses.value = expensesResp
    totalOfThisMonth.value = await $expenseStore.calcTotalOfCurrentMonth(month, expensesResp)
  }

  watchEffect(async ()=> {
    if (user?.value.currency) {
      await getMonthData()
    }
  })
</script>