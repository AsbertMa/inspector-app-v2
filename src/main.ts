import DBInstance from './svc/storage'
import { keys } from './svc/inject'
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './registerServiceWorker'

const Inspector = createApp(App)
Inspector.provide(keys.Database, DBInstance)
Inspector.use(router).mount('#app')