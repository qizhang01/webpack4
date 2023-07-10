import loadable from '@loadable/component'
import { RouteInterface } from '@/types/route'
import { RouteUri } from '@/router/config'

// TODO: public路径从buildConfig里读取，注入环境变量使用
export const basename = ''

export const routes: RouteInterface[] = [
    {
        path: RouteUri.Login,
        component: loadable(() => import('@/pages/login')),
        exact: true,
        name: 'login',
    },
    {
        path: '/testing',
        component: loadable(() => import('@/pages/testing')),
        exact: true,
        name: 'testing',
    },
    {
        path: RouteUri.Layout,
        component: loadable(() => import('@/pages/layout')),
        name: 'layout',
        routes: [
            {
                path: '/root/employee',
                component: loadable(() => import('@/pages/employeeinfo')),
                exact: true,
            },
            {
                path: '/root/onoroffsubmit',
                component: loadable(() => import('@/pages/onoroffsubmit')),
                exact: true,
            },
            {
                path: '/root/operatesubmit',
                component: loadable(() => import('@/pages/operatesubmit')),
                exact: true,
            },
            // {
            //     path: '/root/hrsubmit',
            //     component: loadable(() => import('@/pages/hrsubmit')),
            //     exact: true,
            // },
            {
                path: '/root/salary',
                component: loadable(() => import('@/pages/salary')),
                exact: true,
            },
            {
                path: '/root/score',
                component: loadable(() => import('@/pages/page1/score')),
                exact: true,
            },
            {
                path: '/root/standard',
                component: loadable(() => import('@/pages/page1/importstandard')),
                exact: true,
            },
            {
                path: RouteUri.PageSub2,
                component: loadable(() => import('@/pages/page1/page1-sub2')),
                exact: true,
            },

            {
                path: RouteUri.PageSub3,
                component: loadable(() => import('@/pages/page1/page1-sub3')),
                exact: true,
            },
            {
                path: RouteUri.PageSub5,
                component: loadable(() => import('@/pages/page1/page1-sub5')),
                exact: true,
                name: 'authorized',
                auth: false,
            },
            {
                path: '/root/sub1',
                component: loadable(() => import('@/pages/page1/sub1')),
                exact: true,
            },
            {
                path: RouteUri.NotAuth,
                component: loadable(() => import('@/pages/status/no-auth')),
                exact: true,
            },
            {
                path: RouteUri.rkConfig,
                component: loadable(() => import('@/pages/rkconfig/sub1')),
                exact: true,
            },
            {
                path: RouteUri.echart,
                component: loadable(() => import('@/pages/rkconfig/sub2')),
                exact: true,
            },
        ],
    },
    {
        path: RouteUri.NotFound,
        component: loadable(() => import('@/pages/status/404')),
        name: '404',
    },
]
