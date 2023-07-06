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
]

export const permission = {
    title: '权限',
    show: true,
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
    ],
}
export const employeeinfo = {
    title: '员工信息',
    show: true,
    children: [
        {
            title: '部门员工',
            uri: '/root/employee',
        },
        {
            title: '员工薪水',
            uri: '/root/salary',
        },
    ],
}

export const submitflow = {
    title: '审批流程',
    show: true,
    children: [
        {
            title: '流程发起',
            uri: '/root/onoroffsubmit',
        },
        {
            title: '营运审批',
            uri: '/root/operatesubmit',
        },
        {
            title: '人事告知',
            uri: '/root/hrsubmit',
        },
    ],
}
