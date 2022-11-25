<template>
    <n-card title="new Workspace" style="max-width: 600px;">
        <n-form :model="formValues" @submit="save">
            <n-form-item label="Name" path="name">
                <n-input v-model:value="formValues.name" placeholder="Workspace Name"></n-input>
            </n-form-item>
            <n-form-item label="Description" path="description">
                <n-input v-model:value="formValues.description" placeholder="ABI collection"></n-input>
            </n-form-item>
            <n-form-item label="ABI" path="abi">
                <n-input v-model:value="formValues.abi" placeholder='Enter your ABI json K*input" : [], "name" : "functionName", type
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
                <n-button @click="save" type="info">Create</n-button>
            </n-space>
        </n-form>
    </n-card>
</template>
<script lang="ts" setup>
import { NForm, NFormItem, NInput, NSelect, NCard, NButton, NSpace, SelectOption} from 'naive-ui'
import { DBInstance } from '@/svc/inject'
import { onBeforeMount, defineEmits, ref } from 'vue'

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

const formValues = ref({
    name: '',
    description: '',
    abi: '',
    node: 0,
    address: ''
})

const save = async () => {
    try {
        await _db.projects?.add({
            name: formValues.value.name,
            description: formValues.value.description,
            abi: formValues.value.abi
        })

        await _db.projectSettings?.add({
            projectId: 1,
            nodeId: formValues.value.node,
            name: formValues.value.name,
            address: formValues.value.address
        })
        emits('finished')
    } catch (error) {
        console.log(error)
    }
}
</script>
