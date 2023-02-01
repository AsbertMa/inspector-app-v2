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
                <n-dropdown :render-label="renderLabel" :options="options" @select="onSelect">
                    <n-button type="tertiary" size="small" circle>
                        <template #icon>
                            <n-icon class="fa-solid fa-clock-rotate-left" />
                        </template>
                    </n-button>
                </n-dropdown>
                <n-input-group v-if="current">
                    <n-input-group-label>
                        <n-text style="text-transform: uppercase;" type="info">
                            {{ type }}
                        </n-text>
                    </n-input-group-label>
                    <n-input-group-label>
                        {{ baseInfo.network }}
                    </n-input-group-label>
                    <n-input-group-label>
                        {{ baseInfo.contractName }}
                    </n-input-group-label>
                    <n-input-group-label>
                        {{ baseInfo.abi!.name }}
                    </n-input-group-label>
                </n-input-group>
            </n-space>
        </template>
        <n-tabs :value="tab" :on-update:value="(key: string) => {tab = key}" v-if="current" size="small" type="line" animated>
            <n-tab-pane name="info" tab="Info">
                <n-table size="small" :bordered="false">
                    <tbody>
                        <tr>
                            <td>Date:</td>
                            <td>{{ baseInfo.time }}</td>
                        </tr>
                        <tr>
                            <td>Network:</td>
                            <td>{{ baseInfo.network }}</td>
                        </tr>
                        <tr>
                            <td>Node Url:</td>
                            <td>{{ baseInfo.url }}</td>
                        </tr>
                        <tr>
                            <td>Contract Address:</td>
                            <td>{{ baseInfo.addr }}</td>
                        </tr>
                        <tr>
                            <td>Mehtod / Event:</td>
                            <td>{{ baseInfo.abi.name }}</td>
                        </tr>
                        <tr>
                            <td>Caller / Origin:</td>
                            <td>{{ baseInfo.caller }}</td>
                        </tr>
                    </tbody>
                </n-table>
            </n-tab-pane>
            <n-tab-pane name="request" tab="Request">
                <n-text code style="width: 100%;white-space: break-spaces; word-break: break-all;">
                    {{ current.params }}
                </n-text>
            </n-tab-pane>
            <n-tab-pane name="response" tab="Response">
                <n-text code style="width: 100%;white-space: break-spaces; word-break: break-all;">
                    {{ current.response }}
                </n-text>
            </n-tab-pane>
            <n-tab-pane name="receipt" tab="Receipt" v-if="current.abi.type === 'function' && current.response && current.response.txid">
                <n-text code style="width: 100%;white-space: break-spaces; word-break: break-all;">
                    {{ current.receipt }}
                </n-text>
            </n-tab-pane>
            <n-tab-pane name="Tx" tab="Transaction" v-if="current.abi.type === 'function'  && current.response && current.response.txid">
                <n-text code style="width: 100%;white-space: break-spaces; word-break: break-all;">
                    {{ current.tx }}
                </n-text>
            </n-tab-pane>
        </n-tabs>
    </n-card>
</template>
<script lang="ts" setup>
import { defineProps, computed, ref, h, watch } from 'vue'
import {NInputGroupLabel, NText, DropdownOption, NInputGroup} from 'naive-ui'
import History from '@/svc/HistoryHelper'
const props = defineProps<{
    list: History<'event' | 'function'>[]
}>()

const selectIndex = ref<number>()
const tab = ref<string>('response')

const current = computed(() => {
    if (selectIndex.value === undefined) {
        return props.list[props.list.length - 1]
    } else {
        return props.list[selectIndex.value]
    }
})

watch(props.list, () => {
    selectIndex.value = undefined
    tab.value = 'response'
})


const options = computed(() => {
    return props.list.map(item => {
        return {
            key: item.time,
            history: item
        }
    }).reverse()
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

const renderLabel = (opt: DropdownOption) => {
    const item = (opt as DropdownOption & { history: History<'event' | 'function'>}).history
    return h(
        NInputGroup,
        null,
        [
            h(NInputGroupLabel,
            {
                size: 'small'
            }, [
                h(NText, {
                    type: 'info',
                    style: { textTransform: 'uppercase'}
                }, [item.type])
            ]),
            h(NInputGroupLabel, {
                size: 'small'
            }, [item.node.network]),
            h(NInputGroupLabel, {
                size: 'small'
            }, [item.settings.name]),
            h(NInputGroupLabel, {
                size: 'small'
            }, [item.abi.name])
        ]
    )
}

const onSelect = (k: string | number, opt: DropdownOption) => {
    const index = props.list.findIndex(item => {
        return item.time === k
    })
    selectIndex.value = index
}

const baseInfo = computed(() => {
    if (current.value) {
        return {
            time: new Date(current.value.time).toLocaleString(),
            abi: current.value.abi,
            network: current.value.node.network,
            contractName: current.value.settings.name,
            url: current.value.node.url,
            addr: current.value.settings.address,
            caller: current.value.caller
        }
    } else {
        return {}
    }
})
</script>