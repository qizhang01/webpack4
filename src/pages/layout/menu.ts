import { RouteUri } from '@/router/config'

export interface IMenuNav {
    title: string
    uri?: RouteUri | string
    children?: IMenuNav[]
}

export const menuNav: IMenuNav[] = [
    {
        title: '数据录入',
        children: [
            {
                title: '手工录入',
                uri: RouteUri.PageSub3,
            },
            {
                title: 'excel导入',
                uri: RouteUri.PageSub2,
            },
            {
                title: '试题录入',
                uri: '/root/sub1',
            },
        ],
    },

    {
        title: '数据导出',
        uri: RouteUri.rkConfig,
    },
    {
        title: '图形化',
        uri: RouteUri.echart,
    },
    {
        title: '权限控制',
        uri: RouteUri.PageSub5,
    },
]
