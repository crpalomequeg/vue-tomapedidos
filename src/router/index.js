import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import { useAuthStore } from '../stores/auth'
import { useUsersStore }  from '@/stores/users'

const requireAuthPedidos = async (to, from, next) => {
  const useAuth = useAuthStore()

  const existUser = await useAuth.currentUser()

  // console.log('beforeEnter-requireAuth', existUser)

  if (existUser) {

    const useUser = useUsersStore()
    const users = await useUser.fetchUsers(useAuth.user.uid)
    const user = await useUser.getUsers
    // console.log(user[0]?.usertype)
    
    if (user[0]?.usertype==1) {
      next()
    } else {
      next({ name: 'login' })
    }
  } else {
    next({ name: 'login' })
  }
}


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/servicios',
      name: 'servicios',
      component: () => import('../views/ServiceView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    }
    ,
    {
      path: '/pedidos',
      name: 'pedidos',
      component: () => import('../views/ListPedidosView.vue'),
      beforeEnter: requireAuthPedidos
    }
  ]
})

export default router
