import DBInstance from './svc/storage'
import { keys } from './svc/inject'
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './registerServiceWorker'
import '@fortawesome/fontawesome-free/css/all.css'
import {
    create,
    NButton,
    NButtonGroup,
    NForm,
    NFormItem,
    NTabs,
    NTabPane,
    NCode,
    NCollapse,
    NCollapseItem,
    NMenu,
    NInput,
    NRadio, NSpace, NCard, NRadioGroup,
    NLayout, NLayoutHeader, NLayoutSider, NLayoutContent,
    NTable, NIcon, NModal,
    NSelect,
    NInputGroup, NInputGroupLabel, NText, NDropdown,
    NGrid, NGi, NDivider, NInputNumber,
} from 'naive-ui'
const naive = create({
    components: [
        NButton,
        NButtonGroup,
        NForm,
        NFormItem,
        NTabs,
        NTabPane,
        NCode,
        NCollapse,
        NDivider,
        NCollapseItem,
        NInputNumber,
        NMenu,
        NInput,
        NRadio, NSpace, NCard, NRadioGroup,
        NLayout, NLayoutHeader, NLayoutSider, NLayoutContent,
        NTable, NIcon, NModal,
        NSelect,
        NInputGroup, NInputGroupLabel, NText, NDropdown,
        NGrid, NGi
    ]
})

const Inspector = createApp(App)
Inspector.use(naive)
Inspector.provide(keys.Database, DBInstance)
Inspector.use(router).mount('#app')

const key = 'first-time-run'

const isFirstTimeRun = (() => {
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, 't')
        return true
    }
    return false
})()

if (isFirstTimeRun) {
    // name, network, url, block_zero
    DBInstance.nodes?.bulkAdd([{
        name: 'TestNet',
        network: 'test',
        url: 'https://sync-testnet.veblocks.net/',
        block_zero: `{"number":0,"id":"0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127","size":170,"parentID":"0xffffffff00000000000000000000000000000000000000000000000000000000","timestamp":1530014400,"gasLimit":10000000,"beneficiary":"0x0000000000000000000000000000000000000000","gasUsed":0,"totalScore":0,"txsRoot":"0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0","txsFeatures":0,"stateRoot":"0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb","receiptsRoot":"0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0","com":false,"signer":"0x0000000000000000000000000000000000000000","isTrunk":true,"isFinalized":true,"transactions":[]}`
    }, {
        name: 'MainNet',
        network: 'main',
        url: 'https://sync-mainnet.veblocks.net/',
        block_zero: `{"number":0,"id":"0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a","size":170,"parentID":"0xffffffff53616c757465202620526573706563742c20457468657265756d2100","timestamp":1530316800,"gasLimit":10000000,"beneficiary":"0x0000000000000000000000000000000000000000","gasUsed":0,"totalScore":0,"txsRoot":"0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0","txsFeatures":0,"stateRoot":"0x09bfdf9e24dd5cd5b63f3c1b5d58b97ff02ca0490214a021ed7d99b93867839c","receiptsRoot":"0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0","signer":"0x0000000000000000000000000000000000000000","isTrunk":true,"transactions":[]}`
    }])
}