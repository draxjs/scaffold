import {describe, it, beforeAll, afterAll, expect} from "vitest"
import TestSetup from "../../setup/TestSetup";


describe("Example Service Test", async function () {


    let testSetup = new TestSetup()

    beforeAll(async () => {
        await testSetup.setup()
    })

    afterAll(async () => {
        await testSetup.dropAndClose()
        return
    })

    it("should create a xxxx", async function () {
        expect(1).toBe(1)
    })





})
