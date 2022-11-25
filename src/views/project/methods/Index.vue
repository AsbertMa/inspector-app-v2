<template>
    <Container>
        <template #side>
            <AbiTree :abi="abi" @update-value="onAbiChange" />
        </template>
        <template #right-top>
            <n-card v-if="currentMethod" :bordered="false">
                <template #header>
                    <n-space justify="space-between">
                        <StateBar v-model:config="config" @update:config="onAddressChange" :name="currentMethod.abi.name"
                        :type="currentMethod && currentMethod.type" :options="opts" />
                        <n-button @click="onCall">Call</n-button>
                    </n-space>
                </template>
                <abi-card v-if="currentMethod" :item="currentMethod.abi" />
            </n-card>
        </template>
        <template #right-bottom>
            bottom
        </template>
    </Container>
</template>
<script lang="ts" setup>
import Connex from '@vechain/connex'
import { ref, inject, computed, Ref } from 'vue'
import Container from '@/components/Container.vue'
import getConnex from '@/svc/connex'
import AbiTree from './AbiTree.vue'
import StateBar from './StateBar.vue'
import AbiCard from './AbiCard.vue'
import { MenuOption, NCard, NButton, NSpace } from 'naive-ui'
import { ABI } from '@/abi'
import { Project, ProjectSetting, Node } from '@/svc/storage'

const project = inject<Ref<Project>>('project')
const projectSettings = inject<Ref<{ setting: ProjectSetting, node: Node }[]>>('projectSettings')

const abi = computed(() => {
    if (project && project.value) {
        return JSON.parse(project.value.abi)
    } else {
        return []
    }
})
const currentMethod = ref<MenuOption & { abi: ABI.FunctionItem | ABI.EventItem }>()

const defaultSetting = projectSettings?.value[0] || null

const config = ref<number>()
const connex = ref<Connex>()
const account = ref<Connex.Thor.Account.Visitor>()

config.value = defaultSetting!.setting.id!
connex.value = getConnex(defaultSetting!.node)
account.value = connex.value?.thor.account(defaultSetting!.setting.address)

const opts = computed(() => {
    return projectSettings?.value.map(p => {
        return {
            label: p.setting.name,
            value: p.setting.id,
            item: p
        }
    })
})

const onAddressChange = (v: any, pConfig: { setting: ProjectSetting, node: Node }) => {
    connex.value = getConnex(pConfig.node)
    account.value = connex.value?.thor.account(pConfig.setting.address)
}
const onAbiChange = (key: string, item: MenuOption & { abi: ABI.FunctionItem | ABI.EventItem }) => {
    currentMethod.value = item
}

const onCall = () => [
    account.value?.method(abi.value).asClause()
]
</script>
