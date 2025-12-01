import {CrudEventEmitter} from "@drax/crud-back";
import {RegisterCrudEvent} from "@drax/audit-back";


function InitializeAudit() {


    CrudEventEmitter.getInstance().on('crud:event', (data) => {

        RegisterCrudEvent(data)
            .then(() => console.log(`Event Registered: ${data.type} - ${data.id}`))
            .catch(e => console.error(e))
    })

    //Load All Permissions
}

export default InitializeAudit

export {InitializeAudit}

