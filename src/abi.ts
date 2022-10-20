export namespace ABI {
    export interface InputItem {
        name: string
        type: string
    }
    export interface EventInputItem {
        name: string
        type: string
        indexed?: boolean
    }
    export interface FunctionItem {
        type: 'function' | 'constructor'
        name: string
        inputs: InputItem[]
        outputs: InputItem[]
        payable: boolean
        stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable'
        constant: boolean
    }

    export interface EventItem {
        type: 'fallback' | 'event'
        name: string
        inputs: EventInputItem[]
        anonymous?: boolean
    }
}