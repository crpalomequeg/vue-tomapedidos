<script setup>
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader />
    
    <main>
      <div class="relative h-screen overflow-hidden">
        <div class="inset-0 bg-black opacity-50 w-full h-full"></div>
        <div class="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center">Distribuidora SGJ</h1>
            <p class="text-lg md:text-xl lg:text-2xl text-center">Empresa líder en distribución de productos de consumo masivo</p>
        </div>
      </div>

    </main>
</template>
