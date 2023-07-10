<template>
  <div class="animate-pulse">
    <DetailBar :color="'text-slate-200 bg-slate-200 w-fit m-auto'"/>
    <!-- logo -->
    <div class="mt-[60px]">
      <div class="bg-slate-200 mx-auto h-[120px] w-[120px] max-w-full bg" />
    </div>

    <div class="text-center mt-10">
      <h1 class="text-2xl font-bold mb-2 text-slate-200 bg-slate-200 w-fit h-fit m-auto overflow-hidden">Login</h1>
      <p class="text-slate-200 bg-slate-200 w-fit m-auto">Login to your account to manage your expenses</p>
    </div>

    <div class="p-[20px]">
      <div>
        <div class="mb-4">
          <label for="email" class="sr-only">Email</label>
          <input disabled required type="email" name="email" id="email" placeholder="" class="bg-slate-200 border-2 w-full p-4 rounded-lg" />
        </div>
        <div class="mb-4">
          <label for="password" class="sr-only">Password</label>
          <div class="relative">
            <input disabled required type="password" name="password" id="password" placeholder="" class="bg-slate-200 border-2 w-full p-4 rounded-lg" />
            <button class="absolute right-3 top-1/2 -translate-y-1/2" type="button">
            </button> 
          </div>         
        </div>
        <div class="mb-4">
          <button class="bg-slate-200 text-slate-200 px-4 py-3 rounded font-medium w-full">Login</button>
        </div>
        
        <!-- Register page link -->
        <p class="text-slate-200 bg-slate-200 w-fit m-auto text-center mt-2">
          Don't have an account? 
          <NuxtLink to="/register" class="text-slate-200 bg-slate-200 w-fit m-auto">Register</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import DetailBar  from '@/components/DetailBar.vue';
</script>