<template>
    <n-card title="new Workspace" style="max-width: 600px;">
        <n-form label-placement="left" label-align="left" label-width="auto" :model="formValues">
            <n-form-item label="Name">
                <n-input v-model:value="formValues.name"></n-input>
            </n-form-item>
            <n-form-item label="Network">
                <n-select v-model:value="formValues.nodeId" :options="nodeList"></n-select>
            </n-form-item>
            <n-form-item label="Address">
                <n-input v-model:value="formValues.address"></n-input>
            </n-form-item>
            <n-space justify="space-between">
                <n-button @click="emits('finished')">Cancel</n-button>
                <n-button @click="save" type="info">{{ btnText }}</n-button>
            </n-space>
        </n-form>
    </n-card>
</template>
<script lang="ts" setup>
import { Node } from '@/svc/storage'
import { inject, ref, Ref, computed, defineProps, defineEmits } from 'vue'
import { NInput, NSelect, NForm, NFormItem, NCard, NButton, NSpace } from 'naive-ui'
import { DBInstance } from '@/svc/inject'
import router from '@/router';

const nodes = inject<Ref<Node[]>>('nodes')
const formValues = ref({
    name: '',
    nodeId: null,
    address: ''
})
const _db = DBInstance()

const props = defineProps<{
    config?: {
        id: number,
        name: string,
        nodeId: number,
        address: string
    }
}>()
const emits = defineEmits(['finished'])

const nodeList = computed(() => {
    return nodes?.value.map(node => {
        return {
            label: node.name,
            value: node.id
        }
    })
})
const btnText = computed(() => {
    return props.config ? 'Edit' : 'Create'
})

if (props.config) {
    formValues.value = {
        name: props.config.name,
        nodeId: props.config.nodeId,
        address: props.config.address
    }
}

const save = async () => {
    const projectId = router.currentRoute.value.params.id
    try {
        if (props.config) {
            _db.projectSettings?.update(props.config.id, {
                name: formValues.value.name,
                nodeId: formValues.value.nodeId,
                address: formValues.value.address,
            })
        } else {
            _db.projectSettings?.add({
                name: formValues.value.name,
                nodeId: formValues.value.nodeId,
                address: formValues.value.address,
                projectId: parseInt(projectId as string)
            })
        }
    } catch (error) {
        console.error(error)
    } finally {
        emits('finished')
    }

}
</script>