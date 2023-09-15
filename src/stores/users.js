import { defineStore } from "pinia";

import { db } from '@/services/firebase'

import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'

import { useAuthStore } from '@/stores/auth'

export const useUsersStore = defineStore({
  id: 'user',
  state: () => ({
    loading: false,
    users: [],
    tasks: null
  }),
  getters: {
    getUsers(state) {
      // console.log('111', state.users)
      return state.users
    },    
    getUserType(state) {
      return state.users[0]?.usertype
    },
    getUserById: (state) => {
        return (userId) => {            
            const userFound = state.users.find(user => user.id_usuario === userId)
            // console.log('userFound', userFound)
            return userFound
        }
    },
    isLoading(state) {
      return state.loading
    }
  },
  actions: {
    async fetchUsers(uid) {
      try {
        // const useAuth = useAuthStore()
        this.loading = true
        this.users = []

        const usersCollection = collection(db, 'users')
        const q = query(
            usersCollection,
          where("id_usuario", "==", uid)
        )
        
        const documents = await getDocs(q)
        // console.log('recorrer documentos users ',uid)
        // console.log('documents ',documents)

        documents.forEach(doc => {
          // console.log(doc.id, doc.data()) // --> tasks
          this.users.push({ id: doc.id, ...doc.data() })
        })
        this.loading = false
      } catch (e) {
        console.log(e)
      } finally {
        // console.log('finally users')
        this.loading = false
      }
    }
  }
})