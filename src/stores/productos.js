import { defineStore } from "pinia";

import { db } from '@/services/firebase'

import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'

import { useAuthStore } from '@/stores/auth'

export const useProductosStore = defineStore({
  id: 'producto',
  state: () => ({
    loading: false,
    productos: [],
    tasks: null
  }),
  getters: {
    getProductos(state) {
      // console.log('111 productos ', state.productos)
      return state.productos
    },   
    getDescripcionProductoById: (state) => {
        return (productoId) => {
            // console.log("productoId", productoId)        
            const productoFound = state.productos.find(producto => producto.id === productoId)
            return productoFound?.descripcion
            // return productoId
        }
    }, 
    isLoading(state) {
      return state.loading
    }
  },
  actions: {
    async fetchProductos() {
      try {
        const useAuth = useAuthStore()
        this.loading = true
        this.productos = []
        const documents = await getDocs(collection(db, 'productos'))
        documents.forEach(doc => {
          // console.log(doc.id, doc.data()) // --> tasks
          this.productos.push({ id: doc.id, ...doc.data() })
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