import { GoogleAuthService } from '../services/GoogleAuthService.js';
class GoogleAuthServiceFactory {
    static get instance() {
        if (!GoogleAuthServiceFactory.service) {
            GoogleAuthServiceFactory.service = new GoogleAuthService();
        }
        return GoogleAuthServiceFactory.service;
    }
}
export default GoogleAuthServiceFactory;
export { GoogleAuthServiceFactory };
