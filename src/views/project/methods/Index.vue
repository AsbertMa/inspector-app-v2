<template>
    <Container>
        <template #side>
            <AbiTree :abi="abis" @update-value="onAbiChange" />
        </template>
        <template #right-top>
            <abi-card :key="cardKey" @call="onCall" @execute="onExecute" @query="onQuery" :currentMethod="currentMethod" />
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

const update = (time: number, abi: ABI.Event.Definition | abi.Function.Definition,
    address: string,
    node: Node,
    params: any[],
    response?: any,
    caller?: string) => {
    if (abi.type === 'event') {
        const item: History<'event'> = {
            time,
            abi,
            type: (currentMethod.value as any).type,
            address,
            node,
            params,
            response: response as Connex.Thor.Filter.Row<'event', Connex.Thor.Account.WithDecoded>[] | { message: string, code: string | number }
        }
        list.value.push(item)
    } else {
        const item: History<'function'> = {
            time,
            type: (currentMethod.value as any).type,
            caller: caller,
            address,
            abi,
            node,
            params,
            response: response,
        }
        list.value.push(item)
    }

    if (list.value.length > 10) {
        list.value.shift()
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

const cardKey = computed(() => {
    return currentMethod.value?.label
})
const currentMethod = ref<MenuOption & { abi: ABI.Function.Definition | ABI.Event.Definition }>()

const onAbiChange = (key: string, item: MenuOption & { abi: ABI.Event.Definition | ABI.Function.Definition }) => {
    currentMethod.value = item
}

const fetchTx = async (txid: string, node: Node) => {
    const connex = getConnex(node)
    const ticker = connex.thor.ticker()
    const txVisitor = connex.thor.transaction(txid)
    let tx
    const blockCheckNum = 12
    let counter = 0
    let receipt
    for (; ;) {
        try {
            tx = await txVisitor.get()
            receipt = await txVisitor.getReceipt()
            if ((tx && receipt) || counter > blockCheckNum) {
                break
            }
        } catch (error) {
            break
        }
        counter ++
        await ticker.next()
    }

    return {tx, receipt}
}

const onExecute = async (address: string, node: Node, params: any[] = []) => {
    const connex = getConnex(node)
    const account = connex.thor.account(address)
    const abi = currentMethod.value?.abi
    const method = account.method(abi || {})
    const time = Date.now()
    let txResp
    const temp = params.map((item, index) => {
        return abi?.inputs[index].type.endsWith(']') ? JSON.parse(item) : item
    })
    try {
        txResp = await method.transact(...temp).request()
        update(time, abi!, address, node, temp, txResp, undefined)

    } catch (e) {
        console.error(e)
        update(time, abi!, address, node, temp, e as { code: number | string, message: string }, undefined)
    }

    try {
        const txid = txResp?.txid
        const {tx, receipt} = await fetchTx(txid!, node)
        const index = list.value.findIndex((item) => {
            return item.response && item.response.txid === txid
        });

        if (list.value[index] && list.value[index].response && list.value[index].response!.txid === txid ) {
            (list.value[index] as History<'function'>).tx = tx;
            (list.value[index] as History<'function'>).receipt = receipt
        }
    } catch (error) {
        console.log(error)
    }
}

const onCall = async (address: string, node: Node, params: any[] = [], caller?: string) => {
    const connex = getConnex(node)
    const account = connex.thor.account(address)
    const abi = currentMethod.value?.abi
    const method = account.method(abi || {})
    let resp
    const time = Date.now()
    const temp = params.map((item, index) => {
        return abi?.inputs[index].type.endsWith(']') ? JSON.parse(item) : item
    })
    try {
        if (caller) {
            resp = await method.caller(caller).call(...temp)
        } else {
            resp = await method.call(...temp)
        }
        update(time, abi!, address, node, temp, resp, caller)
    } catch (e) {
        console.error(e)
        update(time, abi!, address, node, temp, e as { code: number | string, message: string }, caller)
    }
}

const onQuery = async (address: string, node: Node, params: any[] = []) => {
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
