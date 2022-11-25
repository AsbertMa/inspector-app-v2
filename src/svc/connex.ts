import Connex from '@vechain/connex'
import { Node } from './storage'

const connexList: Map<number, Connex> = new Map<number, Connex>()

export default function getConnex (node: Node) {
    if (connexList.get(node.id!)){
        return connexList.get(node.id!)
    }

    const _connex = new Connex({
        node: node.url,
        network: node.network === 'custom' ? JSON.parse(node.block_zero!) as Connex.Thor.Block : node.network
    })

    connexList.set(node.id!, _connex)

    return _connex
}
