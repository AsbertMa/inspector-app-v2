<template>
  <n-menu :options="options" :value="selected" :on-update:value="onUpdate" />
</template>
<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { NMenu } from 'naive-ui'
import { h } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const selected = ref<string>('')

const onUpdate = (key: string) => {
    selected.value = key
}
router.isReady().then(() => {
    selected.value = router.currentRoute.value.params.tab as string
})
const options = computed(() => {
  const id = router.currentRoute.value.params.id || 0
  return [{
    key: 'overview',
    label: () => {
      return h(
        RouterLink,
        {
          to: {
            name: 'Project',
            params: {
              id: id,
              tab: 'overview'
            }
          }
        },
        { default: () => 'Overview' }
      )
    }
  }, {
    key: 'methods',
    label: () => {
      return h(
        RouterLink,
        {
          to: {
            name: 'Project',
            params: {
              id: id,
              tab: 'methods'
            }
          }
        },
        {
          default: () => 'Methods'
        }
      )
    }
  }, {
    key: 'config',
    label: () => {
      return h(
        RouterLink,
        {
          to: {
            name: 'Project',
            params: {
              id: id,
              tab: 'config'
            }
          }
        },
        { default: () => 'Config' }
      )
    }
  }]
})

</script>