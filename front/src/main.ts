// Plugins
// @ts-ignore
import { registerPlugins } from '@/plugins'


import i18n from "@/i18n/I18n";

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import {setupAuth} from "@/setup/SetupAuth";
import {useSetting} from "@drax/settings-vue";



const app = createApp(App)
registerPlugins(app)

app.use(i18n)

//Load Settings
const {fetchSettings, suscribeAuth} = useSetting()
await fetchSettings()
await suscribeAuth()

//Core Systems Factories
setupAuth()



app.mount('#app')
