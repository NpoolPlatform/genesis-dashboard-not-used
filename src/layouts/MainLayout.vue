<template>
  <q-layout view='hHh Lpr lFf'>
    <MainHeader />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const MainHeader = defineAsyncComponent(() => import('src/components/header/MainHeader.vue'))

</script>
