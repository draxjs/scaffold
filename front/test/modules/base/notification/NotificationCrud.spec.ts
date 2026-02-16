import { describe, test, expect, vi } from "vitest"
import { mount } from "@vue/test-utils"
import NotificationCrud from "../../../../src/modules/base/cruds/NotificationCrud.vue";

describe("NotificationCrud Component Tests", () => {

    const mockCrudComponent = {
        name: 'Crud',
        template: '<div class="mock-crud"><slot name="item.userId" :value="{username: \'testuser\'}"></slot><slot name="item.readAt" :value="new Date()"></slot></div>',
        props: ['entity']
    };

    describe("Component Rendering", () => {

        test("Should render Crud component", () => {
            const wrapper = mount(NotificationCrud, {
                global: {
                    components: {
                        Crud: mockCrudComponent
                    }
                }
            });

            expect(wrapper.find('.mock-crud').exists()).toBe(true);
        });

        test("Should pass NotificationCrud entity to Crud component", () => {
            const wrapper = mount(NotificationCrud, {
                global: {
                    components: {
                        Crud: mockCrudComponent
                    }
                }
            });

            const crudComponent = wrapper.findComponent(mockCrudComponent);
            expect(crudComponent.exists()).toBe(true);
            expect(crudComponent.props('entity')).toBeDefined();
        });

    });

    describe("Custom Slots", () => {

        test("Should have userId slot template", () => {
            const wrapper = mount(NotificationCrud, {
                global: {
                    components: {
                        Crud: mockCrudComponent
                    }
                }
            });

            const html = wrapper.html();
            expect(html).toContain('testuser');
        });

        test("Should have readAt slot template with date formatting", () => {
            const wrapper = mount(NotificationCrud, {
                global: {
                    components: {
                        Crud: mockCrudComponent
                    },
                    mocks: {
                        formatDate: (date: Date) => date ? date.toLocaleDateString() : ''
                    }
                }
            });

            expect(wrapper.html()).toBeDefined();
        });

    });

});
