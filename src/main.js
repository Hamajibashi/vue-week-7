import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import $httpMessageState from '@/methods/pushMessageState.js'
import { date, currency } from './methods/filters'

const app = createApp(App)
app.config.globalProperties.$filters = {
  date,
  currency
}

app.config.globalProperties.$httpMessageState = $httpMessageState

app.use(router)
app.use(VueAxios, axios)
app.use('Loading', Loading)
app.mount('#app')
