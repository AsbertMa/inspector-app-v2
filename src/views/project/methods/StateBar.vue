<template>
    <n-input-group>
        <n-input-group-label>
            <n-text style="text-transform: uppercase;" type="info">
                {{  props.type  }}
            </n-text>
        </n-input-group-label>
        <n-input-group-label>
            {{  opt?.item.node.network  }}
        </n-input-group-label>
        <n-select style="width: 250px" v-model:value="val" :render-tag="renderSelected" :render-label="renderLabel"
            :options="props.options" @update:value="onUpdate" />
        <n-input-group-label>
            <n-text style="text-transform: capitalize;">
                {{  props.name  }}
            </n-text>
        </n-input-group-label>
    </n-input-group>
</template>
<script lang="ts" setup>
import { defineProps, ref, defineEmits, h } from 'vue'
import { NInputGroup, NInputGroupLabel, NSelect, NText } from 'naive-ui'

const props = defineProps<{
    name: string,
    type: 'read' | 'write' | 'event' | 'fb',
    config: number,
    options: { label: string, value: number, item: any }[]
}>()

const emit = defineEmits<{
    (e: 'update:config', value: string, o: unknown): void
}>()

const val = ref(props.options[0].item.setting.id)
const opt = ref(props.options.find(item => item.value === val.value))

const renderSelected = (props: { option: any, handleClose: () => void }) => {
    return h('div', {
            style: 'text-align: center'
        },
        props.option.item.setting.name
    )
}

const renderLabel = (option: any) => {
    const item = option.item
    return h(
        'div',
        null,
        [
            h('div', null, [item.node.name]),
            h('small', null, [item.setting.address])
        ]
    )
}

const onUpdate = (v: string, b: any) => {
    opt.value = b as any
    emit('update:config', v, b.item)
}

</script>