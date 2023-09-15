import { defineStore } from "pinia";

import { auth, db } from '@/services/firebase'

import { collection, addDoc } from 'firebase/firestore'

import { useRouter } from 'vue-router';

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword
} from 'firebase/auth'


export const useAuthStore = defineStore({
  id: 'auth',
  state: () =>({
    user: null,
    loading: false
  }),
  getters: {
    getLoading(state) {
      return state.loading
    },
    getUser(state) {
      return state.user
    },
    isLoggedIn(state) {
      return Boolean(state.user)
    }
  },
  actions: {
    async login(email, password) {
      // console.log('estoy en la acción login de la store auth')
      try {
        this.loading = true
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        )
        this.user = user
        this.isAuth = true
        // console.log(this.loading)
      } catch (error) {
        console.error(error)
      }
      finally {
        this.loading = false
        // console.log(this.loading)
      }
    },
    async logout() {
      // console.log('estoy en la acción logut de la store auth')
      try {
        await signOut(auth)
        this.loading = false
        this.user = null
        this.isAuth = false
      } catch (error) {
        console.error(error)
      }
    },

    async register(email, password, firstName, lastName, usertype) {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            .then((credential) => {
                // console.log(credential.user.uid)
                const newCollection = collection(db, 'users')
                // const router = useRouter()
                addDoc(newCollection, {
                    id_usuario: credential.user.uid,
                    firstName,
                    lastName,
                    usertype,
                  })
                  // .then(() => router.push({ name: 'pedidos' }))
              })
        } catch(error) {
            console.error(error)
        }
    },

    async currentUser() {
      // https://firebase.google.com/docs/auth/web/manage-users
      return new Promise((resolve, reject) => {
        onAuthStateChanged(
          auth,
          user => {
            if (user) {
              this.user = {
                email: user.email,
                uid: user.uid,
              }
            } else {
              this.user = null
            }
            // console.log('currentUser-store', { user })
            resolve(user)
          },
          error => reject(error)
        )
      })
    }
  }
})