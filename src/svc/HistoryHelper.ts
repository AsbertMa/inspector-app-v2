// import { Connex } from "@vechain/connex"
import { abi } from "thor-devkit"
import { Node } from "./storage"

// export type Response = Connex.Thor.Filter.Row<"event", Connex.Thor.Account.WithDecoded>[] | (Connex.VM.Output & Connex.Thor.Account.WithDecoded)


export default interface History<T extends 'event' | 'function', E = {}> {
    time: number
    node: Node
    caller?: T extends 'function' ? string : never
    address: string
    abi: T extends 'event' ? abi.Event.Definition
        : T extends 'function' ? abi.Function.Definition
        : never
    params: any[]
    response?: (T extends 'event' ? Connex.Thor.Filter.Row<'event', Connex.Thor.Account.WithDecoded>[]
        : T extends 'function' ? Connex.VM.Output & Connex.Thor.Account.WithDecoded
        : never) | {message: string, code: string | number},
    txResp?: T extends 'function' ? Connex.Vendor.TxResponse : never
}
