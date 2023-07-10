<template>
  <Teleport to="#menu_wrapper">
    <nav>
      <div class="relative p-5 flex justify-between items-center">
        <button 
          v-if="$userStore.user.profile_picture"
          :disabled="!isClickAllowed"
          :class="isClickAllowed ? 'cursor-pointer' : 'cursor-not-allowed opacity-70 transition-opacity'"
          @click="toggleMenu"  >
          <img
            class="w-16 h-16 rounded-full mr-2 object-cover"
            :src="`${runtimeConfig.public.publicUrl}/${$userStore.user.profile_picture}`"
            alt="avatar"
          />
        </button>
        
        <button 
          v-else
          :disabled="!isClickAllowed" 
          :class="isClickAllowed ? 'cursor-pointer' : 'cursor-not-allowed opacity-70 transition-opacity'"
          @click="toggleMenu" class="w-16 h-16 rounded-full mr-2 bg-blue-200 flex justify-center items-center">
          <span class="text-md font-bold">{{ $userStore.getNameIcon }}</span>
        </button>
  
        <slot></slot>
      </div>
  
      <ConfigMenu :toggleMenu="toggleMenu" />
  
    </nav>
  </Teleport>
</template>

<script setup> 
  import LogoutIcon from '@/components/icons/LogoutIcon.vue'
  import { storeToRefs } from 'pinia';
  import { gsap } from 'gsap'
  import CloseIcon from '@/components/icons/CloseIcon.vue';

  const { $userStore, $expenseStore } = useNuxtApp()
  const { token, authenticated } = storeToRefs($userStore)
  const user = storeToRefs($userStore.user)
  const runtimeConfig = useRuntimeConfig()
 
  const isShowingMenu = ref(false)
  const isClickAllowed = ref(true)
  user.value = $userStore.user

  const logout = async () => {
    const response = await $userStore.logout()
    $expenseStore.restartStates()
    navigateTo('/')
  }

  const toggleMenu = async () => {
    isShowingMenu.value = !isShowingMenu.value
    
    if (isShowingMenu.value) {
      isClickAllowed.value = false
      gsap.fromTo('#config-menu', {
        duration: 0.3,
        x: '-100%',
      },
      {
        duration: 0.3,
        x: 0
      })
      gsap.fromTo('#config-options', {
        duration: 0.3,
        opacity: 0,
        x: '-100%'
      },
      {
        opacity: 1,
        x: 0,
        delay: 0.1,
        onComplete: () => {
          isClickAllowed.value = true
        }
      })
    } else {
      isClickAllowed.value = false

      gsap.fromTo('#config-menu', {
        duration: 0.3,
        x: 0,
      },
      {
        duration: 0.3,
        x: '-100%'
      })
      gsap.fromTo('#config-options', {
        duration: 0.3,
        opacity: 1,
        x: 0
      },
      {
        opacity: 0,
        x: '-100%',
        delay: 0.3,
        duration: 0.2,
        onComplete: () => {
          isClickAllowed.value = true
        }
      })
    }
  }

 

</script>