<template>
    <component :is="comp" v-if="loaded" />
</template>
<script lang="ts" setup>
import { onBeforeMount, ref, provide, watch } from 'vue'
import Config from './Config.vue'
import Overview from './Overview.vue'
import { Node, Project, ProjectSetting } from '@/svc/storage'
import { DBInstance } from '@/svc/inject'
import Methods from './methods/Index.vue'
import { useRouter } from 'vue-router'
import { computed } from '@vue/reactivity'

const router = useRouter()

const project = ref<Project>()
const projectSettings = ref<{
    setting: ProjectSetting | undefined
    node: Node | undefined
}[]>()

const nodes = ref<Node[]>()

provide('project', project)
provide('projectSettings', projectSettings)
provide('nodes', nodes)

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

const updateData = async () => {
    const { id } = router.currentRoute.value.params
    project.value = await _db.getProjectById(id as string)
    const settings = await _db.getProjectConfig(id as string)
    const nodesL = await _db.getNodes()
    
    nodes.value = nodesL
    
    projectSettings.value = settings?.map((s) => {
        const node = nodesL?.find( n => n.id === s.nodeId)
        return {
            node,
            setting: s
        }
    })
}

watch(router.currentRoute.value.params, () => {
    updateData()
})

_db.subscribe('nodes', () => {
    updateData()
})
_db.subscribe('projectSettings', () => {
    updateData()
})

onBeforeMount(async () => {
    await updateData()
    loaded.value = true
})

</script>
