<template>
    <n-card title="New Contract" style="max-width: 600px;">
        <n-form @submit="save" :rules="rules" ref="formRef" label-placement="left" label-align="left" label-width="auto"
            :model="formValues">
            <n-form-item label="Name" path="name">
                <n-input v-model:value="formValues.name"></n-input>
            </n-form-item>
            <n-form-item label="Network" path="nodeId">
                <n-select v-model:value="formValues.nodeId" :options="nodeList"></n-select>
            </n-form-item>
            <n-form-item label="Address" path="address">
                <n-input v-model:value="formValues.address"></n-input>
            </n-form-item>
            <n-space justify="space-between">
                <n-button @click="emits('finished')">Cancel</n-button>
                <n-button attr-type="submit" type="info">{{  btnText  }}</n-button>
            </n-space>
        </n-form>
    </n-card>
</template>
<script lang="ts" setup>
import { Node } from '@/svc/storage'
import { inject, ref, Ref, computed, defineProps, defineEmits } from 'vue'
import { NInput, NSelect, NForm, NFormItem, NCard, NButton, NSpace, FormInst } from 'naive-ui'
import { DBInstance } from '@/svc/inject'
import router from '@/router'

const formRef = ref<FormInst | null>(null)
const nodes = inject<Ref<Node[]>>('nodes')
const formValues = ref({
    name: '',
    nodeId: null,
    address: ''
})
const rules = ref({
    name: {
        required: true,
        message: 'required'
    },
    nodeId: {
        required: true,
        message: 'required'
    },
    address: {
        required: true,
        message: 'required'
    }
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
    formRef.value?.validate((e) => {
        if (!e) {
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
    })
}
</script>