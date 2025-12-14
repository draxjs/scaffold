import {UserCrud, RoleCrud, TenantCrud} from "@drax/identity-vue"
import { useEntityStore } from '@drax/crud-vue'

function setupEntities(){
  const entityStore = useEntityStore()
  entityStore.addEntity(UserCrud.instance)
  entityStore.addEntity(RoleCrud.instance)
  entityStore.addEntity(TenantCrud.instance)
  //TODO Add domain entities here...

}

export default setupEntities
