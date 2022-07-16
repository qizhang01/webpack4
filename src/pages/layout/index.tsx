import * as React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Layout, Menu, Button } from 'antd'
import { RenderRoutes } from '@/router/RenderRoutes'
import { IMenuNav, menuNav } from '@/pages/layout/menu'
// import { Logo } from '@/assets/images'
import { Auth } from '@/auth'
import { routeProps } from '@/types/route'
import './index.less'
import { RouteUri } from '@/router/config'

const { Sider, Header, Content } = Layout
const SubMenu = Menu.SubMenu

const AppLayout: React.FC<routeProps> = (routeProps: routeProps) => {
    const [collapsed, setCollapsed] = React.useState(false)
    const { routes } = routeProps

    const NavMenu = (nav: IMenuNav) => {
        return (
            <Menu.Item key={nav.uri}>
                <Link to={nav.uri ? nav.uri : '/'}>
                    <span>{nav.title}</span>
                </Link>
            </Menu.Item>
        )
    }

    const NavSubMenu = (nav: IMenuNav) => {
        return (
            <SubMenu key={nav.uri} title={nav.title}>
                {nav.children && nav.children.map(value => NavMenu(value))}
            </SubMenu>
        )
    }

    const logout = () => {
        Auth.cleanAuth()
    }

    return (
        <>
            <Header>
                <img
                    src="src/assets/images/logo.jpg"
                    style={{ height: 44, width: 44, float: 'left', marginTop: 6 }}
                ></img>
                <Button type="primary" size="middle" onClick={logout}>
                    退出
                </Button>
            </Header>
            <Layout>
                <Sider
                    // collapsible={true}
                    // collapsed={collapsed}
                    // onCollapse={collapsed => setCollapsed(collapsed)}
                    className="layout-sidebar"
                >
                    <Menu
                        defaultSelectedKeys={[RouteUri.PageSub3]}
                        mode="inline"
                        theme="dark"
                        multiple={false}
                    >
                        {menuNav.map((nav: IMenuNav) => {
                            if (nav.children) {
                                return NavSubMenu(nav)
                            } else {
                                return NavMenu(nav)
                            }
                        })}
                    </Menu>
                </Sider>

                <Layout className="layout-warpper-content">
                    <Content>{RenderRoutes(routes, true)}</Content>
                </Layout>
            </Layout>
        </>
    )
}

export default withRouter(AppLayout)
