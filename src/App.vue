<template>
  <n-layout content-style="display: flex; flex-direction: column;">
    <n-layout-header bordered>
      <Navbar/>
    </n-layout-header>
    <n-layout style="height: inherit" :has-sider="hasSider">
      <n-layout-sider v-if="hasSider" width="180px" bordered>
        <Tabs />
      </n-layout-sider>
      <n-layout-content bordered>
        <router-view></router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Tabs from '@/views/project/Tabs.vue'
import { useRouter } from 'vue-router'
import { watch, ref } from 'vue'

const hasSider = ref(true)
const router = useRouter()

watch(router.currentRoute, (o) => {
    hasSider.value = o.name === 'Project'
})

</script>

<style>
body,
#app {
  padding: 0;
  margin: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  flex: 1 1;
}
</style>
