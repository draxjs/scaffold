import {IEntitySchema} from "@drax/arch";

const schema: IEntitySchema = {
    module: "people",
    name: "Person",
    apiBasePath:'people',
    apiTag: 'ERP',
    schema: {
        fullname: {type: 'string', required: true, unique: true, index: true, search:true, header: true},
        live: {type: 'boolean', required: false, unique: false, index: false, header: true},
        birthdate: {type: 'date', required: false, unique: false, index: false, header: true},
        secret: {type: 'password', required: false, unique: false, index: false, header: false},
        nationality: {type: 'ref', ref:'Country', refDisplay: 'name', required: false, unique: false, index: false, header: true},
        hobbies: {type: 'array.string', required: false, unique: false, index: false, search:true, header: true},
        race: {type: 'enum', enum:["human","elf","orc"], required: false, unique: false, index: false, search:true, header: true},
        interests: {type: 'array.enum', enum:["sports","music","reading","travel","cooking","technology"], required: false, unique: false, index: false, search:true, header: true},
        languages: {type: 'array.ref', ref:'Language', refDisplay: 'name', required: false, unique: false, index: false, header: true},
        address: {
            type: 'object', header: true, schema: {
                country: {type: 'string', required: false, unique: false, index: false},
                city: {type: 'string', required: false, unique: false, index: false},
                street: {type: 'string', required: true, unique: false, index: false},
                zip: {type: 'string', required: false, unique: false, index: false},
            }
        },
        skills: {
            type: 'array.object', header: false, schema: {
                name: {type: 'string', required: true, unique: false, index: false},
                level: {type: 'number', required: false, unique: false, index: false},
            }
        },
        tenant: {type: 'ref', ref:'Tenant', refDisplay: 'name', required: false, unique: false, index: false, header: true},
        user: {type: 'ref', ref:'User', refDisplay: 'username', required: false, unique: false, index: false, header: true},
    }
}


export default schema;
export {schema};
