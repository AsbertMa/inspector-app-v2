<template>
    <n-card :bordered="false">
        <template #header>
            <div style="display: flex; align-items: center;">
                <h4 style="margin: 0">Contract</h4>
                <n-button @click="changeConfig()" quaternary circle>
                    <template #icon>
                        <n-icon class="fa-solid fa-circle-plus" />
                    </template>
                </n-button>
            </div>
        </template>
        <n-table>
            <thead>
                <tr>
                    <th>
                        Alias
                    </th>
                    <th>
                        Network
                    </th>
                    <th>
                        Contract address
                    </th>
                    <th>
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in projectSettings" :key="item.setting.id">
                    <td>{{  item.setting.name  }}</td>
                    <td>{{  item.node.network  }}</td>
                    <td>{{  item.setting.address  }}</td>
                    <td>
                        <n-button @click="changeConfig(item.setting)">Edit</n-button>
                    </td>
                </tr>
            </tbody>
        </n-table>
        <n-modal transform-origin="center" v-model:show="showModal">
            <Edit @finished="showModal = false" :config="config" />
        </n-modal>
    </n-card>
</template>
<script lang="ts" setup>
import { NTable, NCard, NButton, NIcon, NModal } from 'naive-ui'
import { Node, ProjectSetting } from '@/svc/storage'
import { inject, Ref, ref } from 'vue'
import Edit from './EditConfig.vue'

type Config = {
    id: number,
    name: string,
    nodeId: number,
    address: string
} | undefined

const showModal = ref(false)
const config = ref<Config>()
const projectSettings = inject<Ref<{ setting: ProjectSetting, node: Node }[]>>('projectSettings')

const changeConfig = (c: ProjectSetting | undefined) => {
    if (c) {
        config.value = {
            id: c.id!,
            name: c.name,
            nodeId: c.nodeId,
            address: c.address
        }
    } else {
        config.value = undefined
    }
    showModal.value = true
}
</script>