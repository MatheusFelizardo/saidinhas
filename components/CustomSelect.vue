<template>
  <div id="custom-select" class="w-full mt-[20px] px-4">
    <input type="hidden" :value="selected">

    <div>
      <div :class="selected ? ' bg-green-600' : 'bg-white'" class="p-1 py-1.5 rounded-sm text-center" @click="isShowingOptions = !isShowingOptions">
        <div 
          :class="selected ? ' text-white font-semibold' : 'text-gray-400'">

          <div v-if="selected" class="flex justify-center items-center relative">
            <span>{{ selected }}</span>
            <span class="absolute right-5"><SpinIcon /></span>
          </div>
          <span v-else>{{ initialText || 'Tap to check the options' }}</span>
        </div>
      </div>

      <div v-if="isShowingOptions" class="max-h-0 overflow-hidden absolute w-[calc(100%-2rem)] bg-blue-950 text-white" ref="optionsRef" >
        <div 
        class="p-1 py-1.5 text-center bg-indigo-500 rounded-sm border-b border-b-white last:border-b-0"
        @click="()=> {
          // selected = option
          handleSelected(option)
        }" v-for="(option, index) in options" :key="`${option}-${index}`" :id="`${option}-${index}`">
          <span>{{ option }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import gsap from 'gsap';
  import SpinIcon from './icons/SpinIcon.vue';

  const selectedOption = ref(null)
  const isShowingOptions = ref(false)
  const optionsRef = ref(null)

  const props = defineProps({
    options: Array,
    selected: String,
    initialText: String,
    updateSelected: Function
  })

  const { selected } = toRefs(props)
  const emits = defineEmits(['updateSelected']);

  watchEffect(() => {
    if (isShowingOptions.value) {
      gsap.to(optionsRef.value, {
        maxHeight: '220px',
        height: 'fit-content',
        overflow: 'auto',
        duration: 0.3
      })
    } 
  })

  const handleSelected = (value) => {
    gsap.to(optionsRef.value, {
      maxHeight: '0px',
      duration: 0.1
    })

    emits('updateSelected', value);
    
  }

</script>