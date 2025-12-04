import {CrudEventEmitter} from "@drax/crud-back";
import {RegisterCrudEvent} from "@drax/audit-back";

function InitializeAudit() {
    CrudEventEmitter.getInstance().on('crud:event', (data) => {
        RegisterCrudEvent(data)
            .catch(e => console.error(e))
    })
}

export default InitializeAudit

export {InitializeAudit}

