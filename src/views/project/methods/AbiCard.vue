<template>
    <n-tabs>
        <n-tab-pane name="desc" tab="Description">
            <n-code :code="desc" />
        </n-tab-pane>
        <n-tab-pane name="input" tab="Inputs">
            <n-form label-width="auto" label-align="left" label-placement="left">
                <n-form-item label="Caller">
                    <n-input></n-input>
                </n-form-item>
                <n-form-item v-for="(v, index) in item.inputs" :key="v.name">
                    <template #label>
                        {{v.name}}<n-tag round :bordered="false" size="small" type="success">{{v.type}}</n-tag>
                    </template>
                    <template v-if="v.type === 'bool'">
                        <n-radio checked label="True" value="true"></n-radio>
                        <n-radio label="False" value="false"></n-radio>
                    </template>
                    <n-input v-model:value="params[index]" v-else></n-input>
                </n-form-item>
            </n-form>
        </n-tab-pane>
    </n-tabs>
</template>
<script lang="ts" setup>
import { computed, defineProps, ref, watch } from 'vue'
import { NTabs, NTabPane, NCode, NForm, NFormItem, NInput, NRadio, NTag} from 'naive-ui'
import { ABI } from '@/abi'

const props = defineProps<{ item: ABI.FunctionItem | ABI.EventItem }>()
const params = ref(new Array(props.item.inputs.length))

watch(() => props.item, (v) => {
    params.value = new Array(v.inputs.length)
})

const desc = computed(() => {
    return JSON.stringify(props.item, null, '    ')
})
</script>