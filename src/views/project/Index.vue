<template>
    <component :is="comp" v-if="loaded" />
</template>
<script lang="ts" setup>
import { onBeforeMount, ref, provide } from 'vue'
import Config from './Config.vue'
import Overview from './Overview.vue'
import { Project } from '@/svc/storage'
import { DBInstance } from '@/svc/inject'
import Methods from './methods/Index.vue'
import { useRouter } from 'vue-router'
import { computed } from '@vue/reactivity'

const router = useRouter()
const project = ref<Project>()
provide('project', project)

const loaded = ref(false)
const _db = DBInstance()

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

onBeforeMount(async () => {
    const { id } = router.currentRoute.value.params
    project.value = await _db.getProjectById(id as string)
    loaded.value = true
})

</script>
