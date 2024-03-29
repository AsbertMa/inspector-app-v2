<template>
    <n-card title="New Workspace" style="max-width: 600px;">
        <n-form ref="formRef" :model="formValues" :rules="formRules" @submit="save">
            <n-form-item label="Name" path="name">
                <n-input v-model:value="formValues.name" placeholder="Workspace Name"></n-input>
            </n-form-item>
            <n-form-item label="Description" path="description">
                <n-input v-model:value="formValues.description" placeholder="ABI collection"></n-input>
            </n-form-item>
            <n-form-item label="ABI" path="abi">
                <n-input v-model:value="formValues.abi" placeholder='Enter your ABI json [{"input" : [], "name" : "functionName", type
"function" }]' type="textarea"></n-input>
            </n-form-item>
            <n-form-item label="Network" path="node">
                <n-select v-model:value="formValues.node" :options="nodeList"></n-select>
            </n-form-item>
            <n-form-item label="Address" path="address">
                <n-input v-model:value="formValues.address" placeholder='Contract address start with "Ox"'></n-input>
            </n-form-item>
            <n-space justify="end">
                <n-button @click="emits('finished')">Cancel</n-button>
                <n-button attr-type="submit" type="info">Create</n-button>
            </n-space>
        </n-form>
    </n-card>
</template>
<script lang="ts" setup>
import { DBInstance } from '@/svc/inject'
import { onBeforeMount, defineEmits, ref } from 'vue'
import { address } from 'thor-devkit'
import {SelectOption, FormInst, FormItemRule} from 'naive-ui'

const _db = DBInstance()
const nodeList = ref<SelectOption[]>()
onBeforeMount(async () => {
    const nodes = await _db.getNodes()

    nodeList.value = nodes?.map(node => {
        return {
            label: node.name,
            value: node.id
        }
    })
})

const emits = defineEmits(['finished'])
const formRef = ref<FormInst | null>(null)
const formValues = ref({
    name: '',
    description: '',
    abi: '',
    node: null,
    address: ''
})
const formRules = ref({
    name: {
        required: true,
        message: 'required'
    },
    description: {
        required: true,
        message: 'required'
    },
    abi: {
        required: true,
        message: 'required'
    },
    node: {
        required: true,
        message: 'required'
    },
    address: {
        required: true,
        validator(rule: FormItemRule, value: string) {
            if (!value) {
                return new Error('required')
            } else if (!address.test(value)) {
                return new Error('invalid')
            }
            return true
        }
    }
})

const save = async () => {
    formRef.value?.validate(async (e) => {
        if (!e) {
            try {
                const id = await _db.projects?.add({
                    name: formValues.value.name,
                    description: formValues.value.description,
                    abi: formValues.value.abi
                })

                await _db.projectSettings?.add({
                    projectId: id as number,
                    nodeId: formValues.value.node,
                    name: formValues.value.name,
                    address: formValues.value.address
                })
                emits('finished')
            } catch (error) {
                console.error(error)
            }
        }
    })
}
</script>
