<script setup>
import AppHeader from '@/components/AppHeader.vue'

import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

import { ref, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'

import { usePedidoStore } from '@/stores/pedido'

const { createPedido, deletePedido, updatePedido, isLoading } = usePedidoStore()

const {
  fetchPedidos,
} = usePedidoStore()

onBeforeMount(() => {
  fetchPedidos()
})

const PedidoStore = usePedidoStore();
const { getPedidos, getPedidoById } = storeToRefs(PedidoStore);

const formPedido = ref({
  id_cliente: '',
  productos: []
})

const formEditarPedido = ref({
  id_cliente: '',
  productos: []
})

const idPedido = ref('')
const errorSinProductos = ref('')

const showNuevoPedidoModal = ref(false)
const handleNuevoPedido = () => showNuevoPedidoModal.value = true

const showEditarPedidoModal = ref(false)
const handleEditarPedido = (id) =>{
  idPedido.value = id
  const Pedido = PedidoStore.getPedidoById(id)
  // console.log(Pedido.productos)
  formEditarPedido.value.id_cliente = Pedido.id_cliente
  formEditarPedido.value.productos = Pedido.productos
  showEditarPedidoModal.value = true
} 

const showEliminarPedidoModal = ref(false)
const handleEliminarPedido = (id) => {
  idPedido.value = id
  showEliminarPedidoModal.value = true
}

const refFormNuevoPedido = ref()

const handleCreatePedido = async () => {

  var valid = false 
  if (formPedido.value.productos.length>0) valid = true

  if (valid) {
    console.log('Creando pedido ...')
    const response = await createPedido(formPedido.value)
  
    if (response.id) {
      await PedidoStore.fetchPedidos()
      formPedido.value.id_cliente = ""
      formPedido.value.productos.length = 0
      showNuevoPedidoModal.value = false
    }
  } else {
    // alert('Debe agregar por lo menos un producto')
    errorSinProductos.value = 'ERROR: Debe agregar por lo menos un producto'
  }

}

const handleRemovePedido = async (id) => {
  
  // var confirmar = confirm("Esta seguro de eliminar el registro seleccionado?")

  // if (confirmar) {
    await deletePedido({ docId: id })
    await fetchPedidos()
    showEliminarPedidoModal.value = false
  // }
  
}

const handleUpdatePedido = async (id) => {
  
  await updatePedido({ docId: id, id_cliente: formEditarPedido.value.id_cliente, productos: formEditarPedido.value.productos })
  
  await fetchPedidos()

  showEditarPedidoModal.value = false
  
}

import { useUserTypesStore } from '@/stores/usertypes'
const { fetchUserTypes } = useUserTypesStore()
const UserTypeStore = useUserTypesStore();
const { getUserTypes } = storeToRefs(UserTypeStore);

import { useClientesStore } from '@/stores/clientes'
const { fetchClientes } = useClientesStore()
const ClienteStore = useClientesStore();
const { getClientes, getDetalleClienteById } = storeToRefs(ClienteStore);

import { useProductosStore } from '@/stores/productos'
const { fetchProductos } = useProductosStore()
const ProductoStore = useProductosStore();
const { getProductos, getDescripcionProductoById } = storeToRefs(ProductoStore);

onBeforeMount(() => {
    fetchUserTypes()
    fetchClientes()
    fetchProductos()
})

</script>

<template>
    <AppHeader />
    <header class="bg-white shadow">
      <div class="flex space-x-4 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">List Pedidos</h1>
        <button @click="handleNuevoPedido" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Nuevo
        </button>
      </div>
      
    </header>
    <main>
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <table class="auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
              <th class="px-4 py-2">Cliente</th>
              <th class="px-4 py-2">Dirección</th>
              <th class="px-4 py-2">Total Productos</th>
              <th class="px-4 py-2"></th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="pedido in getPedidos">
                <td class="border px-4 py-2">{{ getDetalleClienteById(pedido.id_cliente)[0] }}</td>
                <td class="border px-4 py-2">{{ getDetalleClienteById(pedido.id_cliente)[1] }}</td>
                <td class="border px-4 py-2">{{ pedido.productos.length }}</td>
                <td class="border px-4 py-2">
                  <button @click="handleEditarPedido(pedido.id)" class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 mx-1 rounded">
                    Editar
                  </button>
                  <button @click="handleEliminarPedido(pedido.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mx-1 rounded">
                    Eliminar
                  </button>
                </td>
              </tr>
          </tbody>
        </table>
      </div>
    </main>

    <TransitionRoot as="template" :show="showNuevoPedidoModal">
      <Dialog as="div" class="relative z-10" @close="showNuevoPedidoModal = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form @submit.prevent="handleCreatePedido">
                  <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                      <div class="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <DialogTitle as="h2" class="text-base font-bold leading-6 text-gray-900">Nuevo Pedido</DialogTitle>
                        <div>
                          
                            <div class="my-5">
                              <BaseSelect
                                  required
                                  label="Cliente"
                                  :options=getClientes
                                  v-model="formPedido.id_cliente"
                              />
                            </div>

                            <div class="flex">
                              <div class="mb-5 mr-2">
                                <BaseSelect
                                    label="Producto"
                                    :options=getProductos
                                    v-model="formPedido.id_producto"
                                />
                              </div>

                              <div class="mb-5 mr-2">
                                <BaseInput
                                class="text-end"
                                label="Cantidad"
                                type="number"
                                placeholder="0" 
                                v-model="formPedido.cantidad"
                                /> 
                              </div>
                              
                              <div class="mb-5">
                                <label class="text-white">.</label>
                                <button type="button" @click="formPedido.productos.push({id_producto: formPedido.id_producto, cantidad: formPedido.cantidad});formPedido.id_producto='';formPedido.cantidad='';errorSinProductos=''" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                  +
                                </button>
                              </div>
                            </div>
                            
                            
                            
                            <table class="auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
                              <thead class="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                  <tr>
                                  <th class="px-4 py-2">Producto</th>
                                  <th class="px-4 py-2 ">Cantidad</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr ref={completeButtonRef} v-if="formPedido.productos.length==0">
                                    <td colspan="2" align="center">No existen productos seleccionados</td>
                                  </tr>
                                  <tr v-for="producto in formPedido.productos">
                                    <td class="border px-4 py-2">{{ getDescripcionProductoById(producto.id_producto) }}</td>
                                    <td class="border px-4 py-2 text-end">{{ producto.cantidad }}</td>                                  
                                  </tr>
                              </tbody>
                            </table>
                            <span class="text-red-500 font-bold text-sm">{{ errorSinProductos }}</span>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="submit" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Grabar</button>
                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="showNuevoPedidoModal = false; formPedido.id_cliente = ''; formPedido.productos.length = 0; errorSinProductos = ''" ref="cancelButtonRef">Cancelar</button>
                  </div>
                </form> 
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <TransitionRoot as="template" :show="showEditarPedidoModal">
      <Dialog as="div" class="relative z-10" @close="showEditarPedidoModal = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form @submit.prevent="handleUpdatePedido(idPedido)">
                  <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                      <div class="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <DialogTitle as="h2" class="text-base font-bold leading-6 text-gray-900">Editar Pedido</DialogTitle>
                        <div>
                          
                            <div class="my-5">
                              <BaseSelect
                                  label="Cliente"
                                  :options=getClientes
                                  v-model="formEditarPedido.id_cliente"
                              />
                            </div>

                            <div class="flex">
                              <div class="mb-5 mr-2">
                                <BaseSelect
                                    label="Producto"
                                    :options=getProductos
                                    v-model="formEditarPedido.id_producto"
                                />
                              </div>

                              <div class="mb-5 mr-2">
                                <BaseInput
                                class="text-end"
                                label="Cantidad"
                                type="number"
                                placeholder="0" 
                                v-model="formEditarPedido.cantidad"
                                /> 
                              </div>
                              
                              <div class="mb-5">
                                <label class="text-white">.</label>
                                <button type="button" @click="formEditarPedido.productos.push({id_producto: formEditarPedido.id_producto, cantidad: formEditarPedido.cantidad});formEditarPedido.id_producto='';formEditarPedido.cantidad=''" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                  +
                                </button>
                              </div>
                            </div>
                            
                            
                            
                            <table class="auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
                              <thead class="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                  <tr>
                                  <th class="px-4 py-2">Producto</th>
                                  <th class="px-4 py-2 ">Cantidad</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr v-if="formEditarPedido.productos.length==0">
                                    <td colspan="2" align="center">No existen productos seleccionados</td>
                                  </tr>
                                  <tr v-for="producto in formEditarPedido.productos">
                                    <td class="border px-4 py-2">{{ getDescripcionProductoById(producto.id_producto) }}</td>
                                    <td class="border px-4 py-2 text-end">{{ producto.cantidad }}</td>                                  
                                  </tr>
                              </tbody>
                            </table>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="submit" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Actualizar</button>
                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="showEditarPedidoModal = false" ref="cancelButtonRef">Cancelar</button>
                  </div>
                </form> 
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>      
    
    
    <TransitionRoot as="template" :show="showEliminarPedidoModal">
      <Dialog as="div" class="relative z-10" @close="showEliminarPedidoModal = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                      <div class="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <DialogTitle as="h2" class="text-base font-bold leading-6 text-gray-900">Eliminar Pedido</DialogTitle>
                        <div>                          
                           <span>¿Está seguro de eliminar el pedido seleccionado?</span>                           
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" @click="handleRemovePedido(idPedido)">Si</button>
                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="showEliminarPedidoModal = false" ref="cancelButtonRef">No</button>
                  </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>    


</template>