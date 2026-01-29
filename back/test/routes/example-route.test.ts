import {describe, it, beforeAll, afterAll, expect} from "vitest"
import TestSetup from "../setup/TestSetup";


describe("Example Route Test", async function () {

    let testSetup = new TestSetup()

    beforeAll(async () => {
        await testSetup.setup()
    })

    afterAll(async () => {
        await testSetup.mongoInMemory.DropAndClose()
        return
    })

    it("Login & Me (express)", async () => {
        let {accessToken} = await testSetup.login()
        expect(accessToken).toBeTruthy()
        let user = await testSetup.me(accessToken)
        expect(user.username).toBe(testSetup.rootUserData.username)
    })

    it("Login & Me (detailed)", async () => {

        const loginResp = await testSetup.fastifyInstance.inject({
            method: 'POST',
            url: '/api/auth/login',
            payload: {
                username: testSetup.rootUserData.username,
                password: testSetup.rootUserData.password
            }
        });

        expect(loginResp.statusCode).toBe(200)

        let loginBody = loginResp.json()

        expect(loginBody.accessToken).toBeTruthy()

        let accessToken = loginBody.accessToken

        const resp = await testSetup.fastifyInstance.inject({
            method: 'get',
            url: '/api/auth/me',
            headers: {Authorization: `Bearer ${accessToken}`}
        });
        let body = resp.json()

        expect(resp.statusCode).toBe(200)
        expect(body.name).toBe(testSetup.rootUserData.name)


    })


})
