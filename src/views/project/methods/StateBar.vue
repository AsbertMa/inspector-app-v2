<template>
    <n-input-group>
        <n-input-group-label>
            <n-text style="text-transform: uppercase;" type="info">
                {{  props.type  }}
            </n-text>
        </n-input-group-label>
        <n-popselect v-model:value="val" :options="props.options" @update:value="onUpdate">
            <n-button>{{ opt?.label || 'Select' }}</n-button>
        </n-popselect>
        <n-input-group-label>
            <n-text style="text-transform: capitalize;">
                {{  props.name  }}
            </n-text>
        </n-input-group-label>
    </n-input-group>
</template>
<script lang="ts" setup>
import { defineProps, ref, defineEmits } from 'vue'
import { NInputGroup, NInputGroupLabel, NPopselect, NButton, NText } from 'naive-ui'

const props = defineProps<{
    name: string,
    type: 'read' | 'write' | 'event' | 'fb',
    config: number,
    options: {label: string, value: number, address: string}[]
}>()

const emit = defineEmits<{
    (e: 'update:config', value: string, o: unknown): void
}>()

const val = ref(props.config)
const opt = ref(props.options.find(item => item.value === val.value))

const onUpdate = (v: string, b: unknown) => {
    opt.value = b as any
    emit('update:config', v, b)
}

</script>