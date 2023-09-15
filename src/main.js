import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { globalRegistration } from '@/components/shared/global'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

globalRegistration(app)

app.mount('#app')
