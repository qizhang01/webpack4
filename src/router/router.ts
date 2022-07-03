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
        path: RouteUri.Root,
        component: loadable(() => import('@/pages/root')),
        name: 'root',
        routes: [
            {
                path: RouteUri.Layout,
                component: loadable(() => import('@/pages/layout')),
                name: 'layout',
                routes: [
                    {
                        path: RouteUri.Home,
                        component: loadable(() => import('@/pages/home')),
                        exact: true,
                        name: 'home',
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
                        auth: true,
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
                ],
            },
        ],
    },
    {
        path: RouteUri.NotFound,
        component: loadable(() => import('@/pages/status/404')),
        name: '404',
    },
]
