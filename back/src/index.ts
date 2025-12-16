import path from "path";
import {fileURLToPath} from "url";

import SetupDrax from './setup/SetupDrax.js'
await SetupDrax()

const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));

import FastifyServerFactory from './factories/FastifyServerFactory.js'

const PORT = parseInt(process.env.DRAX_PORT) || 8080;
const serverYogaFastify = FastifyServerFactory(ROOT_DIR)
await serverYogaFastify.start(PORT);


