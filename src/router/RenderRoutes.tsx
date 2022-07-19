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
import { Route } from 'react-router-dom'
export const RenderRoutes = (routes: RouteInterface[] | undefined, authed: boolean) => {
    if (routes) {
        return (
            <Switch>
                <Route path="/login" component={Login} />
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
