import axios from 'axios'

// Export axios as a plugin in nuxt3 using defineNuxtPlugin
export default defineNuxtPlugin((nuxtApp) => {
  // axios.defaults.baseURL = 'http://127.0.0.1:8000/api'
  axios.defaults.baseURL = nuxtApp?.$config.public.baseUrl
  axios.defaults.withCredentials = true
 return {
  provide: {
    axios: axios
  }
 }
})