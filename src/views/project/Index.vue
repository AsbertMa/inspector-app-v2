<template>
  <component :is="comp" />
</template>
<script lang="ts" setup>
import Config from './Config.vue'
import Overview from './Overview.vue'
import Methods from './methods/Index.vue'
import { useRouter } from 'vue-router'
import { computed } from '@vue/reactivity'

const router = useRouter()
const comp = computed(() => {
  const { tab } = router.currentRoute.value.params
  switch (tab) {
    case 'overview':
      return Overview
    case 'config':
      return Config
    case 'methods':
      return Methods
  }
})


</script>