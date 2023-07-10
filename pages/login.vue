<template>
  <div :class="isPageLoading ? 'animate-pulse' : ''" >
    <DetailBar :isPageLoading="isPageLoading" />
    
    <div id="login-page" :class="originRegister && 'translate-x-[-100%]'">
      <div class="mt-[60px]">
        <div :class="isPageLoading ? 'bg-slate-200 rounded-lg' : ''" class="mx-auto h-[120px] w-[120px] max-w-full bg">
          <img id="logo-login" :src="isPageLoading ? '' : '/icon.png'" :alt="isPageLoading ? '' : 'Logo'" />
        </div>
      </div>
  
      <div class="text-center mt-10">
        <h1 
        :class="isPageLoading ? 'px-2 text-slate-200 bg-slate-200 w-fit h-fit m-auto overflow-hidden rounded-full' : 'text-white'"
        class="text-2xl font-bold mb-2" 
        >Login</h1>
        <p 
          :class="isPageLoading ? 'px-2 text-slate-200 bg-slate-200 w-fit m-auto rounded-full' : 'text-gray-300'"
        >Login to your account to manage your expenses</p>
      </div>
  
      <div class="p-[20px]">
        <form @submit.prevent="login">
          <div class="mb-4">
            <label for="email" class="sr-only">Email</label>
            <input 
              @keypress="loginErrorMessage = ''" 
              required 
              type="email" 
              name="email" 
              id="email" 
              :placeholder="isPageLoading ? '' : 'Your email'" 
              :class="isPageLoading ? 'bg-slate-200' : 'bg-gray-100'"
              class="p-4 rounded-lg border-2 w-full"             
              />
          </div>
          <div class="mb-4">
            <label for="password" class="sr-only">Password</label>
            <div class="relative">
              <input 
                @keypress="loginErrorMessage = ''" 
                required type="password" 
                name="password" 
                id="password" 
                :placeholder="isPageLoading ? '' : 'Your password'" 
                :class="isPageLoading ? 'bg-slate-200' : 'bg-gray-100'"
                class="p-4 rounded-lg border-2 w-full"
              />
              <button :class="isPageLoading && 'hidden'" class="absolute right-3 top-1/2 -translate-y-1/2" @click="showPassword" type="button">
                <ShowPasswordIconVue v-if="passwordType === 'password'" />
                <HidePasswordIconVue v-else />
              </button> 
              <p class="text-red-500 text-sm" v-if="loginErrorMessage">{{ loginErrorMessage }}</p>
            </div>         
          </div>
          <div class="mb-4">
            <button 
              :class="isPageLoading ? 'bg-slate-200 text-slate-200' : 'bg-blue-500 text-white'"
              class="px-4 py-3 rounded font-medium w-full"
            >Login</button>
          </div>
          
          <p 
            :class="isPageLoading ? 'text-slate-200 bg-slate-200  w-fit m-auto' : 'text-gray-300'"
            class="text-center mt-2"
          >
            Don't have an account? 
            <NuxtLink 
              to="/register" 
              :class="isPageLoading ? 'text-slate-200 bg-slate-200  w-fit m-auto' : 'text-blue-500'"
            >Register</NuxtLink>
          </p>
  
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import LoginSkeleton from '@/components/skeletons/LoginSkeleton.vue'
  import { storeToRefs } from 'pinia';
  import HidePasswordIconVue from '@/components/icons/HidePasswordIcon.vue';
  import ShowPasswordIconVue from '@/components/icons/ShowPasswordIcon.vue';
  import DetailBar from '@/components/DetailBar.vue';
  import gsap from 'gsap'

  const { $userStore } = useNuxtApp()
  const { user, token, authenticated } = storeToRefs($userStore)
  const loginErrorMessage = ref('')
  const passwordType = ref('password')
  const isPageLoading = ref(true)
  const originRegister = ref(false)

  onBeforeMount(()=> {
    const lastRoute = localStorage.getItem('previosRoute')
    if (!lastRoute) return

    if (lastRoute === '/register') {
      originRegister.value = true
    }

    localStorage.removeItem('previosRoute')
  })

  onBeforeRouteLeave((to, from, next) => {

    if (to.path === '/dashboard') {
      setTimeout(()=> {
      gsap.fromTo(
      '#login-page', 
      {
        x: '0'
      },
      {
        duration: 0.3,
        x: '100%',
        onComplete: () => {
          next()
        }
      })
    }, 100)
    } else {
      next()
    }
   
  })

  onMounted(() => {
    isPageLoading.value = false

    if (originRegister.value) {
      setTimeout(()=> {
        gsap.fromTo(
        '#login-page', 
        {
          x: '-100%'
        },
        {
          duration: 0.3,
          x: '0'
        })
      }, 100)
    }
  })

  const login = async () => {
    const form = document.querySelector('form')

    const email = form.email.value
    const password = form.password.value

    const data = { email, password }

    const response = await $userStore.login(data)
    
    if (response.error) {
      loginErrorMessage.value = response.error.message
    }

    if (response.user) {
      authenticated.value = true
      navigateTo('/dashboard')
    }
  }

  const showPassword = () => {
    const password = document.getElementById('password')
    if (password.type === 'password') {
      passwordType.value = 'text'
      password.type = 'text'
    } else {
      password.type = 'password'
      passwordType.value = 'password'
    }
  }
</script>