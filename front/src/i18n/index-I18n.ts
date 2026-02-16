import {createI18n} from "vue-i18n";

import {draxI18n} from "./drax-I18n";
import {modulesI18n} from "./modules-I18n";
import merge from 'deepmerge'
import {LocaleMessages} from "vue-i18n";

const allI18n = merge.all([
  draxI18n,
  modulesI18n
]) as LocaleMessages<never>

const indexI18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages: allI18n
})

export default indexI18n
