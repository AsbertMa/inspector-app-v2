<template>
    <div>
        pppp
        <ol>
            <li v-for="i in list" :key="i.id" @click="router.push({name: 'Project', params: {
                id: i.id,
                tab: 'overview'
            }})">
                {{i.name}}
            </li>
        </ol>
    </div>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { DBInstance } from '@/svc/inject'
import { Project } from '@/svc/storage'
import { useRouter } from 'vue-router'

const _db = DBInstance()
const list = ref<Project[]>()
const router = useRouter()

onBeforeMount(async () => {
    list.value = await _db.getProjects()
    //  = JSON.parse(listStr)
})
</script>
