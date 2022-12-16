<template>
    <n-tabs size="small">
        <n-tab-pane name="json" tab="JSON">
            <n-text code style="width: 100%;white-space: break-spaces; word-break: break-all;">
                {{raw}}
            </n-text>
        </n-tab-pane>
        <n-tab-pane name="pretty" tab="Pretty">
            <n-table v-if="_abi.type !== 'event'" size="small" :bordered="false">
                <thead>
                    <th>Key</th>
                    <th>Type</th>
                    <th>Value</th>
                </thead>
                <tbody>
                    <tr v-for="item in decode" :key="item.name + item.type">
                        <td>{{item.name}}</td>
                        <td>{{item.type}}</td>
                        <td>{{item.value}}</td>
                    </tr>
                </tbody>
            </n-table>
            <template v-if="_abi.type === 'event'">
                <div v-for="(event, i) in decode" :key="i">
                    <n-table size="small" >
                        <thead>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Value</th>
                        </thead>
                        <tbody>
                            <tr v-for="(input, j) in _abi.inputs" :key="i + j">
                                <td>{{input.name}}</td>
                                <td>{{input.type}}</td>
                                <td>{{event.decoded[input.name]}}</td>
                            </tr>
                        </tbody>
                        <tr>
                                <!-- <th>Topic</th>
                                <td>
                                    {{event.topics}}
                                </td> -->
                            </tr>
                            <tr>
                                <!-- <th>Data</th>
                                <td>
                                    {{event.data}}
                                </td> -->
                            </tr>
                    </n-table>
                </div>
            </template>
        </n-tab-pane>
    </n-tabs>
</template>
<script lang="ts" setup>
import { ABI } from '@/abi'
import { NTabs, NTabPane, NTable, NText } from 'naive-ui'
import { defineProps, computed } from 'vue'
const props = defineProps<{ request?: any, response?: any, abi: ABI.FunctionItem | ABI.EventItem }>()

const _abi = computed(() => {
    return props.abi
})

const raw = computed(() => {
    return props.request || props.response
})

const decode = computed(() => {
    if (props.response) {
        if (props.abi.type === 'function') {
            return props.abi.outputs.map((v, i) => {
                return {
                    ...v,
                    value: props.response.decoded[i]
                }
            })
        }
        return props.response
    } else {
        return props.abi.inputs.map((v: any, i: number) => {
            return {
                ...v,
                value: props.request[i]
            }
        })
    }
})


</script>