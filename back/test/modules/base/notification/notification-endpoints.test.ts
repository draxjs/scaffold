import {describe, it, beforeAll, afterAll, expect} from "vitest"
import NotificationRoutes from "../../../../src/modules/base/routes/NotificationRoutes";
import NotificationPermissions from "../../../../src/modules/base/permissions/NotificationPermissions";
import TestSetup from "../../../setup/TestSetup";
import type {INotificationBase} from "../../../../src/modules/base/interfaces/INotification";


describe("Notification Endpoints Test", function () {

    let testSetup = new TestSetup({
        routes: [NotificationRoutes],
        permissions: [NotificationPermissions]
    })

    beforeAll(async () => {
        await testSetup.setup()
    })

    afterAll(async () => {
        await testSetup.dropAndClose()
        return
    })

    it("should create a new notification and find by id", async () => {

        const {accessToken} = await testSetup.rootUserLogin()
        expect(accessToken).toBeTruthy()
        await testSetup.dropCollection('Notification')

        const newNotification: INotificationBase = {
            title: "Test Notification",
            message: "This is a test notification message",
            type: "info",
            status: "unread",
            metadata: {best: 'AI', worst: 'OU'},
            user: testSetup.rootUser._id
        }

        const resp = await testSetup.fastifyInstance.inject({
            method: 'POST',
            url: '/api/notifications',
            payload: newNotification,
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        const notification = await resp.json();
        expect(resp.statusCode).toBe(200);
        expect(notification.title).toBe("Test Notification");
        expect(notification.metadata.best).toBe("AI");
        expect(notification.metadata.worst).toBe("OU");
        expect(notification._id).toBeDefined();

        // Verify notification was created by fetching it
        const getResp = await testSetup.fastifyInstance.inject({
            method: 'GET',
            url: '/api/notifications/' + notification._id,
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        const getNotification = await getResp.json();
        expect(getResp.statusCode).toBe(200);
        expect(getNotification.title).toBe("Test Notification");
    })

    it("should create and update a notification and finally find by id", async () => {

        const {accessToken} = await testSetup.rootUserLogin()
        expect(accessToken).toBeTruthy()
        await testSetup.dropCollection('Notification')

        const newNotification: INotificationBase = {
            title: "Test Notification",
            message: "This is a test notification message",
            type: "info",
            status: "unread",
            user: testSetup.rootUser._id
        }

        const resp = await testSetup.fastifyInstance.inject({
            method: 'POST',
            url: '/api/notifications',
            payload: newNotification,
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        const notification = await resp.json();
        expect(resp.statusCode).toBe(200);
        expect(notification.title).toBe("Test Notification");
        expect(notification._id).toBeDefined();


        // Prepare update data
        const updateData: INotificationBase = {
            title: "Test Notification updated",
            message: "This is a test notification message updated",
            type: "info",
            status: "unread",
            user: testSetup.rootUser._id.toString()
        }

        console.log("updateData",updateData)

        // Send update request
        const updateResp = await testSetup.fastifyInstance.inject({
            method: 'PUT',
            url: `/api/notifications/${notification._id}`,
            payload: updateData,
            headers: {Authorization: `Bearer ${accessToken}`}
        })

        // Verify update response
        expect(updateResp.statusCode).toBe(200)
        const updatedNotification = await updateResp.json()
        expect(updatedNotification.title).toBe("Test Notification updated")

        // Verify the notification was actually updated by fetching it again
        const verifyResp = await testSetup.fastifyInstance.inject({
            method: 'GET',
            url: `/api/notifications/${updatedNotification._id}`,
            headers: {Authorization: `Bearer ${accessToken}`}
        })

        const verifiedNotification = await verifyResp.json()
        expect(verifyResp.statusCode).toBe(200)
        expect(verifiedNotification.title).toBe("Test Notification updated")
    })


    it("should create and update partial a notification and finally find by id", async () => {

        const {accessToken} = await testSetup.rootUserLogin()
        expect(accessToken).toBeTruthy()
        await testSetup.dropCollection('Notification')

        const newNotification: INotificationBase = {
            title: "Test Notification",
            message: "This is a test notification message",
            type: "info",
            status: "unread",
            user: testSetup.rootUser._id
        }

        const resp = await testSetup.fastifyInstance.inject({
            method: 'POST',
            url: '/api/notifications',
            payload: newNotification,
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        const notification = await resp.json();
        expect(resp.statusCode).toBe(200);
        expect(notification.title).toBe("Test Notification");
        expect(notification._id).toBeDefined();


        // Prepare update data
        const updateData: any = {
            title: "Test Notification updated",
        }

        console.log("updateData",updateData)

        // Send update request
        const updateResp = await testSetup.fastifyInstance.inject({
            method: 'PATCH',
            url: `/api/notifications/${notification._id}`,
            payload: updateData,
            headers: {Authorization: `Bearer ${accessToken}`}
        })

        // Verify update response
        expect(updateResp.statusCode).toBe(200)
        const updatedNotification = await updateResp.json()
        expect(updatedNotification.title).toBe("Test Notification updated")

        // Verify the notification was actually updated by fetching it again
        const verifyResp = await testSetup.fastifyInstance.inject({
            method: 'GET',
            url: `/api/notifications/${updatedNotification._id}`,
            headers: {Authorization: `Bearer ${accessToken}`}
        })

        const verifiedNotification = await verifyResp.json()
        expect(verifyResp.statusCode).toBe(200)
        expect(verifiedNotification.title).toBe("Test Notification updated")
    })

    it("should create and delete a notification", async () => {

        const {accessToken} = await testSetup.rootUserLogin()
        expect(accessToken).toBeTruthy()
        await testSetup.dropCollection('Notification')

        // First create a notification to be deleted
        const newNotification: INotificationBase = {
            title: "Test Notification",
            message: "This is a test notification message",
            type: "info",
            status: "unread",
            user: testSetup.rootUser._id
        }

        const createResp = await testSetup.fastifyInstance.inject({
            method: 'POST',
            url: '/api/notifications',
            payload: newNotification,
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        const createdNotification = await createResp.json();
        expect(createResp.statusCode).toBe(200);
        const notificationId = createdNotification._id;

        // Delete the notification
        const deleteResp = await testSetup.fastifyInstance.inject({
            method: 'DELETE',
            url: `/api/notifications/${notificationId}`,
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        // Verify delete response
        expect(deleteResp.statusCode).toBe(200);
        const deleteResult = await deleteResp.json();
        expect(deleteResult.deleted).toBe(true);

        // Verify the notification was actually deleted by trying to fetch it
        const verifyResp = await testSetup.fastifyInstance.inject({
            method: 'GET',
            url: `/api/notifications/${notificationId}`,
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        // Should return 404 or empty response
        expect(verifyResp.statusCode).toBe(404);
    })

    it("Should create and paginate notifications", async () => {

        const {accessToken} = await testSetup.rootUserLogin()
        expect(accessToken).toBeTruthy()

        await testSetup.dropCollection('Notification')

        // First, create a few notifications
        const notificationData = [
            {
                title: "Test Notification 1",
                message: "This is a test notification message",
                type: "info",
                status: "unread",
                user: testSetup.rootUser._id
            },
            {
                title: "Test Notification 2",
                message: "This is a test notification message 2",
                type: "warning",
                status: "unread",
                user: testSetup.rootUser._id
            },
        ];

        for (const data of notificationData) {
            await testSetup.fastifyInstance.inject({
                method: 'POST',
                url: '/api/notifications',
                payload: data,
                headers: {Authorization: `Bearer ${accessToken}`}
            });
        }

        const resp = await testSetup.fastifyInstance.inject({
            method: 'GET',
            url: '/api/notifications',
            headers: {Authorization: `Bearer ${accessToken}`}
        })

        const result = await resp.json()
        expect(resp.statusCode).toBe(200)
        expect(result.items.length).toBe(2)
        expect(result.total).toBe(2)
        expect(result.page).toBe(1)
        expect(result.limit).toBe(10)
        expect(result.items[0].title).toBe("Test Notification 1")
        expect(result.items[1].title).toBe("Test Notification 2")
    })


    it("should create and search for notifications ", async () => {
        const {accessToken} = await testSetup.rootUserLogin()
        expect(accessToken).toBeTruthy()
        await testSetup.dropCollection('Notification')

        // First, create a few notifications
        const notificationData = [
            {
                title: "Test Notification 1",
                message: "This is a test notification message",
                type: "info",
                status: "unread",
                user: testSetup.rootUser._id
            },
            {
                title: "Test Notification 2",
                message: "This is a test notification message 2",
                type: "warning",
                status: "unread",
                user: testSetup.rootUser._id
            },
            {
                title: "Other 3",
                message: "Other message 3",
                type: "warning",
                status: "unread",
                user: testSetup.rootUser._id
            },
        ];

        // Create the test notifications
        for (const data of notificationData) {
            await testSetup.fastifyInstance.inject({
                method: 'POST',
                url: '/api/notifications',
                payload: data,
                headers: {Authorization: `Bearer ${accessToken}`}
            });
        }

        // Test searching with a matching term
        const searchResp = await testSetup.fastifyInstance.inject({
            method: 'GET',
            url: '/api/notifications/search?search=Test',
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        const searchResult = await searchResp.json();

        expect(searchResp.statusCode).toBe(200);
        expect(searchResult.length).toBe(2); // Should find the two notifications with "Search" in their name
        expect(searchResult.some(notification => notification.title === "Test Notification 1")).toBe(true);
        expect(searchResult.some(notification => notification.title === "Test Notification 2")).toBe(true);

    })

    it("should create and find notifications with filters", async () => {
        const {accessToken} = await testSetup.rootUserLogin()
        expect(accessToken).toBeTruthy()
        await testSetup.dropCollection('Notification')

        // First, create a few notifications
        const notificationData = [
            {
                title: "Test Notification 1",
                message: "This is a test notification message",
                type: "info",
                status: "unread",
                user: testSetup.rootUser._id
            },
            {
                title: "Test Notification 2",
                message: "This is a test notification message 2",
                type: "warning",
                status: "unread",
                user: testSetup.rootUser._id
            },

        ];

        // Create the test notifications
        for (const data of notificationData) {
            await testSetup.fastifyInstance.inject({
                method: 'POST',
                url: '/api/notifications',
                payload: data,
                headers: {Authorization: `Bearer ${accessToken}`}
            });
        }

        // Test finding by description field with value "Special"
        const findByResp = await testSetup.fastifyInstance.inject({
            method: 'GET',
            url: '/api/notifications/find?filters=type;eq;warning',
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        const findByResult = await findByResp.json();
        expect(findByResp.statusCode).toBe(200);
        expect(Array.isArray(findByResult)).toBe(true);
        expect(findByResult.length).toBe(1); // Should find the notifications with "type" warning
        expect(findByResult.some(notification => notification.title === "Test Notification 2")).toBe(true);
    })

    it("should create and groupBy for notifications ", async () => {
        const {accessToken} = await testSetup.rootUserLogin()
        expect(accessToken).toBeTruthy()
        await testSetup.dropCollection('Notification')

        // First, create a few notifications
        const notificationData = [
            {
                title: "Test Notification 1",
                message: "This is a test notification message",
                type: "info",
                status: "unread",
                user: testSetup.rootUser._id
            },
            {
                title: "Test Notification 2",
                message: "This is a test notification message 2",
                type: "warning",
                status: "unread",
                user: testSetup.rootUser._id
            },
            {
                title: "Other 3",
                message: "Other message 3",
                type: "warning",
                status: "unread",
                user: testSetup.rootUser._id
            },
        ];

        // Create the test notifications
        for (const data of notificationData) {
            await testSetup.fastifyInstance.inject({
                method: 'POST',
                url: '/api/notifications',
                payload: data,
                headers: {Authorization: `Bearer ${accessToken}`}
            });
        }

        // Test searching with a matching term
        const groupResp = await testSetup.fastifyInstance.inject({
            method: 'GET',
            url: '/api/notifications/group-by?fields=type,status',
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        const groupResult = await groupResp.json();
        console.log(groupResult)
        expect(groupResp.statusCode).toBe(200);
        expect(groupResult[0].count).toBe(2);
        expect(groupResult[0].type).toBe('warning');
        expect(groupResult[0].status).toBe('unread');
        expect(groupResult[1].count).toBe(1);
        expect(groupResult[1].type).toBe('info');
        expect(groupResult[1].status).toBe('unread');
    })

    it("should handle error responses correctly when notification is not found", async () => {
        const {accessToken} = await testSetup.rootUserLogin()
        expect(accessToken).toBeTruthy()

        // Try to fetch a non-existent notification
        const nonExistentId = "123456789012345678901234"; // Valid MongoDB ObjectId that doesn't exist

        const resp = await testSetup.fastifyInstance.inject({
            method: 'GET',
            url: `/api/notifications/${nonExistentId}`,
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        // Verify response status code should be 404 Not Found
        expect(resp.statusCode).toBe(404);

        const result = await resp.json();
        expect(result.error).toBeDefined();
        expect(result.message).toContain("Not found");

    });


})
