<template>
  <n-menu :options="menuOptions" mode="horizontal" :value="m" :on-update:value="onUpdate" />
</template>
<script lang="ts" setup>
import { NMenu } from 'naive-ui'
import { h, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import type { MenuOption } from 'naive-ui'

const m = ref<string>('')
const router = useRouter()
router.isReady().then(() => {
    if (router.currentRoute.value.path.toLowerCase().includes('workspace')) {
        m.value = 'workspace'
    } else if (router.currentRoute.value.path.toLowerCase().includes('deploy')) {
        m.value = 'deploy'
    } else if (router.currentRoute.value.path.toLowerCase().includes('explorer')) {
        m.value = 'explorer'
    } else {
        router.push({name: 'Workspace'})
    }
})

const onUpdate = (key: string) => {
    m.value = key
}
const menuOptions: MenuOption[] = [
  {
    key: 'workspace',
    label: () => {
      return h(
        RouterLink,
        {
          to: {
            name: 'Workspace'
          }
        },
        { default: () => 'Workspace' }
      )
    }
  },
  {
    key: 'deploy',
    label: () => {
      return h(
        RouterLink,
        {
          to: {
            name: 'Deploy'
          }
        },
        { default: () => 'Deploy' }
      )
    }
  },
  {
    key: 'explorer',
    label: () => {
      return h(
        RouterLink,
        {
          to: {
            name: 'Explorer'
          }
        },
        { default: () => 'Explorer' }
      )
    }
  }
]
</script>