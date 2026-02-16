
import merge from "deepmerge";
import NotificationMessages from "./Notification-i18n"

const baseI18n = merge.all([
    NotificationMessages
])

export default baseI18n
export {
  baseI18n
}
