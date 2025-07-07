import ServerService from "../../services/ServerService.js";
export default {
    Query: {
        server: () => {
            let serverService = new ServerService();
            return {applicationName: serverService.getApplicationName}
        }
    }
}
