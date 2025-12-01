import {DraxConfig, CommonConfig, MongooseConector, LoadCommonConfigFromEnv} from "@drax/common-back";
import { LoadIdentityConfigFromEnv} from "@drax/identity-back";
import InitializePermissions from "./InitializePermissions.js";
import CreateRootUserAndAdminRole from "./CreateRootUserAndAdminRole.js";
import CreateSystemRoles from "./CreateSystemRoles.js";
import InitializeSettings from "./InitializeSettings.js";
import InitializeAudit from "./InitializeAudit.js";

async function SetupDrax(){

    //Load Identity Drax Config from enviroment variables
    LoadCommonConfigFromEnv()
    LoadIdentityConfigFromEnv()

    //Setup MongoDB connection if needed
    if(DraxConfig.getOrLoad(CommonConfig.DbEngine) === 'mongo'){
        const mongooseUri = DraxConfig.getOrLoad(CommonConfig.MongoDbUri)
        const mongooseConector = new MongooseConector(mongooseUri)
        mongooseConector.connect()
    }

    //Setup Permissions
    InitializePermissions()

    //Setup Audit
    InitializeAudit()

    //Setup Settings
    await InitializeSettings()

    //Create Root User and Admin Role
    await CreateRootUserAndAdminRole()

    await CreateSystemRoles()
}

export default SetupDrax
export {SetupDrax}
