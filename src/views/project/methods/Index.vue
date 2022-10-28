<template>
    <Container>
        <template #side>
            <AbiTree :abi="abi" @update-value="onUpdate" />
        </template>
        <template #right-top>
            <n-card v-if="currentMethod" :bordered="false">
                <state-bar v-model:config="config" @update:config="onConfigUpdate" :name="currentMethod.abi.name"
                    :type="currentMethod && currentMethod.type" :options="opts" />
                <abi-card v-if="currentMethod" :item="currentMethod.abi" />
            </n-card>
        </template>
        <template #right-bottom>
            bottom
        </template>
    </Container>
</template>
<script lang="ts" setup>
import { ref, inject, computed, Ref } from 'vue'
import Container from '@/components/Container.vue'
import AbiTree from './AbiTree.vue'
import StateBar from './StateBar.vue'
import AbiCard from './AbiCard.vue'
import { MenuOption, NCard } from 'naive-ui'
import { ABI } from '@/abi'
import { Project } from '@/svc/storage'

const project = inject<Ref<Project>>('project')
const abi = computed(() => {
    if (project && project.value) {
        return JSON.parse(project.value.abi)
    } else {
        return []
    }
})
const currentMethod = ref<MenuOption & { abi: ABI.FunctionItem | ABI.EventItem }>()

const config = ref(3)
const onConfigUpdate = (v: any, o: any) => {
    console.log(v, o)
}
const onUpdate = (key: string, item: MenuOption & { abi: ABI.FunctionItem | ABI.EventItem }) => {
    currentMethod.value = item
}

const opts = [
    {
        label: 'Drive My Car',
        value: 1,
        address: '909090909'
    },
    {
        label: 'Norwegian Wood',
        value: 2,
        address: '9090909091svsdv'
    },
    {
        label: `You Won't See`,
        value: 3,
        address: '909090909gdsasgwar'
    },
    {
        label: 'Nowhere Man',
        value: 4,
        address: '909090909ponlknlkjn'
    },
    {
        label: 'Think For Yourself',
        value: 5,
        address: '90909090rqeqweqw9'
    }]
</script>
