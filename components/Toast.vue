<template>
  <Teleport to="body">
    <div 
    v-if="controller"
    :class="props.color ? props.color : 'bg-lime-400 text-white '"
    class="toast absolute z-50 top-14 right-0 w-[80%] h-10 translate-x-[100%] flex justify-center items-center font-bold">
      <slot></slot>
    </div>
  </Teleport>
</template>

<script setup>
  import gsap from 'gsap'

  const props = defineProps({
    controler: Boolean,
    closeFunction: Function,
    color: String
  })

  const controller = toRefs(props.controler)
  const timeouts = ref([])

  onMounted(()=> {
    const toasts = document.querySelectorAll('.toast')

    toasts.forEach(toast => {
      gsap.to(toast, {
        x: 0,
        duration: 0.3
      })

      const timeout = setTimeout(() => {
      gsap.to(toast, {
          x: '100%',
          duration: 0.2
        })
        controller.value = false
      }, 2000)
      timeouts.value.push(timeout)

    })
    
    setTimeout(() => close(), 2200)
  })

  onUnmounted(()=> {
    timeouts.value.forEach(timeout => clearTimeout(timeout))
  })

  const close = () => {
    props.closeFunction()
  }

</script>