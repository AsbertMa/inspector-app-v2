<template>
    <n-form :model="project" v-if="project">
        <n-form-item label="Name">
            <n-input v-model:value="project.name"></n-input>
        </n-form-item>
        <n-form-item label="Description">
            <n-input v-model:value="project.description"></n-input>
        </n-form-item>
        <n-form-item label="ABI">
            <n-input type="textarea" v-model:value="project.abi"></n-input>
        </n-form-item>
    </n-form>
</template>
<script lang="ts" setup>
import { Project } from '@/svc/storage';
import { NForm, NFormItem, NInput } from 'naive-ui'
import { inject } from 'vue'

const project = inject<Project>('project')

</script>
