import {LoadPermissions} from "@drax/identity-back";
import {
    UserPermissions,
    RolePermissions,
    TenantPermissions,
    UserApiKeyPermissions,
    UserLoginFailPermissions,
    UserSessionPermissions
} from "@drax/identity-back";
import {MediaPermissions} from "@drax/media-back";
import {SettingPermissions} from "@drax/settings-back";
import {DashboardPermissions} from "@drax/dashboard-back";
import {AuditPermissions} from "@drax/audit-back";

import {BasePermissions} from "../modules/base/permissions/BasePermissions.js";
import {NotificationPermissions} from "../modules/base/permissions/NotificationPermissions.js";


function InitializePermissions() {

    //Merge All Permissions
    const permissions = [
        ...Object.values(UserPermissions),
        ...Object.values(RolePermissions),
        ...Object.values(TenantPermissions),
        ...Object.values(UserApiKeyPermissions),
        ...Object.values(UserLoginFailPermissions),
        ...Object.values(UserSessionPermissions),
        ...Object.values(MediaPermissions),
        ...Object.values(SettingPermissions),
        ...Object.values(DashboardPermissions),
        ...Object.values(AuditPermissions),

        //Local modules permissions
        ...Object.values(BasePermissions),
        ...Object.values(NotificationPermissions),

    ]

    //Load All Permissions
    LoadPermissions(permissions)
}

export default InitializePermissions

export {InitializePermissions}

