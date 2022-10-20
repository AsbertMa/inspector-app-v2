import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Workspace from '@/views/workspace/Index.vue'
import Deploy from '@/views/deploy/Index.vue'
import Explorer from '@/views/explorer/Index.vue'
import Project from '@/views/project/Index.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/workspace',
        name: 'Workspace',
        component: Workspace
    },
    {
        path: '/deploy',
        name: 'Deploy',
        component: Deploy
    },
    {
        path: '/explorer',
        name: 'Explorer',
        component: Explorer
    },
    {
        path: '/project/:id/:tab',
        name: 'Project',
        component: Project
    }
]

const router = createRouter({
  strict: true,
  history: createWebHashHistory(),
  routes
})

export default router
