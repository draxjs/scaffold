import NotificationPermissions from "../../../modules/base/permissions/NotificationPermissions.js";

const role = {
  name: "Operator",
  permissions: [
    NotificationPermissions.Manage,
    NotificationPermissions.View,
    NotificationPermissions.Delete,
    NotificationPermissions.Create,
    NotificationPermissions.Update,
  ],
  childRoles: [
  ],
  readonly: true
}

export default role
