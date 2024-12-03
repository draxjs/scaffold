import {OAuth2Client} from 'google-auth-library';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

class GoogleAuthService {


    async validateToken(token: string): Promise<any> {
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If the request specified a Google Workspace domain:
        // const domain = payload['hd'];
        return payload;
    }
}

export default GoogleAuthService;
export {GoogleAuthService}
