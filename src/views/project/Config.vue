<template>
    Config
    {{settings}}
</template>
<script lang="ts" setup>
import { ProjectSetting } from '@/svc/storage'
import { DBInstance } from '@/svc/inject'
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

const settings = ref<ProjectSetting>()
const _db = DBInstance()
const router = useRouter()
onBeforeMount(async () => {
    const { id } = router.currentRoute.value.params
    await _db.projectSettings?.get({id: id}).then(console.log)
})
</script>