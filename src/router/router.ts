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
        path: RouteUri.Layout,
        component: loadable(() => import('@/pages/layout')),
        name: 'layout',
        routes: [
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
