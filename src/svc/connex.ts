import Connex from '@vechain/connex'
import { Node } from './storage'

const connexList: Map<number, Connex> = new Map<number, Connex>()

export default function getConnex(node: Node) {
    let _connex = connexList.get(node.id!)
    if (_connex) {
        return _connex
    } else {
        _connex = new Connex({
            node: node.url,
            network: ['custom', 'solo'].includes(node.network)
                ? JSON.parse(node.block_zero!) as Connex.Thor.Block
                : node.network as 'main' | 'test'
        })
        connexList.set(node.id!, _connex)
        return _connex
    }
}
