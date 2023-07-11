<template>
  <Teleport to="body">
    <div id="config-edit-menu" class="absolute left-0 top-0 translate-y-[-100%] bg-gray-800 z-40 w-full h-fit">
      <form @submit.prevent="" class="p-2 mt-6">
        <div class="flex justify-center text-center relative z-10 mb-10">
          <label class="flex justify-center w-40 h-40 rounded-full" for="profile_picture">
            <span class="absolute bg-gray-800 text-white text-xs bottom-[-1rem]">Change profile picture</span>
            <div v-if="user.profile_picture || previewImage">
              <img
                class="w-40 h-40 rounded-full object-cover"
                :src="previewImage ? previewImage : `${runtimeConfig.public.publicUrl}/${user.profile_picture}`"
                alt="avatar"
              />
            </div>
            <div v-else class="w-full h-full rounded-full bg-blue-200 flex justify-center items-center">
              <span class="text-4xl font-bold">{{ nameIcon }}</span>
            </div>
          </label>
          <input @change="updateImage" class="absolute opacity-0 h-0 w-0" type="file" name="profile_picture" id="profile_picture" >
        </div>

        <!-- Edit user infos -->
        <div class="mb-4">
          <label class="block text-white text-sm font-bold mb-2" for="name">
            Name
          </label>
          <input class="shadow appearance-none border rounded-sm w-full p-2.5 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Name" name="name" :value="user.name" />
        </div>
        <div class="mb-4" @click="showEmailToast()" >
          <label class="block text-white text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input class="shadow appearance-none border rounded-sm w-full p-2.5 leading-tight focus:outline-none focus:shadow-outline bg-gray-300 font-semibold" name="email" type="email" placeholder="Email" :value="user.email" disabled  />
        </div>
        <div class="mb-4">
          <label class="block text-white text-sm font-bold mb-2" for="password">
            Edit password
          </label>
          <input class=" mb-2 shadow appearance-none border rounded-sm w-full p-2.5 leading-tight focus:outline-none focus:shadow-outline" name="password" type="password" placeholder="Old password" />
          <input class="shadow appearance-none border rounded-sm w-full p-2.5 leading-tight focus:outline-none focus:shadow-outline" type="password" name="new_password" placeholder="New password" />
        </div>
        <div class="mb-4">
          <label for="currency" class="block text-white text-sm font-bold mb-2">Preferred currency to display</label>
          <select id="currency" class="mb-2 shadow appearance-none border rounded-sm w-full p-2.5 leading-tight focus:outline-none focus:shadow-outline font-semibold">
            <option value="EUR">Euro</option>
            <option value="USD">Dolar</option>
            <option value="BRL">Real</option>
            <option value="GBP">Pound Sterling</option>
          </select>
        </div>

      </form>

      <div class="close mb-4 flex justify-center">
        <button 
        @click="handleSubmit"
        form="edit-user-form"
          class="w-[95%] h-10 flex justify-center items-center border-4 border-gray-500 text-white font-semibold rounded-full text-md p-2.5"
        >
          Save
        </button>
      </div>

      <div class="close mb-10 flex justify-center">
        <button 
          @click="handleCloseModal()" 
          class="w-[95%]  h-10 flex justify-center items-center  bg-red-500 text-white font-semibold text-md p-2.5 
          rounded-full"
        >
          Cancel
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
  const runtimeConfig = useRuntimeConfig()
  const { $userStore, $toast, $expenseStore } = useNuxtApp()
  const previewImage = ref(null)
  import gsap from 'gsap'

  const props = defineProps({
    isShowingEditModal: Boolean,
    closeModal: Function
  })

  const {isShowingEditModal, closeModal} = toRefs(props)
  const user = ref({})
  const nameIcon = $userStore.getNameIcon
  user.value = $userStore.user

  onMounted(() => {
    gsap.to('#config-edit-menu', {
      y: 0,
      duration: 0.3
    })

    const currency = document.getElementById('currency')
    currency.value = user.value.currency || 'EUR'
  })

  const handleCloseModal = () => {
    const menu = document.querySelector('#config-edit-menu')

    if (!menu) return

    gsap.to('#config-edit-menu', {
      y: '-100%',
      duration: 0.3
    })

    setTimeout(() => {
      closeModal.value()
    }, 300)
  }

  const handleSubmit = async () => {
    const form = document.querySelector('form')
    const id = user.value.id
    const name = form.name.value
    const oldPassword = form.password.value
    const newPassword = form.new_password.value
    const profile_picture = form.profile_picture.files[0]
    const currency = form.currency.value

    // check if data from form is different from user data
    if (name === user.value.name && !oldPassword && !newPassword && !profile_picture && currency === user.value.currency) {
      handleCloseModal()
      return
    }

    const formData = new FormData()
    formData.append('id', id)
    if (name !== user.value.name) formData.append('name', name)
    if (currency !== user.value.currency) formData.append('currency', currency) 
    if (oldPassword && newPassword) {
      formData.append('old_password', oldPassword)
      formData.append('password', newPassword)
    }
    if (profile_picture) formData.append('profile_picture', profile_picture)

    const reponse = await $userStore.update(formData)
    if (currency !== user.value.currency) {
      await $expenseStore.refreshData()
    }
    if (reponse.user) {
      new $toast({
        id: 'user_update_sucessfully_toast',
        message: 'User updated sucessfully.',
        color: 'bg-green-500 text-white'
      })
      setTimeout(()=> {
        handleCloseModal()
      }, 300)
    }
  }

  const updateImage = () => {
    const form = document.querySelector('form')
    const file = form.profile_picture.files[0]
    const reader = new FileReader()

    reader.onloadend = () => {
      previewImage.value = reader.result
    }

    if (file) {
      reader.readAsDataURL(file)
    } 
  }

  const showEmailToast = () => {
    new $toast({
      id: 'email_disabled_toast',
      message: 'Email cannot be changed.',
      color: 'bg-red-500 text-white'
    })
  }

</script>