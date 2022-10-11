<template>
  <n-menu :options="menuOptions" mode="horizontal" />
</template>
<script lang="ts" setup>
import { NMenu } from 'naive-ui'
import { h } from 'vue'
import { RouterLink } from 'vue-router'
import type { MenuOption } from 'naive-ui'

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