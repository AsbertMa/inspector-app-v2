<template>
  <n-layout content-style="display: flex; flex-direction: column;">
    <n-layout-header bordered>
      <Navbar/>
    </n-layout-header>
    <n-layout style="height: inherit" has-sider>
      <n-layout-sider bordered>
        Handian Bridge
      </n-layout-sider>
      <n-layout-content bordered>
        <Container/>
      </n-layout-content>
    </n-layout>
  </n-layout>
  <!-- <Navbar />
  <div style="height: inherit">
    <div style="display: flex; flex-direction: row; height: 100%;">
      <div>side bar</div>
      <Container />
    </div>
  </div> -->
</template>
<script setup lang="ts">
import { NLayout, NLayoutHeader, NLayoutSider, NLayoutContent } from 'naive-ui'
import Container from './components/Container.vue'
import Navbar from './components/Navbar.vue'
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
