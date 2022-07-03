import React from 'react'
import { Switch } from 'react-router-dom'
import { RouteInterface } from '@/types/route'
import { RouteWithSubRoutes } from './RouteWithSubRoutes'
import NoMatch from '@/pages/status/404'
import Login from '@/pages/login'
import { RouteUri } from '@/router/config'
import { Auth } from '@/auth'
import AnimateSwitch from './animateSwitch'
import '@/assets/style/animate.less'

export const RenderRoutes = (routes: RouteInterface[] | undefined, authed: boolean) => {
    // 判断是否登录
    if (!Auth.authContent) {
        return (
            <Switch>
                <Login />
            </Switch>
        )
    }

    if (routes) {
        return (
            <Switch>
                {routes.map((route: RouteInterface, index) => {
                    return RouteWithSubRoutes(route, index, authed, RouteUri.NotAuth)
                })}
            </Switch>
        )
    } else {
        return (
            <Switch>
                <NoMatch />
            </Switch>
        )
    }
}
