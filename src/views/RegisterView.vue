<script setup>
import AppHeader from '@/components/AppHeader.vue'
import { ref, onBeforeMount, watch, computed } from 'vue'

import { storeToRefs } from 'pinia'

import { useAuthStore } from '../stores/auth';

import { useRouter } from 'vue-router';

import { useUserTypesStore } from '@/stores/usertypes'

const { fetchUserTypes } = useUserTypesStore()

onBeforeMount(() => {
    fetchUserTypes()
})

const UserTypeStore = useUserTypesStore();
const { getUserTypes } = storeToRefs(UserTypeStore);


// const optionsUserTypes = getUserTypes

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  usertype: '',
})

const {
  register,
} = useAuthStore()

const router = useRouter()

const handleRegister = async () => {
    const firstName = form.value.firstName
    const lastName = form.value.lastName
    const email = form.value.email
    const password = form.value.password
    const usertype = form.value.usertype
    register(email, password, firstName, lastName, usertype)
    // .then(() => router.push({ name: 'login' }))
    
    router.push({ name: 'pedidos' })
}




</script>

<template>
    <AppHeader />
    <main>
        <div class="mx-auto max-w-xs px-4 py-6 sm:px-6 lg:px-6">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit.prevent="handleRegister">
            <div class="mb-4">
                <BaseInput
                label="First Name"
                type="text"
                required
                placeholder="Jhon" 
                v-model="form.firstName"
                /> 
            </div>
            <div class="mb-4">
                <BaseInput
                label="Last Name"
                type="text"
                required
                placeholder="Doe" 
                v-model="form.lastName"
                /> 
            </div>
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
                label="Password"
                type="password"
                required
                placeholder="******************" 
                v-model="form.password"
                /> 
            </div>

            <div class="mb-6">
                <BaseSelect
                    required
                    label="Área"
                    :options="getUserTypes"
                    v-model="form.usertype"
                />
            </div>

            <div class="flex items-center justify-between">
                <BaseButton type="submit">
                  Register
                </BaseButton>
            </div>
            
        </form>
        <p class="text-center text-gray-500 text-xs">
            &copy;2023 PERcoms All rights reserved.
        </p>
        </div>
    </main>
</template>