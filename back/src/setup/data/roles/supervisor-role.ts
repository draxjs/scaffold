import {UserPermissions, RolePermissions, TenantPermissions} from "@drax/identity-back"
import operatorRole from "./operator-role.js";

const role = {
  name: "Supervisor",
  permissions: [
    UserPermissions.Create,
    UserPermissions.View,
    UserPermissions.Manage,
    UserPermissions.Update,
    RolePermissions.View,
    TenantPermissions.View,

  ],
  childRoles: [
    operatorRole.name
  ],
  readonly: true
}

export default role
