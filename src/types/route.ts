import { RouteComponentProps } from 'react-router-dom'

export interface RouteInterface {
    path: string
    component: any
    routes?: RouteInterface[]
    exact?: boolean
    title?: string
    name?: string
    auth?: boolean // 权限判断
}

export interface RoutesInterface {
    routes?: RouteInterface[]
}

export type routeProps = RouteComponentProps<any> & RoutesInterface
