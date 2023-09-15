import { defineStore } from "pinia";

import { db } from '@/services/firebase'

import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'

import { useAuthStore } from '@/stores/auth'

export const useUserTypesStore = defineStore({
  id: 'usertype',
  state: () => ({
    loading: false,
    usertypes: [],
    tasks: null
  }),
  getters: {
    getUserTypes(state) {
      // console.log('111', state.usertypes)
      return state.usertypes
    },    
    isLoading(state) {
      return state.loading
    }
  },
  actions: {
    async fetchUserTypes() {
      try {
        const useAuth = useAuthStore()
        this.loading = true
        this.usertypes = []
        const documents = await getDocs(collection(db, 'usertypes'))
        documents.forEach(doc => {
          // console.log(doc.id, doc.data()) // --> tasks
          this.usertypes.push({ id: doc.id, ...doc.data() })
        })
        this.loading = false
      } catch (e) {
        console.log(e)
      } finally {
        // console.log('finally')
        this.loading = false
      }
    }    
  }
})