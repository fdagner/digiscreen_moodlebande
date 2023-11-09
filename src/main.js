import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import messages from '@/lang'
import VueKonva from 'vue-konva'

const i18n = createI18n({
	locale: 'fr',
	fallbackLocale: 'fr',
	messages
})

const app = createApp(App)
app.use(i18n)
app.use(VueKonva)
app.mount('#app')
