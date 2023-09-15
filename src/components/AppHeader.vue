<script setup>
import { ref, onBeforeMount } from 'vue'

import { storeToRefs } from 'pinia'

import { useAuthStore }  from '@/stores/auth'

import { useUsersStore }  from '@/stores/users'

import { useRouter } from 'vue-router';

const { fetchUsers } = useUsersStore()

const UserStore = useUsersStore();
const { getUserById } = storeToRefs(UserStore);

// const userType = UserStore.getUserType

// const { getUsers } = storeToRefs(UserStore);

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const navigation = [
  { name: 'Home', routename: 'home', href: '/', current: true },
  { name: 'About Us', routename: 'about', href: '/about', current: false },
]

const useAuth = useAuthStore()

if (useAuth.isLoggedIn) {
  onBeforeMount(() => {
    fetchUsers(useAuth.user.uid)
  })
}

const router = useRouter()

// const user = getUsers

const handleLogout = () => {
  useAuth
    .logout()
    .then(() => {
      router.push({ name: 'login' })
    }) 
}

</script>

<template>

    <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <!-- <a v-for="item in navigation" :key="item.name" :href="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</a> -->

              <RouterLink :to="{ name: 'home' }">
                <BaseButton>
                  Inicio
                </BaseButton>
              </RouterLink>

              <RouterLink :to="{ name: 'about' }">
                <!-- <a class="bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium"> -->
                <BaseButton>
                  Nosotros
                </BaseButton>
              </RouterLink>

              <RouterLink :to="{ name: 'servicios' }">
                <!-- <a class="bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium"> -->
                <BaseButton>
                  Servicios
                </BaseButton>
              </RouterLink>

              <RouterLink :to="{ name: 'pedidos' }" v-if="useAuth.isLoggedIn && getUserById(useAuth.user.uid)?.usertype==1">
                <BaseButton>
                  Pedidos
                </BaseButton>
              </RouterLink>

            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <div class="flex space-x-4">

            <span class="text-white rounded-md px-3 py-2 text-sm font-medium" v-if="useAuth.isLoggedIn">Hola, {{ getUserById(useAuth?.user?.uid)?.firstName }}</span>

            <RouterLink
            :to="{ name: 'login' }"
            v-if="!useAuth.isLoggedIn"
            >
              <BaseButton>Log In</BaseButton>
            </RouterLink>

            <RouterLink
              :to="{ name: 'login' }"
              v-if="useAuth.isLoggedIn"
            >
              <BaseButton @click="handleLogout">Log Out</BaseButton>
            </RouterLink>

            <RouterLink
              :to="{ name: 'register' }"
              v-if="!useAuth.isLoggedIn"
            >
              <BaseButton>Register</BaseButton>
            </RouterLink>
          </div>

          
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>