import {describe, it, beforeAll, afterAll, expect} from "vitest"
import TestSetup from "../../setup/TestSetup";


describe("Example Endpoints Test", async function () {

    //Define your entity routes and permissions here, if any.
    let inputSetup = {
        routes: [],
        permissions: []
    }

    let testSetup = new TestSetup(inputSetup)

    beforeAll(async () => {
        await testSetup.setup()
    })

    afterAll(async () => {
        await testSetup.dropAndClose()
        return
    })

    it("RootLogin and me", async () => {
        let {accessToken} = await testSetup.rootUserLogin()
        expect(accessToken).toBeTruthy()
        let user = await testSetup.me(accessToken)
        expect(user.username).toBe(testSetup.rootUserData.username)
    })




})
