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
import { Project, Node, ProjectSetting } from '@/svc/storage'
import History from '@/svc/HistoryHelper'

const list = ref<History<'event' | 'function'>[]>([])

type ExecParams = {
    signer: string
    comment: string
    gas: number
    dependsOn: string
    link: string
    delegateUrl: string
    delegater: string
}
type EventParams = {
    order: 'desc' | 'asc'
    unit: 'block' | 'time'
    from: number
    to: number
}
const update = (time: number,
    abi: ABI.Event.Definition | abi.Function.Definition,
    settings: ProjectSetting,
    node: Node,
    params: any[],
    options?: any,
    response?: any,
    caller?: string) => {
    if (abi.type === 'event') {
        const item: History<'event'> = {
            time,
            abi,
            settings,
            type: (currentMethod.value as any).type,
            node,
            params,
            options,
            response: response as Connex.Thor.Filter.Row<'event', Connex.Thor.Account.WithDecoded>[] | { message: string, code: string | number }
        }
        list.value.unshift(item)
    } else {
        const item: History<'function'> = {
            time,
            type: (currentMethod.value as any).type,
            caller: caller,
            settings,
            abi,
            node,
            params,
            options,
            response: response,
        }
        list.value.unshift(item)
    }

    if (list.value.length > 10) {
        list.value.pop()
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

const onExecute = async (settings: ProjectSetting, node: Node, params: any[] = [], opts: ExecParams) => {
    const connex = getConnex(node)
    const account = connex.thor.account(settings.address)
    const abi = currentMethod.value?.abi
    const method = account.method(abi || {})
    const time = Date.now()
    let txResp
    const temp = params.map((item, index) => {
        return abi?.inputs[index].type.endsWith(']') ? JSON.parse(item) : item
    })
    try {
        const txSvc = method.transact(...temp)
        console.log(opts)

        opts.gas && txSvc.gas(opts.gas)
        opts.link && txSvc.link(opts.link)
        opts.dependsOn && txSvc.dependsOn(opts.dependsOn)
        opts.signer && txSvc.signer(opts.signer)
        opts.delegateUrl && txSvc.delegate(opts.delegateUrl, opts.delegater)
        opts.comment && txSvc.comment(opts.comment)

        txResp = await txSvc.request()
        update(time, abi!, settings, node, temp, opts, txResp, undefined)

    } catch (e) {
        console.error(e)
        update(time, abi!, settings, node, temp, opts, e as { code: number | string, message: string }, undefined)
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

const onCall = async (settings: ProjectSetting, node: Node, params: any[] = [], caller?: string) => {
    const connex = getConnex(node)
    const account = connex.thor.account(settings.address)
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
        update(time, abi!, settings, node, temp, null, resp, caller)
    } catch (e) {
        console.error(e)
        update(time, abi!, settings, node, temp, null, e as { code: number | string, message: string }, caller)
    }
}

const onQuery = async (settings: ProjectSetting, node: Node, params: any[] = [], opts: EventParams) => {
    const connex = getConnex(node)
    const account = connex.thor.account(settings.address)
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
    const temp = event.filter(filters).order(opts.order || 'desc')
    if (opts.unit && opts.from && opts.to) {
        temp.range({
            unit: opts.unit,
            from: opts.from,
            to: opts.to,
        })
    }

    const resp = await temp.apply(0, 5)

    update(time, abi!, settings, node, params, opts, resp)
}
</script>
