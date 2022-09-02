import { RouteUri } from '@/router/config'

export interface IMenuNav {
    title: string
    show?: boolean
    uri?: RouteUri | string
    children?: IMenuNav[]
}

export const menuNav: IMenuNav[] = [
    {
        title: '数据录入',
        show: true,
        children: [
            {
                title: '手工录入',
                uri: RouteUri.PageSub3,
            },
            {
                title: 'excel导入',
                uri: RouteUri.PageSub2,
            },
        ],
    },

    {
        title: '数据导出',
        show: true,
        uri: RouteUri.rkConfig,
    },
    {
        title: '图形化',
        show: true,
        uri: RouteUri.echart,
    },
    {
        title: '权限',
        show: localStorage.getItem('xx-auth-key')
            ? JSON.parse(localStorage.getItem('xx-auth-key') || '').roles.includes('ADMIN')
            : false,
        children: [
            {
                title: '权限控制',
                uri: RouteUri.PageSub5,
            },
            {
                title: '试题录入',
                uri: '/root/sub1',
            },
            {
                title: '标准导入',
                uri: '/root/standard',
            },
            {
                title: '员工成绩',
                uri: '/root/score',
            },
            {
                title: '员工薪水',
                uri: '/root/salary',
            },
        ],
    },
]
