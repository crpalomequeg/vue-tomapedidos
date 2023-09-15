import { defineStore } from "pinia";

import { db } from '@/services/firebase'

import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore'

import { useAuthStore } from '../stores/auth'

export const usePedidoStore = defineStore({
    id: 'pedido',
    state: () => ({
      loading: false,
      pedidos: [],
      tasks: null
    }),
    getters: {
      getPedidos(state) {
        // console.log('111', state.pedidos)
        return state.pedidos
      },
      getPedidoById: (state) => {
        return (pedidoId) => {
          
          const pedidoFound = state.pedidos.find(pedido => pedido.id === pedidoId)
          // console.log('pedidoFound', pedidoFound)
          return pedidoFound
        }
      },
      isLoading(state) {
        return state.loading
      }
    },
    actions: {
      async deletePedido({
        docId
      }) {
        try {
          const docRef = doc(db, 'pedidos', docId)
          const docData = await getDoc(docRef)
  
          if (!docData.exists()) {
            throw new Error('El pedido no existe')
          }
  
          await deleteDoc(docRef)
        } catch(error) {
          console.log(error.message)
        }
      },
      async updatePedido({
        docId,
        id_cliente,
        productos
      }) {
        try {
            const docRef = doc(db, 'pedidos', docId)
  
            const res = await updateDoc(docRef, {
            id_cliente: id_cliente,
            productos: productos
            })
  
            return res
        } catch (e) {
            console.error(e)
        }
      },      
      async createPedido({ id_cliente, productos }) {
        try {
          const useAuth = useAuthStore()
          // console.log('useAuth.user.uid', useAuth.user.uid)
          const newCollection = collection(db, 'pedidos')
          const docReference = await addDoc(newCollection, {
            id_cliente,
            id_vehiculo: "0",
            productos,
            id_usuario: useAuth.user.uid
          })
          return docReference
        } catch (e) {
          console.error(e)
        }
      },
      async fetchPedidos() {
        try {
          const useAuth = useAuthStore()
          this.loading = true
          this.pedidos = []
          const pedidosCollection = collection(db, 'pedidos')
          const q = query(
            pedidosCollection,
            where("id_usuario", "==", useAuth.user.uid)
          )
          // console.log(useAuth.user.uid)
          const documents = await getDocs(q)
  
          // console.log(documents)
          
          documents.forEach(doc => {
            // console.log(doc.id, doc.data()) // --> tasks
            this.pedidos.push({ id: doc.id, ...doc.data() })
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