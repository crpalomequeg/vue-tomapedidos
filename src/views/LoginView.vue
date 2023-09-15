<script setup>
import AppHeader from '@/components/AppHeader.vue'
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth';

import { useRouter } from 'vue-router';

const {
  getLoading,
  getUser,
  getIsAuth,
  login,
} = useAuthStore()

const router = useRouter()

const form = ref({
  email: '',
  password: '',
})

const handleLogin = async () => {
  const email = form.value.email
  const password = form.value.password

  login(email, password)
    .then(() => router.push({ name: 'pedidos' }))
}
</script>

<template>
    <AppHeader />
    <main>
        <div class="mx-auto max-w-xs px-4 py-6 sm:px-6 lg:px-6">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit.prevent="handleLogin">
            <div class="mb-6 text-center font-bold leading-6 text-gray-900">Inicio de sesión</div>
            <div class="mb-4">
                <BaseInput
                label="Email"
                type="text"
                required
                placeholder="jhondoe@domain.com" 
                v-model="form.email"
                /> 
            </div>
            <div class="mb-6">
                <BaseInput
                label="Contraseña"
                type="password"
                required
                placeholder="******************" 
                v-model="form.password"
                /> 
                <p class="text-red-500 text-xs italic">Por favor, ingrese su contraseña.</p>
            </div>
            <div class="flex items-center justify-end">
                <BaseButton type="submit">
                  Log In
                </BaseButton>
            </div>
        </form>
        <p class="text-center text-gray-500 text-xs">
            &copy;2023 PERcoms All rights reserved.
        </p>
        </div>
    </main>
</template>