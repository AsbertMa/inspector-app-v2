<template>
    <n-card :bordered="false">
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
    </n-card>
</template>
<script lang="ts" setup>
import { Project } from '@/svc/storage'
import { inject } from 'vue'

const project = inject<Project>('project')

</script>
