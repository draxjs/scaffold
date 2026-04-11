<script setup lang="ts">
import MenuCard from '../MenuCard/MenuCard.vue'
import {useMenu} from '../../composables/useMenu'
import {PropType, ref, onMounted, watch} from "vue";
import type {IMenuItem} from "@drax/common-share";

interface IMenuItemPro extends IMenuItem{
  description ?: string
}

const {isActive, isGranted, childrenGranted, hasChildrenGranted, itemText} = useMenu()

const props = defineProps({
  menu: {
    type: Array as PropType<IMenuItemPro[]>,
    required: true
  }
});

const expandedItems = ref<Record<string, boolean>>({});

onMounted(() => {
  const savedState = localStorage.getItem('drax-gallery-menu-state');
  if (savedState) {
    try {
      expandedItems.value = JSON.parse(savedState);
    } catch(e) {
      // do nothing
    }
  }

  // Default all parent sections to expanded if not saved
  props.menu.forEach(item => {
    if (expandedItems.value[item.text] === undefined) {
      expandedItems.value[item.text] = true;
    }
  });
});

watch(expandedItems, (newVal) => {
  localStorage.setItem('drax-gallery-menu-state', JSON.stringify(newVal));
}, { deep: true });

const toggleItem = (text: string) => {
  expandedItems.value[text] = !expandedItems.value[text];
};
</script>

<template>
  <v-container fluid class="pa-6 py-8">
    <v-row>
      <template v-for="(item) in menu" key="item.text">

        <v-col
          v-if="item.gallery && isGranted(item) && item.children && hasChildrenGranted(item.children)"
          cols="12"
          :key="item.text"
          :value="isActive(item)"
        >
          <v-card class="elevation-2 rounded-xl mb-6 bg-surface">
            <!-- Header Clickable / Toggle -->
            <v-card-item class="pa-6 pb-4 cursor-pointer" @click="toggleItem(item.text)" style="cursor: pointer;">
              <div class="d-flex align-center w-100">
                <v-avatar color="primary" variant="tonal" size="56" class="mr-5">
                  <v-icon :icon="item.icon" size="28"></v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <h2 class="text-h4 font-weight-bold mb-1 text-high-emphasis">
                    {{ itemText(item) }}
                  </h2>
                  <p v-if="item.description" class="text-body-1 text-medium-emphasis">
                    {{ item.description }}
                  </p>
                </div>
                <v-icon
                  :icon="expandedItems[item.text] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  size="32"
                  class="text-medium-emphasis ml-4"
                ></v-icon>
              </div>
            </v-card-item>

            <v-expand-transition>
              <div v-show="expandedItems[item.text]">
                <v-card-text class="px-6 pb-8 pt-4">
                  <v-row>
                    <v-col cols="12" sm="4" md="4" lg="3" xl="2"
                           v-for="child in childrenGranted(item.children)"
                           :key="child.text"
                    >
                      <menu-card
                        :title="itemText(child)"
                        :icon="child.icon"
                        :to="child.link"
                      ></menu-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>

        <v-col
          v-else-if="isGranted(item) && item.gallery && !item.children"
          cols="12" sm="4" md="4" lg="3" xl="2"
          :key="'e'+item.text"
        >
          <menu-card
            :title="itemText(item)"
            :icon="item.icon"
            :to="item.link"
          ></menu-card>
        </v-col>

      </template>
    </v-row>
  </v-container>
</template>


<style scoped>

</style>
