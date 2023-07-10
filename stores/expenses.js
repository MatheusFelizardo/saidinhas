import { defineStore } from 'pinia'
import axios from '../plugins/axios'
import { getMonthName } from '~/utils'
import { useUserStore } from './user'

const $axios = axios().provide.axios

export const useExpenseStore = defineStore('expense', {
  state: () => (
    {
      expenses: [],
      totalOfThisMonth: 0,
      currentMonth: '',
      expensesByMonth: new Map(),
      hasExpenseInAnotherMonth: false,
      monthsWithExpenses: []
    }
  ),
  getters: {
    // doubleCount: (state) => state.count * 2,
    
  },
  actions: {
    async getAllExpenses(id) {
      this.currentMonth = getMonthName(new Date().getMonth() + 1)

      try {
        const savedUser = await useUserStore().loggedUser()
        const response = await $axios.get('/expenses', { params: { user_id: id || savedUser?.user.id } })
        this.expenses = response.data
        
        await this.getExpenseByMonth()
        await this.checkIfHasExpensiveInAnotherMonth()
        await this.getMonthsWithExpenses()

        return response.data
      } catch(e) {
        return e.response.data
      }
    },
    async addExpense(expense) {
      try {
        const response = await $axios.post('/expenses', expense)

        this.expenses.push(response.data.expense)
        this.totalOfThisMonth = 0
        this.calcTotalOfCurrentMonth()
        return this.expenses
      } catch(e) {
        return {
          error: e
        }
      }
     
    },
    async deleteExpense(id) {
      try {
        const response = await $axios.delete(`/expenses/${id}`)
        this.expenses = this.expenses.filter(expense => expense.id !== id)
        this.totalOfThisMonth = 0
        this.calcTotalOfCurrentMonth()

        return response.data;
      } catch (e) {
        return {
          error: e
        }
      }
    },
    async updateExpense(expense) {
      try {
        const response = await $axios.put(`/expenses/${expense.id}`, expense)
        this.expenses = this.expenses.map(exp => exp.id === expense.id ? response.data.expense : exp)
        this.totalOfThisMonth = 0
        this.calcTotalOfCurrentMonth()

        return response.data.expense;
      } catch (e) {
        return {
          error: e.response.data.error
        }
      }
    },
    async calcTotalOfCurrentMonth(month, expense) {
      // To do: Use currency API to convert the saved currencies to the selected one (EUR as default)
      
      if (month) {
        let total = 0
        const expenseOnThisMonth = expense.filter(expense => {
          const monthValue = new Date(expense.created_at).getMonth() + 1
          
          if (getMonthName(monthValue) === month) {
            return expense
          }
        })

        expenseOnThisMonth.forEach(expense => {
          total += Number(expense.amount)
        })
  
        return parseFloat(total)
      }
      
      const currentMonth = new Date().getMonth() + 1
      const expenses = this.expenses

      const expenseOnThisMonth = expenses.filter(expense => {
        const month = new Date(expense.created_at).getMonth() + 1

        if (month === currentMonth) {
          return expense
        }
      })

      expenseOnThisMonth.forEach(expense => {
        this.totalOfThisMonth += Number(expense.amount)
      })

      return parseFloat(this.totalOfThisMonth)
    },
    async updateCurrentMonth(month) {
      this.currentMonth = month

      return this.currentMonth
    },
    async filterExpensesByMonth() {
      if (!this.expenses.length) {
        await this.getAllExpenses()
      }
      const expenses = this.expenses
      const months = getMonthName()

      const expenseMap = new Map()

      expenses.forEach(expense => {
        const month = new Date(expense.created_at).getMonth() + 1
        const monthName = months[month]

        if (expenseMap.has(monthName)) {
          expenseMap.get(monthName).push(expense)
          return
        }

        expenseMap.set(monthName, [expense])
      })

      this.expensesByMonth = expenseMap
      return expenseMap
    },
    async getExpenseByMonth(month = this.currentMonth) {
      const expensesMap = await this.filterExpensesByMonth()

      const expenses = expensesMap.get(getMonthName(month))
      
      if (!expenses) {
        return []
      }
      return expenses
    },
    async checkIfHasExpensiveInAnotherMonth() {
      const expensesMap = this.expensesByMonth
      const monthsName = getMonthName()
      const previousMonth = monthsName[new Date().getMonth()]

      this.hasExpenseInAnotherMonth = expensesMap.has(previousMonth)
    },
    async getMonthsWithExpenses() {
      const expensesMap = this.expensesByMonth
      const months = []


      expensesMap.forEach((value, key) => {
        months.push(key)
      })

      this.monthsWithExpenses = months
      return months
    }, 
    restartStates() {
      this.expenses = []
      this.totalOfThisMonth = 0
      this.currentMonth = ''
      this.monthsWithExpenses = []
      this.hasExpenseInAnotherMonth = false
    },
    async refreshData() {
      await this.getAllExpenses()
      await this.filterExpensesByMonth()
      await this.calcTotalOfCurrentMonth()
    }
  },
})

