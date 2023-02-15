<template>
    <n-input-group>
        <n-input-group-label>
            <n-text style="text-transform: uppercase;" type="info">
                {{  props.type  }}
            </n-text>
        </n-input-group-label>
        <n-select style="width: 250px" v-model:value="val" :render-tag="renderSelected" :render-label="renderLabel"
            :options="props.options" @update:value="onUpdate" />
        <n-input-group-label>
            <n-text>
                {{  props.name  }}
            </n-text>
        </n-input-group-label>
    </n-input-group>
</template>
<script lang="ts" setup>
import { NTag } from 'naive-ui'
import { defineProps, ref, defineEmits, h } from 'vue'
import { $addr } from '@/funcs'

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
    return h('div',
        null,
        [
            h(NTag, {
                type: 'info',
                round: true,
                size: 'small'
            },
                [
                    props.option.item.node.network
                ]),
            h(
                'span',
                {
                    style: {
                        'margin-left': '5px'
                    },
                },
                [props.option.item.setting.name]
            )
        ]
    )
}

const renderLabel = (option: any) => {
    const item = option.item
    return h(
        'div',
        {
            style: {
                display: 'flex',
                'align-items': 'center'
            }
        },
        [
            h(NTag, {
                type: 'info',
                round: true,
                size: 'small',
                style: {
                    'margin-right': '5px'
                }
            },
            [
                   item.node.network
            ]),
            h('div', {
                style: {
                display: 'flex',
                'flex-direction': 'column',
            }
            }, [
                h('span', null, [item.setting.name]),
                h('small', null, [$addr(item.setting.address)])
            ])
        ]
    )
}

const onUpdate = (v: string, b: any) => {
    opt.value = b as any
    emit('update:config', v, b.item)
}

</script>