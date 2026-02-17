
import merge from "deepmerge";
import NotificationMessages from "./Notification-i18n"

const messages = merge.all([
    NotificationMessages
])

export default messages
