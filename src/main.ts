import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import router from './router'
import PhosphorIcons from '@phosphor-icons/vue'
import { useBabyStore } from './stores/baby'
import { useUiStore } from './stores/ui'
import { useProfileStore } from './stores/profile'

const app = createApp(App)
const pinia = createPinia()

app.use(ElementPlus)
app.use(PhosphorIcons)
app.use(pinia)
app.use(router)

// Init persisted state early
const store = useBabyStore(pinia)
store.initFromStorage()
const ui = useUiStore(pinia)
ui.initTheme()
const profileStore = useProfileStore(pinia)
profileStore.initFromStorage()

app.mount('#app')
