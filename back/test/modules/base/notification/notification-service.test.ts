import { describe, it, beforeAll, afterAll, expect } from "vitest"
import NotificationServiceFactory from "../../../../src/modules/base/factory/services/NotificationServiceFactory"
import NotificationService from "../../../../src/modules/base/services/NotificationService"
import TestSetup from "../../../setup/TestSetup"
import type { INotificationBase } from "../../../../src/modules/base/interfaces/INotification"


describe("Notification Service Test", function () {

    let testSetup = new TestSetup()
    let notificationService: NotificationService

    beforeAll(async () => {
        await testSetup.setup()
        notificationService = NotificationServiceFactory.instance
    })

    afterAll(async () => {
        await testSetup.dropAndClose()
        return
    })

    it("should create a new notification and find by id", async () => {

        await testSetup.dropCollection('Notification')

        const newNotification: INotificationBase = {
            title: "Test Notification",
            message: "This is a test notification message",
            type: "info",
            status: "unread",
            user: testSetup.rootUser._id
        }

        const notification = await notificationService.create(newNotification)

        expect(notification.title).toBe("Test Notification")
        expect(notification._id).toBeDefined()

        const getNotification = await notificationService.findById(notification._id)
        expect(getNotification?.title).toBe("Test Notification")
    })


    it("should create and update a notification and finally find by id", async () => {

        await testSetup.dropCollection('Notification')

        const newNotification: INotificationBase = {
            title: "Test Notification",
            message: "This is a test notification message",
            type: "info",
            status: "unread",
            user: testSetup.rootUser._id
        }

        const notification = await notificationService.create(newNotification)

        const updateData: INotificationBase = {
            title: "Updated Notification",
            message: "Updated message",
            type: "warning",
            status: "read",
            user: testSetup.rootUser._id
        }

        const updatedNotification = await notificationService.update(notification._id, updateData)

        expect(updatedNotification.title).toBe("Updated Notification")
        expect(updatedNotification.type).toBe("warning")

        const getNotification = await notificationService.findById(notification._id)
        expect(getNotification?.title).toBe("Updated Notification")
        expect(getNotification?.status).toBe("read")
    })


    it("should create and delete a notification", async () => {

        await testSetup.dropCollection('Notification')

        const newNotification: INotificationBase = {
            title: "Test Notification",
            message: "This is a test notification message",
            type: "info",
            status: "unread",
            user: testSetup.rootUser._id
        }

        const notification = await notificationService.create(newNotification)

        expect(notification._id).toBeDefined()

        const deleteResult = await notificationService.delete(notification._id)
        expect(deleteResult).toBe(true)

        const getNotification = await notificationService.findById(notification._id)
        expect(getNotification).toBe(null)
    })


    it("Should create and paginate notifications", async () => {

        await testSetup.dropCollection('Notification')

        const notificationData: INotificationBase[] = [
            {
                title: "Notification 1",
                message: "Message 1",
                type: "info",
                status: "unread",
                user: testSetup.rootUser._id
            },
            {
                title: "Notification 2",
                message: "Message 2",
                type: "warning",
                status: "unread",
                user: testSetup.rootUser._id
            }
        ]

        for (const data of notificationData) {
            await notificationService.create(data)
        }

        const result = await notificationService.paginate({ page: 1, limit: 10 })

        expect(result.items.length).toBe(2)
        expect(result.total).toBe(2)
        expect(result.page).toBe(1)
        expect(result.limit).toBe(10)
        expect(result.items[0].title).toBe("Notification 1")
    })


    it("should search for notifications", async () => {

        await testSetup.dropCollection('Notification')

        const notificationData: INotificationBase[] = [
            {
                title: "SearchNotification1",
                message: "Message 1",
                type: "info",
                status: "unread",
                user: testSetup.rootUser._id
            },
            {
                title: "SearchNotification2",
                message: "Message 2",
                type: "warning",
                status: "unread",
                user: testSetup.rootUser._id
            },
            {
                title: "OtherNotification",
                message: "Message 3",
                type: "warning",
                status: "unread",
                user: testSetup.rootUser._id
            }
        ]

        for (const data of notificationData) {
            await notificationService.create(data)
        }

        const searchResult = await notificationService.search("Search")

        expect(searchResult.length).toBe(2)
        expect(searchResult.some(n => n.title === "SearchNotification1")).toBe(true)
        expect(searchResult.some(n => n.title === "SearchNotification2")).toBe(true)
        expect(searchResult.some(n => n.title === "OtherNotification")).toBe(false)
    })


    it("should find notifications with filters", async () => {

        await testSetup.dropCollection('Notification')

        const notificationData: INotificationBase[] = [
            {
                title: "FilterNotificationA",
                message: "Message A",
                type: "info",
                status: "unread",
                user: testSetup.rootUser._id
            },
            {
                title: "FilterNotificationB",
                message: "Message B",
                type: "warning",
                status: "unread",
                user: testSetup.rootUser._id
            }
        ]

        for (const data of notificationData) {
            await notificationService.create(data)
        }

        const findByResult = await notificationService.find({
            filters: [
                { field: "type", operator: "eq", value: "warning" }
            ]
        })

        expect(Array.isArray(findByResult)).toBe(true)
        expect(findByResult.length).toBe(1)
        expect(findByResult[0].title).toBe("FilterNotificationB")
    })


    it("should handle error responses correctly when notification is not found", async () => {

        const nonExistentId = "123456789012345678901234"

        const resp = await notificationService.findById(nonExistentId)

        expect(resp).toBe(null)
    })

})
