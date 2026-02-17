import merge from 'deepmerge'
import {LocaleMessages} from "vue-i18n";
import baseI18n from '../modules/base/i18n/index'

const modulesI18n = merge.all([
  baseI18n,
]) as LocaleMessages<never>

export default modulesI18n

export {
  modulesI18n
}
