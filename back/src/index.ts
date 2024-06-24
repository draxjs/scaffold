import SetupDrax from './setup/SetupDrax.js'

await SetupDrax()



import YogaFastifyServerFactory from './factories/YogaFastifyServerFactory.js'
const serverYogaFastify = YogaFastifyServerFactory()


const PORT:number = process.env.PORT ? parseInt(process.env.PORT) : 8085;
await serverYogaFastify.start(PORT);
