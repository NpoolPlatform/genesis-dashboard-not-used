<template>
  <div class='row container'>
    <q-space />
    <Login />
    <q-space />
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Login = defineAsyncComponent(() => import('src/components/login/Login.vue'))

</script>

<style lang='sass' scoped>
.container
  margin-top: 200px
</style>
