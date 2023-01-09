<template>
    <div style="margin: 10px 15px 0 25px">
        <n-input v-model:value="search" round placeholder="search" />
    </div>
    <n-menu v-model:value="val" v-bind="$attrs" :options="menuOptions"></n-menu>
</template>
<script lang="ts" setup>
import { NMenu, MenuOption, NInput } from 'naive-ui'
import ProtoFun from '@/abis/Prototype'
import ProtoEvent from '@/abis/PrototypeEvent'
import { computed, ref, defineProps } from 'vue'
import { ABI } from '@/abi'

const props = defineProps<{
    abi: (ABI.FunctionItem | ABI.EventItem)[]
}>()

const search = ref<string>('')
const val = ref<string | undefined | number>('')

const prototypeGroups = () => {
    const prList: MenuOption = {
        label: 'Prototype Read',
        key: 'pro-read',
        children: []
    }
    const pwList: MenuOption = {
        label: 'Prototype write',
        key: 'pro-write',
        children: []
    }
    const peList: MenuOption = {
        label: 'Prototype Event',
        key: 'pro-event',
        children: []
    }

    ProtoFun.filter((item) => {
        return item.name.includes(search.value)
    }).forEach(item => {
        const child = {
            key: item.name,
            abi: item,
            label: () => {
                return item.name
            }

        }
        if (item.constant) {
            prList.children?.push({ ...child, type: 'read' })
        } else {
            pwList.children?.push({ ...child, type: 'write' })
        }
    })

    ProtoEvent.filter((item) => {
        return item.name.includes(search.value)
    }).forEach(item => {
        peList.children?.push({
            key: item.name,
            abi: item,
            type: 'event',
            label: () => {
                return item.name
            }

        })
    })

    return [prList, pwList, peList]
}

const menuOptions = computed(() => {
    const read: MenuOption = {
        label: 'Read',
        key: 'read',
        children: []
    }

    const write: MenuOption = {
        label: 'Write',
        key: 'write',
        children: []
    }
    const event: MenuOption = {
        label: 'Event',
        key: 'event',
        children: []
    }
    const fbs: MenuOption = {
        label: 'Fallback',
        key: 'fallback',
        children: []
    }

    props.abi.forEach(item => {
        const child = {
            key: item.name,
            abi: item,
            label: () => {
                return item.name
            }
        }

        if (!item.name.includes(search.value)) {
            return
        }

        // read functions
        if (item.type === 'function'
            &&
            (item.constant === true || ['pure', 'view'].includes(item.stateMutability || ''))
        ) {
            read.children?.push({ ...child, type: 'read' })
        } else if (item.type === 'function'
            &&
            (item.constant === false || !['pure', 'view'].includes(item.stateMutability || ''))
        ) {
            write.children?.push({ ...child, type: 'write' })
        } else if (item.type === 'event') {
            event.children?.push({ ...child, type: 'event' })
        } else if (item.type === 'fallback') {
            fbs.children?.push({ ...child, type: 'fallback' })
        }
    })
    
    return [read, write, event, fbs].concat(prototypeGroups()).filter(item => {
        return item.children && (item.children.length > 0)
    }).map(item => {
        return {
            ...item,
            label: item.label + ` (${item.children?.length})`
        }
    })
})
</script>
