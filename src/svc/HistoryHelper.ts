// import { Connex } from "@vechain/connex"
import { abi } from "thor-devkit"
import { Node, ProjectSetting } from "./storage"

// export type Response = Connex.Thor.Filter.Row<"event", Connex.Thor.Account.WithDecoded>[] | (Connex.VM.Output & Connex.Thor.Account.WithDecoded)


export default interface History<T extends 'event' | 'function', E = {}> {
    time: number
    node: Node
    type: string
    caller?: T extends 'function' ? string : never
    abi: T extends 'event' ? abi.Event.Definition
        : T extends 'function' ? abi.Function.Definition
        : never
    settings: ProjectSetting
    params: any[]
    receipt?: T extends 'function' ? Connex.Thor.Transaction.Receipt | null : never
    tx?: T extends 'function' ? Connex.Thor.Transaction | null : never
    response?: (T extends 'event' ? Connex.Thor.Filter.Row<'event', Connex.Thor.Account.WithDecoded>[]
        : T extends 'function' ? Connex.VM.Output & Connex.Thor.Account.WithDecoded | Connex.Vendor.TxResponse
        : never) | {message: string, code: string | number}
}
