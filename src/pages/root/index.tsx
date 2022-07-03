import * as React from 'react'
import { routeProps } from '@/types/route'
import { RenderRoutes } from '@/router/RenderRoutes'

const Root: React.FC<routeProps> = (routeProps: routeProps) => {
    const { routes } = routeProps

    return RenderRoutes(routes, true)
}

export default Root
