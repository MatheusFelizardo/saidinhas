<template>
  <div class="h-full">
    <template v-if="loading">
      <!-- <div class="h-fit  p-[20px] mt-[30px] absolute top-28 bottom-0 left-0 right-0">
        <img src="/icon.png" alt="Workflow" class="mx-auto w-[200px] h-[200px] max-w-full" />
        
        <div class="flex justify-center items-center mt-8 gap-2">
          <SpinIcon class="text-white" />
          <p class="text-white">Loading...</p>
        </div>
      </div> -->
      <LoginSkeleton />
    </template>
  </div>
</template>

<script setup>
  import SpinIcon from '@/components/icons/SpinIcon.vue';
  import LoginSkeleton from '~/components/skeletons/LoginSkeleton.vue';
  const { $userStore } = useNuxtApp()
  const loading = ref(true)

  onMounted(async () => {
    const response = await $userStore.loggedUser()
    loading.value = false

    if ($userStore.authenticated) {
      navigateTo('/dashboard')
      return
    }
    navigateTo('/login')
  })
</script>
