import {IEntitySchema} from "@drax/arch";

const schema: IEntitySchema = {
    module: "people",
    name: "Language",
    apiBasePath:'languages',
    apiTag: 'ERP',
    schema: {
        name: {type: 'string', required: true, unique: true, index: true, search:true, header: true},
    }
}


export default schema;
export {schema};
