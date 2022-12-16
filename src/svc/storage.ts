import Dexie, { Table } from 'dexie'
import 'dexie-observable'
import { IDatabaseChange } from 'dexie-observable/api'

export interface Node {
    id?: number
    name: string
    network: 'main' | 'test' | 'custom' | 'solo'
    url: string
    block_zero?: string
}

export interface Project {
    id?: number
    name: string
    description: string
    abi: string
}

export interface ProjectSetting {
    id?: number
    projectId: number
    nodeId: number
    name: string
    address: string
    delegator?: string
    delegateUrl?: string
}

export class DB extends Dexie {
    nodes?: Table<Node>
    projects?: Table<Project>
    projectSettings?: Table<ProjectSetting>

    constructor() {
        super('inspertor-V2')
        this.version(1).stores({
            nodes: '++id, name, network, url, block_zero',
            projects: '++id, name, description, abi',
            projectSettings: '++id, projectId, nodeId, address, delegator, delegateUrl'
        })

        this.open().catch((err) => {
            console.error(err)
        })
    }

    async editNode(name: string, network: 'main' | 'test' | 'custom', url: string, id?: number, block_zero?: string) {
        if (id) {
            return await this.nodes?.update(id, {
                name,
                network,
                url,
                block_zero
            })
        } else {
            return await this.nodes?.add({
                name,
                network,
                url,
                block_zero
            })
        }
    }

    async editProject(name: string, description: string, abi: string, id?: number) {
        if (id) {
            return this.projects?.update(id, {
                name,
                description,
                abi
            })
        } else {
            return this.projects?.add({
                name,
                description,
                abi
            })
        }
    }

    async editProjectSettings(projectId: number, nodeId: number, address: string, name: string, id?: number) {
        if (id) {
            this.projectSettings?.update(id, {
                projectId,
                nodeId,
                address,
                name
            })
        } else {
            this.projectSettings?.add({
                projectId,
                nodeId,
                address,
                name
            })
        }
    }

    async getNodes() {
        return await this.nodes?.toArray()
    }

    async getProjects() {
        return await this.projects?.toArray()
    }

    async getProjectConfig(projectId: string) {
        return await this.projectSettings?.where({
            projectId: parseInt(projectId)
        }).toArray()
    }

    async getProjectById(id: string) {
        return await this.projects?.get({ id: parseInt(id) })
    }

    public subscribe(
        tableName: string,
        onChange: (changes: IDatabaseChange[]) => void
    ) {
        const ev = this.on('changes')
        const fn = (changes: IDatabaseChange[]) => {
            changes = changes.filter((c) => c.table === tableName)
            if (changes.length > 0) {
                onChange(changes)
            }
        }
        ev.subscribe(fn)
        return {
            unsubscribe: () => ev.unsubscribe(fn)
        }
    }
}

const DBInstance = new DB()

export default DBInstance
