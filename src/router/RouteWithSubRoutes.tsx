import React from 'react'
import { Route, Redirect, RouteComponentProps } from 'react-router-dom'
import { RouteInterface } from '@/types/route'

/**
 * @route RouteInterface对象
 * @authed 自定义的权限
 * @authPath 权限路径
 */
export const RouteWithSubRoutes = (
    route: RouteInterface,
    index: number,
    authed: boolean,
    authPath: string
) => {
    return (
        <Route
            key={index}
            path={route.path}
            exact={route.exact}
            render={(props: RouteComponentProps) => {
                if (!route.auth) {
                    // 向下传递子路由，保持嵌套
                    return <route.component {...props} routes={route.routes} />
                }
                // 自定义重定向路由
                return <Redirect to={{ pathname: authPath, state: { from: props.location } }} />
            }}
        />
    )
}
