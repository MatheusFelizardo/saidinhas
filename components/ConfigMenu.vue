<template>
  <Teleport to="#main-layout">
    <div id="config-menu" class="fixed top-0 left-0 z-[20] w-full h-full bg-gray-800 translate-x-[-100%]">
      <!-- Settings header -->
    <div class="flex justify-center items-center w-full h-16 bg-gray-900 px-5 relative border-b-2 border-gray-50">
      <button @click="props.toggleMenu()" class=" text-white absolute left-4">
        <ArrowLeftIcon class="w-10 h-10"/>
      </button>
      <h1 class="text-white font-semibold text-xl">Settings</h1>
    </div>

    <div id="config-options" class="p-2.5 mt-4 opacity-0">
      <!-- Button to go to edit page -->
      <button 
        @click="showEditModal"
        class="flex justify-center items-center w-full h-10  bg-blue-500 text-white font-semibold text-sm rounded-full mb-5">
        Edit profile
      </button>
      <!-- Button to logout -->
      <button 
        @click="logout" 
        class="flex justify-center items-center w-full h-10 border-4 border-gray-500 text-white font-semibold text-md rounded-full"
      >
        Log out
      </button>

      <DeleteModal :deleteText="'Delete account'" :deleteAccount="deleteAccount" />
      
    </div>

    

    <div v-if="isShowingEditModal">
      <EditProfileModal :is-showing-edit-modal="isShowingEditModal" :closeModal="showEditModal" />
    </div>

  </div>
  </Teleport>
</template>

<script setup>
  import DeleteModal from '@/components/DeleteModal.vue';
  import EditProfileModal from './EditProfileModal.vue';
  import ArrowLeftIcon from './icons/ArrowLeftIcon.vue';
  import CloseIcon from './icons/CloseIcon.vue';
  const { $userStore, $expenseStore } = useNuxtApp()

  const props = defineProps({
    toggleMenu: Function
  })

  const isShowingEditModal = ref(false) 

  const showEditModal = () => {
    isShowingEditModal.value = !isShowingEditModal.value
  }

  const logout = async () => {
    const response = await $userStore.logout()
    $expenseStore.restartStates()
    navigateTo('/')
  }

  const deleteAccount = async () => {
    const response = await $userStore.delete()

    if (response.user) {
      $expenseStore.restartStates()
      $userStore.restartUserStates()
      navigateTo('/')
    }
  }

</script>