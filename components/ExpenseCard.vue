<template>
  <div class="flex items-center gap-2 relative rounded-md overflow-hidden "  >
    <div ref="" class="flex w-full border-none rounded-l-md" @click="isActive = !isActive">
      <div class="flex-wrap basis-full flex justify-between bg-zinc-800 p-2.5 relative">
        <div class="max-w-[48%] flex flex-col justify-between ">
          <h1 class="max-w-[140px] truncate font-semibold text-sm ">{{ props.title }}</h1>
          <p class="text-xs truncate">{{ props.description }}</p>
        </div>
    
        <div class="flex flex-col justify-between text-right">
          <h1 class="font-semibold text-sm">{{ `${props.currency} ${Number(props.amount).toFixed(2)}` }}</h1>
          <p class="text-xs">{{ formatDate(props.date) }}</p>
        </div>
      </div>


      <div 
        ref="editAndDeleteButton"
        :class="isActive ? 
          'pointer-events-all' : 
          'pointer-events-none'" class="flex justify-center text-zinc-800 basis-[100px] overflow-hidden bg-yellow-300">
        <button :tabindex="isActive ? 0 : -1" class="px-1 mr-1" @click="isEditModalOpen = !isEditModalOpen">
          <EditIcon class="" />
        </button>
        <button :tabindex="isActive ? 0 : -1" class="px-1" @click="isDeleteModalOpen = !isDeleteModalOpen">
          <DeleteIcon />
        </button>
      </div>
    </div>

    <!-- edit and delete button -->
    

    <template v-if="isEditModalOpen">
      <EditExpenseModal 
        @updateDataEvent="handleUpdateDataEvent"
        :is-modal-open="isEditModalOpen" 
        :closeModal="()=> {isEditModalOpen = false}" 
        :data="props" 
      />
    </template>

    <template v-if="isDeleteModalOpen">
      <DeleteExpenseModal 
        @updateDataEvent="handleUpdateDataEvent"
        :is-modal-open="isDeleteModalOpen" 
        :closeModal="()=> {isDeleteModalOpen = false}" 
        :data="props" />
    </template>
  </div>
</template>

<script setup>
  import EditExpenseModal from '@/components/EditExpenseModal.vue'
  import DeleteExpenseModal from '@/components/DeleteExpenseModal.vue'
  import { formatDate } from '@/utils';
  import EditIcon from '@/components/icons/EditIcon.vue'
  import DeleteIcon from '@/components/icons/DeleteIcon.vue'
  import gsap from 'gsap'

  const props = defineProps({
    id: String,
    title: String,
    description: String,
    amount: String,
    currency: String,
    date: String,
    updateDataEvent: Function
  })


  const emits = defineEmits(['updateDataEvent']);

  const isActive = ref(false)
  const isEditModalOpen = ref(false)
  const isDeleteModalOpen = ref(false)
  const editAndDeleteButton = ref(null)

  watchEffect(()=> {
    if (isActive.value) {
      gsap.to(editAndDeleteButton.value, {maxWidth: '100%',  duration: 0.3})
    } else {
      gsap.to(editAndDeleteButton.value, {maxWidth: '0', duration: 0.3})
    }
  })

  const handleUpdateDataEvent = async () => {
    emits('updateDataEvent')
  }
</script>
