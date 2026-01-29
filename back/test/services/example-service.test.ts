import {describe, it, beforeAll, afterAll, expect} from "vitest"
import MongoInMemory from "../setup/MongoInMemory";
import {UserServiceFactory, RoleServiceFactory} from "@drax/identity-back"


describe("Example Route Test", async function () {

    process.env.DRAX_DB_ENGINE = "mongo";
    let mongoInMemory = new MongoInMemory()
    let userService = UserServiceFactory()
    let roleService = RoleServiceFactory()
    const user = {
        _id: "646a661e44c93567c23d8d61",
        active: true,
        groups: [],
        username:  "root",
        email: "root@example.com",
        password: "12345678",
        name: "root",
        phone: "123456789",
        role: "646a661e44c93567c23d8d62",
    };
    const role = {
        _id: "646a661e44c93567c23d8d62",
        name: "Admin",
        permissions: [],
        childRoles: [],
        readonly: false
    }

    beforeAll(async () => {
        await mongoInMemory.connect()
    })

    afterAll(async () => {
        await mongoInMemory.DropAndClose()
        return
    })

    it("should create role and user", async function () {
        let roleCreated = await roleService.create(role)
        expect(roleCreated.name).toBe(role.name)
        let userCreated = await userService.create(user)
        expect(userCreated.username).toBe(user.username)
    })


    it("should find user", async function () {
        let userFound = await userService.findById(user._id)
        expect(userFound.username).toBe(user.username)
    })


})
