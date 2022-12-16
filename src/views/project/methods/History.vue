<template>
    <n-card :bordered="false">
        <template #header>
            <n-space align="center">
                <n-button type="tertiary" size="small" circle>
                    <template #icon>
                        <n-icon class="fa-solid fa-chevron-left" />
                    </template>
                </n-button>
                <n-button type="tertiary" size="small" circle>
                    <template #icon>
                        <n-icon class="fa-solid fa-chevron-right" />
                    </template>
                </n-button>
                <n-button type="tertiary" size="small" circle>
                    <template #icon>
                        <n-icon class="fa-solid fa-clock-rotate-left" />
                    </template>
                </n-button>
                <n-input-group v-if="current">
                    <n-input-group-label>
                        <n-text style="text-transform: uppercase;" type="info">
                            {{type}}
                        </n-text>
                    </n-input-group-label>
                    <n-input-group-label>
                        {{baseInfo.network}}
                    </n-input-group-label>
                    <n-input-group-label>
                        {{baseInfo.abi!.name}}
                    </n-input-group-label>
                </n-input-group>
            </n-space>
        </template>
        <n-tabs v-if="current" size="small" type="line" animated>
            <n-tab-pane name="info" tab="Info">
                <n-table size="small" :bordered="false">
                    <tbody>
                        <tr>
                            <td>Date:</td>
                            <td>{{baseInfo.time}}</td>
                        </tr>
                        <tr>
                            <td>Network:</td>
                            <td>{{baseInfo.network}}</td>
                        </tr>
                        <tr>
                            <td>Node Url:</td>
                            <td>{{baseInfo.url}}</td>
                        </tr>
                        <tr>
                            <td>Contract Address:</td>
                            <td>{{baseInfo.addr}}</td>
                        </tr>
                        <tr>
                            <td>Mehtod / Event:</td>
                            <td>{{baseInfo.abi.name}}</td>
                        </tr>
                        <tr>
                            <td>Caller / Origin:</td>
                            <td>{{baseInfo.caller}}</td>
                        </tr>
                    </tbody>
                </n-table>
            </n-tab-pane>
            <n-tab-pane name="request" tab="Request">
                <n-text code style="width: 100%;white-space: break-spaces; word-break: break-all;">
                    {{current.params}}
                </n-text>
            </n-tab-pane>
            <n-tab-pane name="response" tab="Response">
                <n-text code style="width: 100%;white-space: break-spaces; word-break: break-all;">
                    {{current.response}}
                </n-text>
            </n-tab-pane>
        </n-tabs>
    </n-card>
</template>
<script lang="ts" setup>
import { defineProps, computed } from 'vue'
import { NCard, NSpace, NButton, NInputGroup, NIcon, NInputGroupLabel, NText, NTable, NTabs, NTabPane } from 'naive-ui'
import History from '@/svc/HistoryHelper'

const props = defineProps<{
    list: History<'event' | 'function'>[]
}>()

const current = computed(() => {
    return props.list[props.list.length - 1]
})

const type = computed(() => {
    const abi = current.value.abi
    let result
    if (abi.type === 'function') {
        if (abi.constant === true || ['pure', 'view'].includes(abi.stateMutability || '')) {
            result = 'read'
        } else {
            result = 'write'
        }
    } else if (abi.type === 'event') {
        result = 'event'
    } else if (abi.type === 'fallback') {
        result = 'fallback'
    }
    return result
})

const baseInfo = computed(() => {
    if (current.value) {
        return {
            time: new Date(current.value.time).toLocaleString(),
            abi: current.value.abi,
            network: current.value.node.network,
            url: current.value.node.url,
            addr: current.value.address,
            caller: current.value.caller
        }
    } else {
        return {}
    }
})
</script>