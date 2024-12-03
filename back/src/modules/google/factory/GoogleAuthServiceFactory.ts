
import {GoogleAuthService} from '../services/GoogleAuthService.js'

class GoogleAuthServiceFactory {
    private static service: GoogleAuthService;

    public static get instance(): GoogleAuthService {
        if (!GoogleAuthServiceFactory.service) {
            GoogleAuthServiceFactory.service = new GoogleAuthService();
        }
        return GoogleAuthServiceFactory.service;
    }
}

export default GoogleAuthServiceFactory
export {
    GoogleAuthServiceFactory
}

