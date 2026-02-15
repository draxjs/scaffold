import {IdentityI18nMessages} from "@drax/identity-front"
import {CommonI18nMessages } from "@drax/common-front"
import {AuditI18nMessages } from "@drax/audit-front"
import {DashboardI18nMessages } from "@drax/dashboard-front"
import {SettingI18nMessages } from "@drax/settings-front"

import merge from 'deepmerge'
import {LocaleMessages} from "vue-i18n";


const draxI18n = merge.all([
  CommonI18nMessages,
  IdentityI18nMessages,
  AuditI18nMessages,
  DashboardI18nMessages,
  SettingI18nMessages
]) as LocaleMessages<never>

export default draxI18n
export {
  draxI18n
}
