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
    ]

    //Load All Permissions
    LoadPermissions(permissions)
}

export default InitializePermissions

export {InitializePermissions}

