
import {EntityCrud} from "@drax/crud-vue";
import type{
  IDraxCrudProvider,
  IEntityCrud,
  IEntityCrudField,
  IEntityCrudFilter,
  IEntityCrudHeader, 
  IEntityCrudPermissions,
  IEntityCrudRefs,
  IEntityCrudRules
} from "@drax/crud-share";
import NotificationProvider from "../providers/NotificationProvider";

//Import EntityCrud Refs
import {UserCrud} from "@drax/identity-vue"

class NotificationCrud extends EntityCrud implements IEntityCrud {

  static singleton: NotificationCrud

  constructor() {
    super();
    this.name = 'Notification'
  }
  
  static get instance(): NotificationCrud {
    if(!NotificationCrud.singleton){
      NotificationCrud.singleton = new NotificationCrud()
    }
    return NotificationCrud.singleton
  }

  get permissions(): IEntityCrudPermissions{
    return {
      manage: 'notification:manage', 
      view: 'notification:view', 
      create: 'notification:create', 
      update: 'notification:update', 
      delete: 'notification:delete'
    }
  }

  get headers(): IEntityCrudHeader[] {
    return [
        {title: 'title',key:'title', align: 'start'},
{title: 'type',key:'type', align: 'start'},
{title: 'status',key:'status', align: 'start'},
{title: 'user',key:'user', align: 'start'}
    ]
  }
  
  get selectedHeaders(): string[] {
    return this.headers.map(header => header.key)
  }
  
  get actionHeaders():IEntityCrudHeader[]{
    return [
      {
        title: 'action.actions',
        key: 'actions',
        sortable: false,
        align: 'center',
        minWidth: '190px',
        fixed: 'end'
      },
    ]
  }

  get provider(): IDraxCrudProvider<any, any, any>{
    return NotificationProvider.instance
  }
  
  get refs(): IEntityCrudRefs{
    return {
      User: UserCrud.instance 
    }
  }

  get rules():IEntityCrudRules{
    return {
      title: [(v: any) => !!v || 'validation.required'],
message: [(v: any) => !!v || 'validation.required'],
type: [(v: any) => !!v || 'validation.required'],
status: [(v: any) => !!v || 'validation.required'],
user: [(v: any) => !!v || 'validation.required'],
metadata: [],
readAt: []
    }
  }

  get fields(): IEntityCrudField[]{
    return [
        {name:'title',type:'string',label:'title',default:''},
{name:'message',type:'string',label:'message',default:''},
{name:'type',type:'enum',label:'type',default:null,enum: ['info', 'success', 'warning', 'error']},
{name:'status',type:'enum',label:'status',default:'unread',enum: ['unread', 'read']},
{name:'user',type:'ref',label:'user',default:null,ref: 'User',refDisplay: 'username'},
{name:'metadata',type:'record',label:'metadata',default:null},
{name:'readAt',type:'date',label:'readAt',default:null}
    ]
  }
  
  get filters():IEntityCrudFilter[]{
    return [
      //{name: '_id', type: 'string', label: 'ID', default: '', operator: 'eq' },
    ]
  }
  
  get isViewable(){
    return true
  }

  get isEditable(){
    return true
  }

  get isCreatable(){
    return true
  }

  get isDeletable(){
    return true
  }

  get isExportable(){
    return true
  }

  get exportFormats(){
    return ['CSV', 'JSON']
  }

  get exportHeaders(){
    return ['_id']
  }

  get isImportable(){
    return true
  }
  
  get isColumnSelectable() {
    return true
  }

  get isGroupable() {
    return true
  }

  get importFormats(){
    return ['CSV', 'JSON']
  }

  get dialogFullscreen(){
    return false
  }
  
  get tabs() {
    return [
     
    ]
  }
  
  get menus() {
    return [
     
    ]
  }


}

export default NotificationCrud

