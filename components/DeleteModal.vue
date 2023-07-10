<template>
  <div>
    <!-- Modal toggle -->
    <div class="text-white font-regular text-sm mt-8 text-center">
      <button id="deleteButton" @click="showModal = true" type="button">
      {{ deleteText }}
      </button>
    </div>

    <!-- Main modal -->
    <div id="deleteModal" tabindex="-1" v-if="showModal"  
    class="translate-x-[-200%] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full">
      <div class="relative p-4 w-full max-w-md h-full">
          <!-- Modal content -->
          <div class="relative p-4 text-center bg-gray-800 border-4 border-yellow-500 rounded-lg shadow sm:p-5">
              <button 
                @click="cancel()" 
                type="button" 
                class="text-white absolute top-2.5 right-2.5 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
              >
                  <CloseIcon class="text-white" />
                  <span class="sr-only">Close modal</span>
              </button>
              <TrashIcon class="text-gray-300 w-11 h-11 mb-3.5 mx-auto" />
              <p class="mb-4 text-gray-200 font-semibold">Are you sure you want to delete this user?</p>
              <div class="text-left">
                <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                  <p>This action is <strong>irreversible</strong>, once you delete this user, you won't be able to recover it.</p>
                  <p>All expenses associated with this user <strong>will be deleted</strong>.</p>
                  <p>After click in "Yes", you will be disconnected and your account deleted.</p>
                </div>
              </div>

              <div class="flex justify-center items-center space-x-4">
                  <button 
                  @click="cancel()" 
                  type="button" 
                  class="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200  ">
                      No, cancel
                  </button>
                  <button @click="confirm" type="button" class="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg ">
                      Yes, I'm sure
                  </button>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import gsap from 'gsap';
  import CloseIcon from './icons/CloseIcon.vue';
  import TrashIcon from './icons/TrashIcon.vue';

  const showModal = ref(false)
  const props = defineProps({
    deleteText: String,
    deleteAccount: Function
  })

  const timeouts = ref([])

  watchEffect(() => {
    if (showModal.value) {
      const timeout = setTimeout(()=> {
        gsap.fromTo(
          '#deleteModal', 
          { x: '-200%' },
          { x: 0, duration: .5}
          )
      }, 100)
      timeouts.value.push(timeout)
    } 
  })

  const cancel = () => {
    gsap.to('#deleteModal', { x: '-200%', duration: .5, onComplete: () => {
      timeouts.value.forEach(timeout => clearTimeout(timeout))
      showModal.value = false
    }})
  }

  const confirm = () => {
    showModal.value = false
    props.deleteAccount()
  }
  

</script>