<template>
    <div style="max-width: 1200px; margin: auto">
        <n-card :bordered="false">
            <template #header>
                <div style="display: flex; align-items: center;">
                    <h4 style="margin: 0">Workspace</h4>
                    <n-button quaternary circle @click="showModal = true">
                        <template #icon>
                            <n-icon class="fa-solid fa-circle-plus" />
                        </template>
                    </n-button>
                </div>
            </template>
            <n-grid x-gap="12" :cols="4">
                <n-gi v-for="item in list" :key="item.id">
                    <n-card @click="router.push({
                        name: 'Project',
                        params: {
                            id: item.id,
                            tab: 'overview'
                        }
                    })" :title="item.name" class="project-card">
                        {{  item.description  }}
                        <template #footer>
                            <n-space justify="end">
                                <n-button text>
                                    <n-icon color="#9e9e9e" class="fa-regular fa-star" size="20" />
                                </n-button>
                                <n-button text>
                                    <n-icon color="#9e9e9e" class="fa-solid fa-ellipsis " size="20" />
                                </n-button>
                            </n-space>
                        </template>
                    </n-card>
                </n-gi>
            </n-grid>
        </n-card>
        <n-modal transform-origin="center" v-model:show="showModal">
            <add @finished="showModal = false" />
        </n-modal>
    </div>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { DBInstance } from '@/svc/inject'
import { Project } from '@/svc/storage'
import { useRouter } from 'vue-router'
import { NCard, NGrid, NGi, NButton, NIcon, NSpace, NModal } from 'naive-ui'
import Add from './Add.vue'

const _db = DBInstance()
const list = ref<Project[]>()
const router = useRouter()
const showModal = ref(false)

_db.subscribe('projects', () => {
    getProjects()
})

onBeforeMount(() => {
    getProjects()
})

async function getProjects() {
    list.value = await _db.getProjects()
}
</script>

<style>
.project-card {
    max-width: 300px;
}

.text-right {
    text-align: right;
}
</style>
