<template>
  <div class="h-full">
    <DetailBar />
    <div id="register-page" class="translate-x-[100%]">
      <div class="mt-[30px]">
        <div :class="isPageLoading ? 'bg-slate-200 rounded-lg' : ''" class="mx-auto h-[120px] w-[120px] max-w-full bg">
          <img id="logo-login" :src="isPageLoading ? '' : '/icon.png'" :alt="isPageLoading ? '' : 'Logo'" />
        </div>
      </div>

      <div class="text-center mt-4">
        <h1 class="text-md font-semibold mb-2 text-white">Create new account</h1>
      </div>

      <!-- Register form -->
      <div class="p-[20px]">
        <form @submit.prevent="register">
          <div class="mb-4">
            <label for="name" class="sr-only">Name</label>
            <input type="text" required name="name" id="name" placeholder="Your name" class="bg-gray-100 border-2 w-full p-4 rounded-lg" />
          </div>
          <div class="mb-4">
            <label for="last_name" class="sr-only">Last Name</label>
            <input type="text" required name="last_name" id="last_name" placeholder="Your last name" class="bg-gray-100 border-2 w-full p-4 rounded-lg" />
            <p class="text-red-500 text-sm" v-if="errors.name">{{ errors.name }}</p>
          </div>
      
          <div class="mb-4">
            <label for="email" class="sr-only">Email</label>
            <input @keypress="errors.email = ''" type="email" required name="email" id="email" placeholder="Your email" class="bg-gray-100 border-2 w-full p-4 rounded-lg" />
            <p class="text-red-500 text-sm" v-if="errors.email">{{ errors.email[0] }}</p>
          </div>
          <div class="mb-4">
            <label for="password" class="sr-only">Password</label>
            <div class="relative">
              <input @keypress="loginErrorMessage = ''" required type="password" name="password" id="password" placeholder="Choose a password" class="bg-gray-100 border-2 w-full p-4 rounded-lg" />
              <button class="absolute right-3 top-1/2 -translate-y-1/2" @click="showPassword" type="button">
                <ShowPasswordIcon v-if="passwordType === 'password'" />
                <HidePasswordIcon v-else />
              </button> 
              <p class="text-red-500 text-sm" v-if="loginErrorMessage">{{ loginErrorMessage }}</p>
            </div>
            
            <p class="text-red-500 text-sm" v-if="errors.password">{{ errors.password[0] }}</p>
          </div>
          <div>
            <button class="bg-blue-500 text-white px-4 py-3 rounded font-medium w-full">Register</button>
          </div>
        </form>
      </div>

      <div>
        <p class="text-gray-400 text-center mt-2">
          Already have an account? 
          <NuxtLink to="/" class="text-blue-500 font-semibold">Login</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia';
  import DetailBar from '@/components/DetailBar.vue';
  import HidePasswordIcon from '@/components/icons/HidePasswordIcon.vue';
  import ShowPasswordIcon from '@/components/icons/ShowPasswordIcon.vue';
  import gsap from 'gsap';

  const { $userStore } = useNuxtApp()
  const { user, token, authenticated } = storeToRefs($userStore)
  const errors = ref({})
  const passwordType = ref('password')
  const isPageLoading = ref('true')

  onMounted(() => {
    isPageLoading.value = false

    setTimeout(() => {
      gsap.to('#register-page', { x: 0, duration: 0.3 })
    }, 0)
  })

  onBeforeRouteLeave((to, from, next) => {
    localStorage.setItem('previosRoute', '/register')
    next()
  })

  const register = async () => {
    const form = document.querySelector('form')

    const name = form.name.value.trim()
    const last_name = form.last_name.value.trim()
    const fullName = `${name} ${last_name}`
    const email = form.email.value
    const password = form.password.value

    const data = { name: fullName, email, password }

    const response = await $userStore.register(data)

    if (response.errors) {
      errors.value = response.errors
    }

    if (response.user) {
      navigateTo('/')
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