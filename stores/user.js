import { defineStore } from 'pinia'
import axios from '../plugins/axios'

const $axios = axios().provide.axios

export const useUserStore = defineStore('user', {
  state: () => (
    {
      user: {},
      token: '',
      authenticated: false,
    }
  ),
  getters: {
    getUser: (state) => state.user,
    getNameIcon: (state) => {
      const name =  {
        firstName: state.user.name.split(' ')[0],
        lastName: state.user.name.split(' ')[1] || null
      }

      const nameIcon = 
      `${name.firstName.charAt(0)}${name.lastName ? name.lastName.charAt(0) : name.firstName.charAt(name.firstName.length - 1)}`.toUpperCase()
     
      return nameIcon
    }
  },
  actions: {
    async login(data) {
      try {
        const response = await $axios.post('/login', data)
        this.user = response.data.user
        this.token = response.data.token
        // Persist the token in the localStorage
        localStorage.setItem('token', response.data.token)
        return {
          user: response.data.user
        }
      } catch(e) {
        return {
          error: e.response.data
        }
      }

    },
    async logout() {
      const token = this.token || localStorage.getItem('token')
      try {
        const response = await $axios.post('/logout', null, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        this.user = {}
        localStorage.removeItem('token')
        this.token = ''
        this.authenticated = false

        return {
          message: response.data.message
        }
      } catch(e) {
        return {
          error: e.response.data
        }
      }
    },
    async loggedUser() {
      const token = this.token || localStorage.getItem('token')
      
      if (token) {
        try {
          const response = await $axios.get('/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          this.user = response.data
          this.authenticated = true

          return {
            user: response.data
          }
        } catch(e) {
          return {
            error: e.response.data
          }
        }
      }

      return {
        error: 'No token provided'
      }
    },
    async register(data) {

      try {
        const response = await $axios.post('/register', data)

        this.user = response.data.user
        this.token = response.data.token
        // Persist the token in the localStorage
        localStorage.setItem('token', response.data.token)

        return {
          user: response.data.user
        }
      } catch(e) {
        return {
          errors: e.response.data
        }
      }
    },
    async update(data) {
      try {
        const response = await $axios.post('/update', data)

        this.user = response.data.user

        return {
          user: response.data.user
        }
      } catch(e) {
        return {
          errors: e.response.data
        }
      }
    },
    async delete() {
      try {
        const response = await $axios.delete(`/user/delete/${this.user.id}`)

        return {
          message: response.data.message,
          user: response.data.user
        }
      } catch(e) {
        return {
          errors: e.response.data
        }
      }
    },
    restartUserStates() {
      this.user = {}
      this.token = ''
      this.authenticated = false
    }
  },
})
