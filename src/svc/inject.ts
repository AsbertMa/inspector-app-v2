import { DB } from '@/svc/storage'
import { inject } from 'vue'

export const keys = {
    Database: Symbol('DB')
}

export function DBInstance () {
    return inject(keys.Database) as DB
}
