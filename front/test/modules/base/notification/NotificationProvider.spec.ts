import { describe, test, expect, vi, beforeEach } from "vitest"
import { mount } from "@vue/test-utils"
import NotificationProvider from "../../../../src/modules/base/providers/NotificationProvider";
import type { INotification, INotificationBase } from "../../../../src/modules/base/interfaces/INotification";

describe("NotificationProvider Tests", () => {

    let provider: NotificationProvider;

    beforeEach(() => {
        provider = NotificationProvider.instance;
        vi.clearAllMocks();
    });

    describe("Provider Instance", () => {

        test("Should return singleton instance", () => {
            const instance1 = NotificationProvider.instance;
            const instance2 = NotificationProvider.instance;

            expect(instance1).toBe(instance2);
        });

        test("Should have correct API endpoint", () => {
            expect(provider['baseUrl']).toBe('/api/notifications');
        });

    });

    describe("CRUD Operations", () => {

        test("Should create notification", async () => {
            const mockCreate = vi.spyOn(provider, 'create');
            const notificationData: INotificationBase = {
                title: "Test Notification",
                message: "Test message",
                type: "info",
                status: "unread",
                userId: "user123"
            };

            mockCreate.mockResolvedValue({
                _id: "notification123",
                ...notificationData,
                createdAt: new Date(),
                updatedAt: new Date()
            } as INotification);

            const result = await provider.create(notificationData);

            expect(mockCreate).toHaveBeenCalledWith(notificationData);
            expect(result._id).toBe("notification123");
            expect(result.title).toBe(notificationData.title);
        });

        test("Should fetch notification by ID", async () => {
            const mockFindById = vi.spyOn(provider, 'findById');
            const mockNotification: INotification = {
                _id: "notification123",
                title: "Test Notification",
                message: "Test message",
                type: "success",
                status: "read",
                userId: "user123",
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockFindById.mockResolvedValue(mockNotification);

            const result = await provider.findById("notification123");

            expect(mockFindById).toHaveBeenCalledWith("notification123");
            expect(result).toEqual(mockNotification);
        });

        test("Should update notification", async () => {
            const mockUpdate = vi.spyOn(provider, 'update');
            const updateData = {
                status: "read" as const,
                readAt: new Date()
            };

            mockUpdate.mockResolvedValue({
                _id: "notification123",
                title: "Test Notification",
                message: "Test message",
                type: "info",
                ...updateData,
                userId: "user123",
                createdAt: new Date(),
                updatedAt: new Date()
            } as INotification);

            const result = await provider.update("notification123", updateData);

            expect(mockUpdate).toHaveBeenCalledWith("notification123", updateData);
            expect(result.status).toBe("read");
        });

        test("Should delete notification", async () => {
            const mockDelete = vi.spyOn(provider, 'delete');
            mockDelete.mockResolvedValue(undefined);

            await provider.delete("notification123");

            expect(mockDelete).toHaveBeenCalledWith("notification123");
        });

    });

    describe("Pagination and Filtering", () => {

        test("Should fetch paginated notifications", async () => {
            const mockFindPaginated = vi.spyOn(provider, 'findPaginated');
            const mockResponse = {
                data: [
                    {
                        _id: "notification1",
                        title: "Notification 1",
                        message: "Message 1",
                        type: "info" as const,
                        status: "unread" as const,
                        userId: "user123",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ],
                total: 1,
                page: 1,
                limit: 10
            };

            mockFindPaginated.mockResolvedValue(mockResponse);

            const result = await provider.findPaginated({}, 1, 10);

            expect(mockFindPaginated).toHaveBeenCalledWith({}, 1, 10);
            expect(result.data).toHaveLength(1);
            expect(result.total).toBe(1);
        });

        test("Should filter notifications by type", async () => {
            const mockFindPaginated = vi.spyOn(provider, 'findPaginated');
            const filter = { type: "error" };

            mockFindPaginated.mockResolvedValue({
                data: [],
                total: 0,
                page: 1,
                limit: 10
            });

            await provider.findPaginated(filter, 1, 10);

            expect(mockFindPaginated).toHaveBeenCalledWith(filter, 1, 10);
        });

        test("Should filter notifications by status", async () => {
            const mockFindPaginated = vi.spyOn(provider, 'findPaginated');
            const filter = { status: "unread" };

            mockFindPaginated.mockResolvedValue({
                data: [],
                total: 0,
                page: 1,
                limit: 10
            });

            await provider.findPaginated(filter, 1, 10);

            expect(mockFindPaginated).toHaveBeenCalledWith(filter, 1, 10);
        });

        test("Should search notifications", async () => {
            const mockFindPaginated = vi.spyOn(provider, 'findPaginated');
            const filter = { search: "important" };

            mockFindPaginated.mockResolvedValue({
                data: [],
                total: 0,
                page: 1,
                limit: 10
            });

            await provider.findPaginated(filter, 1, 10);

            expect(mockFindPaginated).toHaveBeenCalledWith(filter, 1, 10);
        });

    });

    describe("Enum Validation", () => {

        test("Should handle all notification types", () => {
            const types: Array<INotification['type']> = ['info', 'success', 'warning', 'error'];

            types.forEach(type => {
                expect(['info', 'success', 'warning', 'error']).toContain(type);
            });
        });

        test("Should handle all notification statuses", () => {
            const statuses: Array<INotification['status']> = ['unread', 'read'];

            statuses.forEach(status => {
                expect(['unread', 'read']).toContain(status);
            });
        });

    });

});
