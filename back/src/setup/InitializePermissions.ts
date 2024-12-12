import {LoadPermissions} from "@drax/identity-back";
import {
    UserPermissions,
    RolePermissions,
    TenantPermissions,
    UserApiKeyPermissions
} from "@drax/identity-back";
import {MediaPermissions} from "@drax/media-back";


function InitializePermissions() {

    //Merge All Permissions
    const permissions = [
        ...Object.values(UserPermissions),
        ...Object.values(RolePermissions),
        ...Object.values(TenantPermissions),
        ...Object.values(UserApiKeyPermissions),
        ...Object.values(MediaPermissions),
    ]

    //Load All Permissions
    LoadPermissions(permissions)
}

export default InitializePermissions

export {InitializePermissions}

