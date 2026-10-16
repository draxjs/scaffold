import App from './App.vue'
import indexI18n from "@/i18n/index-I18n";
import vuetify from "@/plugins/vuetify";
import router from "@/router/index-routes";
import pinia from "@/stores";
import { createApp } from 'vue'
import {setupAuth} from "./setup/SetupAuth";
import setupSetting from "./setup/SetupSetting";
import SetupEntities from "./setup/SetupEntities";
import setupButtons from "./setup/SetupButtons";

async function bootstrap() {
  //Setup App
  const app = createApp(App)

  //Setup Pinia
  app.use(pinia)

  //Restore authentication before API requests and the initial navigation.
  await setupAuth()

  //Setup Settings
  setupSetting().then(() => {console.log("Setting Setup Done")})

  //Setup Entities
  SetupEntities()

  //Setup Custom Buttons
  setupButtons()

  //Setup Custom Identity Cruds
  //setupCustomIdentity()

  //Setup Router, I18n and Vuetify
  app
    .use(vuetify)
    .use(router)
    .use(indexI18n)

  //Mount App
  app.mount('#app')
}

void bootstrap()
