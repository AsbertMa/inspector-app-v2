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
        <n-tabs :value="tab" :on-update:value="(value: string) => tab = value">
            <n-tab-pane name="desc" tab="Description">
                <n-code style="font-size: 12px" show-line-numbers :code="desc" />
            </n-tab-pane>
            <n-tab-pane name="input" tab="Inputs">
                <n-form ref="inputsForm" :model="formValue" label-width="auto" label-align="left"
                    label-placement="left">
                    <n-form-item :rule="rules.address" path="caller" v-if="abi?.type !== 'event'" label="Caller">
                        <n-input v-model:value="formValue.caller" placeholder="address"></n-input>
                    </n-form-item>
                    <n-form-item
                        :path="`params[${index}]`"
                        :rule="{
                            required: abi?.type !== 'event',
                            message: `${v.name} required`,
                            trigger: 'blur'
                        }"
                        v-for="(v, index) in abi?.inputs" :key="v.name">
                        <template #label>
                            {{ v.name }}
                        </template>
                        <n-radio-group v-model:value="formValue.params[index]" v-if="v.type === 'bool'">
                            <n-radio checked label="True" value="true"></n-radio>
                            <n-radio label="False" value="false"></n-radio>
                        </n-radio-group>
                        <n-input :placeholder="v.type" v-model:value="formValue.params[index]" v-else></n-input>
                    </n-form-item>
                    <template v-if="(abi?.type === 'function' && (abi?.constant === false || !['pure', 'view'].includes(abi?.stateMutability)))">
                        <n-form-item :rule="rules.address" path="excParams.signer" label="Signer">
                            <n-input :v-model:value="formValue.excParams.signer" placeholder="Signer Address"></n-input>
                        </n-form-item>
                        <n-form-item label="Comment">
                            <n-input placeholder="Tx comment"></n-input>
                        </n-form-item>
                    </template>
                    <template v-if="abi?.type === 'event'">
                        <n-form-item :rule="rules.eventParams.order" path="eventParams.order" label="Order">
                            <n-input v-model:value="formValue.eventParams.order" placeholder="Order"></n-input>
                        </n-form-item>
                        <n-form-item :rule="rules.eventParams.unit" path="eventParams.unit" label="Unit">
                            <n-input v-model:value="formValue.eventParams.unit" placeholder="Unit"></n-input>
                        </n-form-item>
                        <n-form-item :rule="rules.eventParams.number" path="eventParams.from" label="From">
                            <n-input v-model:value="formValue.eventParams.from" placeholder="From"></n-input>
                        </n-form-item>
                        <n-form-item :rule="rules.eventParams.number" path="eventParams.to" label="To">
                            <n-input v-model:value="formValue.eventParams.to" placeholder="To"></n-input>
                        </n-form-item>
                    </template>
                </n-form>
            </n-tab-pane>
        </n-tabs>
    </n-card>
</template>
<script lang="ts" setup>
import { computed, inject, ref, Ref, defineProps, onMounted, defineEmits, reactive } from 'vue'
import { FormInst, MenuOption, FormItemRule } from 'naive-ui'
import { address } from 'thor-devkit'
import { abi as ABI } from 'thor-devkit'
import StateBar from './StateBar.vue'
import { ProjectSetting, Node } from '@/svc/storage'

const tab = ref('input')
const props = defineProps<{ currentMethod?: MenuOption & { abi: ABI.Function.Definition | ABI.Event.Definition } }>()
const emits = defineEmits<{
    (e: 'call', _settings: ProjectSetting, node: Node, params?: any[], caller?: string): void
    (e: 'execute', _settings: ProjectSetting, node: Node, params?: any[]): void
    (e: 'query', _settings: ProjectSetting, node: Node, params?: any[]): void
}>()

const projectSettings = inject<Ref<{ setting: ProjectSetting, node: Node }[]>>('projectSettings')
const defaultSetting = projectSettings?.value[0] || null

const config = ref<number>()
const _node = ref<Node>()
const _settings = ref<ProjectSetting>()

config.value = defaultSetting!.setting.id!
_node.value = defaultSetting?.node
_settings.value = defaultSetting?.setting

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
    _settings.value = pConfig.setting
}

const abi = computed(() => {
    return props.currentMethod ? props.currentMethod.abi : null
})
const rules = {
    address: {
        validator(rule: FormItemRule, value: string) {
            if (!!value && !address.test(value)) {
                return new Error('invalid')
            }
            return true
        }
    },
    eventParams: {
        order: {
            validator(rule: FormItemRule, value: string) {
                console.log(value, '909')
                if (!!value && !['asc', 'desc'].includes(value)) {
                    return new Error('invalid')
                }
            }
        },
        unit: {
            validator(rule: FormItemRule, value: string) {
                if (!!value && !['block', 'time'].includes(value)) {
                    return new Error('invalid')
                }
            }
        },
        number: {
            validator(rule: FormItemRule, value: string) {
                if (!!value && !Number.isSafeInteger(value)) {
                    return new Error('invalid')
                }
            }
        }
    }
}
const inputsForm = ref<FormInst | null>(null)
const formValue = reactive<{
    caller: string,
    params: Array<null | string>,
    excParams: {
        signer: string,
        comment: string
    },
    eventParams: {
        order: 'desc' | 'asc',
        unit: 'block' | 'time',
        from: number,
        to: number
    }
}>({
    caller: '',
    params: [null],
    excParams: {
        signer: '',
        comment: ''
    },
    eventParams: {
        order: '' as unknown as 'desc',
        unit: '' as unknown as 'block',
        from: '' as unknown as number,
        to: '' as unknown as number
    }
})

onMounted(() => {
    const temp = new Array(props.currentMethod?.abi.inputs.length)
    temp.fill(null)
    formValue.params = temp
}, this)

const onCall = () => {
    inputsForm.value?.validate((errors) => {
        if (!errors) {
            emits('call', _settings.value!, _node.value!, formValue.params, formValue.caller)
        }
    })
}
const onExecute = () => {
    inputsForm.value?.validate((errors) => {
        if (!errors) {
            emits('execute', _settings.value!, _node.value!, formValue.params)
        }
    })
}
const onQuery = () => {
    inputsForm.value?.validate((errors) => {
        if (!errors) {
            emits('query', _settings.value!, _node.value!, formValue.params)
        }
    })
}

const desc = computed(() => {
    return JSON.stringify(abi.value, null, '    ')
})
</script>