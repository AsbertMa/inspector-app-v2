<template>
    <n-card v-if="currentMethod" :bordered="false">
        <template #header>
            <n-space justify="space-between">
                <StateBar v-if="abi" v-model:config="config" @update:config="onAddressChange" :name="abi.name"
                    :type="currentMethod && currentMethod.type" :options="opts" />
                <n-button-group>
                    <template v-if="abi?.type === 'function'">
                        <n-button @click="onCall">Call</n-button>
                        <n-button v-if="(abi.constant === false ||
                        !['pure', 'view'].includes(abi.stateMutability))" @click="onExecute">Execute</n-button>
                    </template>
                    <n-button v-else @click="onQuery">Query</n-button>
                </n-button-group>
            </n-space>
        </template>
        <n-tabs>
            <n-tab-pane name="desc" tab="Description">
                <n-code :code="desc" />
            </n-tab-pane>
            <n-tab-pane name="input" tab="Inputs">
                <n-form ref="inputsForm" :model="formValue" label-width="auto" label-align="left"
                    label-placement="left">
                    <n-form-item label="Caller">
                        <n-input v-model:value="formValue.caller" placeholder="address"></n-input>
                    </n-form-item>
                    <n-form-item
                        :path="`params[${index}]`"
                        :rule="{
                            required: abi?.type !== 'event',
                            message: `${v.name} required`,
                            trigger: 'blur'
                        }"
                        v-for="(v, index) in abi.inputs" :key="v.name">
                        <template #label>
                            {{ v.name }}
                            <!-- <n-tag round :bordered="false" size="small" type="success">{{v.type}}</n-tag> -->
                        </template>
                        <n-radio-group v-model:value="formValue.params[index]" v-if="v.type === 'bool'">
                            <n-radio checked label="True" value="true"></n-radio>
                            <n-radio label="False" value="false"></n-radio>
                        </n-radio-group>
                        <n-input :placeholder="v.type" v-model:value="formValue.params[index]" v-else></n-input>
                    </n-form-item>
                </n-form>
            </n-tab-pane>
        </n-tabs>
    </n-card>
</template>
<script lang="ts" setup>
import { computed, inject, ref, Ref, defineProps, watch, defineEmits, reactive } from 'vue'
import { FormInst, NTabs, NTabPane, NCode, NForm, NFormItem, NInput, NRadio, MenuOption, NSpace, NCard, NButton, NButtonGroup, NRadioGroup } from 'naive-ui'
import { abi as ABI } from 'thor-devkit'
import StateBar from './StateBar.vue'
import { ProjectSetting, Node } from '@/svc/storage'

const props = defineProps<{ currentMethod?: MenuOption & { abi: ABI.Function.Definition | ABI.Event.Definition } }>()
const emits = defineEmits<{
    (e: 'call', address: string, node: Node, params?: any[], caller?: string): void
    (e: 'execute', address: string, node: Node, params?: any[]): void
    (e: 'query', address: string, node: Node, params?: any[]): void
}>()

const projectSettings = inject<Ref<{ setting: ProjectSetting, node: Node }[]>>('projectSettings')
const defaultSetting = projectSettings?.value[0] || null

const config = ref<number>()
const _node = ref<Node>()
const _address = ref<string>()

config.value = defaultSetting!.setting.id!
_node.value = defaultSetting?.node
_address.value = defaultSetting?.setting.address

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
    _node.value = pConfig.node
    _address.value = pConfig.setting.address
}

const abi = computed(() => {
    return props.currentMethod ? props.currentMethod.abi : null
})

const inputsForm = ref<FormInst | null>(null)
const formValue = reactive({
    caller: '',
    params: [null]
})

watch(() => abi.value, (v) => {
    if (v) {
        const temp = new Array(v.inputs.length)
        temp.fill(null)
        formValue.params = temp
    }
})
const onCall = () => {
    console.log('call')
    inputsForm.value?.validate((errors) => {
        console.log(errors, '9099099099990909090909090990')
        if (!errors) {
            emits('call', _address.value!, _node.value!, formValue.params, formValue.caller)
        }
    })
}
const onExecute = () => {
    inputsForm.value?.validate((errors) => {
        if (!errors) {
            emits('execute', _address.value!, _node.value!, formValue.params)
        }
    })
}
const onQuery = () => {
    emits('query', _address.value!, _node.value!, formValue.params)
}
const desc = computed(() => {
    return JSON.stringify(abi.value, null, '    ')
})
</script>