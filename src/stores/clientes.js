import { defineStore } from "pinia";

import { db } from '@/services/firebase'

import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'

import { useAuthStore } from '@/stores/auth'

export const useClientesStore = defineStore({
  id: 'cliente',
  state: () => ({
    loading: false,
    clientes: [],
    tasks: null
  }),
  getters: {
    getClientes(state) {
      // console.log('111', state.clientes)
      return state.clientes
    },   
    getDetalleClienteById: (state) => {
        return (clienteId) => {
            // console.log("productoId", productoId)        
            const clienteFound = state.clientes.find(cliente => cliente.id === clienteId)
            return [clienteFound?.descripcion,clienteFound?.direccion]
            // return productoId
        }
    },    
    isLoading(state) {
      return state.loading
    }
  },
  actions: {
    async fetchClientes() {
      try {
        const useAuth = useAuthStore()
        this.loading = true
        this.clientes = []
        const documents = await getDocs(collection(db, 'clientes'))
        documents.forEach(doc => {
          // console.log(doc.id, doc.data()) // --> tasks
          this.clientes.push({ id: doc.id, ...doc.data() })
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