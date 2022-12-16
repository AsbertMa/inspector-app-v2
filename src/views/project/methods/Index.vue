<template>
    <Container>
        <template #side>
            <AbiTree :abi="abis" @update-value="onAbiChange" />
        </template>
        <template #right-top>
            <abi-card @call="onCall" @execute="onExecute" @query="onQuery" :currentMethod="currentMethod" />
        </template>
        <template #right-bottom>
            <HistoryView :list="list" />
        </template>
    </Container>
</template>
<script lang="ts" setup>
import { ref, inject, computed, Ref } from 'vue'
import Container from '@/components/Container.vue'
import getConnex from '@/svc/connex'
import { Connex } from "@vechain/connex"
import AbiTree from './AbiTree.vue'
import AbiCard from './AbiCard.vue'
import { MenuOption } from 'naive-ui'
import { abi, abi as ABI } from 'thor-devkit'
import HistoryView from './History.vue'
import { Project, Node } from '@/svc/storage'
import History from '@/svc/HistoryHelper'

const list = ref<History<'event' | 'function'>[]>([])

const update = (time:number, abi: ABI.Event.Definition | abi.Function.Definition,
    address: string,
    node: Node,
    params: any [],
    response?: Connex.Thor.Filter.Row<'event', Connex.Thor.Account.WithDecoded>[] | Connex.VM.Output & Connex.Thor.Account.WithDecoded | {message: string, code: string | number},
    caller?: string,
    txResp?: Connex.Vendor.TxResponse) => {
    if (abi.type ==='event') {
        const item: History<'event'> = {
            time,
            abi,
            address,
            node,
            params,
            response: response as Connex.Thor.Filter.Row<'event', Connex.Thor.Account.WithDecoded>[] | {message: string, code: string | number}
        }
        list.value.push(item)
    } else {
        const item: History<'function'> = {
            time,
            caller: caller,
            address,
            abi,
            node,
            params,
            response: response as Connex.VM.Output & Connex.Thor.Account.WithDecoded | {message: string, code: string | number},
            txResp
        }
        list.value.push(item)
    }
}

const project = inject<Ref<Project>>('project')
const abis = computed(() => {
    if (project && project.value) {
        return JSON.parse(project.value.abi)
    } else {
        return []
    }
})
const currentMethod = ref<MenuOption & { abi: ABI.Function.Definition | ABI.Event.Definition }>()

const onAbiChange = (key: string, item: MenuOption & { abi: ABI.Event.Definition | ABI.Function.Definition }) => {
    currentMethod.value = item
}

const onExecute = async (address: string, node: Node, params: any[] = []) => {
    const connex = getConnex(node)
    const account = connex.thor.account(address)
    const abi = currentMethod.value?.abi
    const method = account.method(abi || {})
    const time = Date.now()
    let resp
    try {
        resp = await method.transact(params).request()
        update(time, abi!, address, node, params, undefined, undefined, resp)
    } catch (e) {
        update(time, abi!, address, node, params, e as {code: number | string, message: string}, undefined, resp)
    }

    
}

const onCall = async (address: string, node: Node, params: any[] = [], caller?: string) => {
    const connex = getConnex(node)
    const account = connex.thor.account(address)
    const abi = currentMethod.value?.abi
    const method = account.method(abi || {})
    let resp
    const time = Date.now()
    try {
        if (caller) {
            resp = await method.caller(caller).call(...params)
        } else {
            resp = await method.call(...params)
        }
        update(time, abi!, address, node, params, resp, caller)
    } catch (e) {
        console.error(e)
        update(time, abi!, address, node, params, e as {code: number | string, message: string}, caller)
    }
}

const onQuery = async (address: string, node: Node, params: any[] = []) => {
    console.log(address, node, params)
    const connex = getConnex(node)
    const account = connex.thor.account(address)
    const abi = currentMethod.value?.abi
    const filters: any[] = []
    const time = Date.now()
    abi?.inputs.forEach((v, i) => {
        if (params[i]) {
            filters.push({
                [v.name]: params[i]
            })
        }
    })
    const event = account.event(abi || {})
    const resp = await event.filter(filters).order('desc').apply(0, 5)

    update(time, abi!, address, node, params, resp)
}
</script>
