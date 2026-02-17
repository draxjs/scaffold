
<script setup lang="ts">
import NotificationCrud from './NotificationCrud'
import {Crud} from "@drax/crud-vue";
import {formatDate} from "@drax/common-front"

</script>

<template>
  <crud :entity="NotificationCrud.instance">
    <template v-slot:item.user="{value}">{{value?.username}}</template>
    <template v-slot:item.readAt="{value}">{{formatDate(value)}}</template>
  </crud>
</template>

<style scoped>

</style>

