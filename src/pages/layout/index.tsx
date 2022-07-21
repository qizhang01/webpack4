import * as React from 'react'
import { withRouter, Link, useHistory } from 'react-router-dom'
import { Layout, Menu, Button, Dropdown, Avatar, Modal, Row, Input } from 'antd'
import { RenderRoutes } from '@/router/RenderRoutes'
import { IMenuNav, menuNav } from '@/pages/layout/menu'
import Logo from '@/assets/images/logo.jpg'
import { Auth } from '@/auth'
import { routeProps } from '@/types/route'
import './index.less'
import { RouteUri } from '@/router/config'
import { UserOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons'
const { Sider, Header, Content } = Layout
const SubMenu = Menu.SubMenu
import fetchAPI from '@/ajax/index'

const AppLayout: React.FC<routeProps> = (routeProps: routeProps) => {
    const [isShowErrText, setIsShowErrText] = React.useState(false)
    const [warningText, setWarningText] = React.useState('')
    const [isShowModel, setIsShowModel] = React.useState(false)
    const [originPassword, setOriginPassword] = React.useState('')
    const [newPassword, setNewPassword] = React.useState('')
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('')
    const { routes } = routeProps
    React.useEffect(() => {
        if (!Auth.authContent) {
            window.location.href = '#/login'
        }
    })
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

    const submitModel = async () => {
        if (newPassword != confirmNewPassword) {
            setWarningText('新密码两次输入不相同,请重新输入')
            return setIsShowErrText(true)
        }
        const param = {
            id: Auth.loginInfo.id,
            password: originPassword,
            newpassword: newPassword,
        }
        const res = await fetchAPI('api/users/modifypasswordbyself', JSON.stringify(param), 'POST')
        if (res.code == 200) {
            setWarningText(res.msg)
            setOriginPassword('')
            setNewPassword('')
            setConfirmNewPassword('')
            setIsShowErrText(true)
        }
    }
    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <p
                            onClick={() => {
                                setIsShowModel(true)
                            }}
                            className="vatar-dropdown"
                        >
                            <EditOutlined style={{ marginRight: 10 }} />
                            修改密码
                        </p>
                    ),
                },
                {
                    key: '2',
                    label: (
                        <p onClick={logout} className="vatar-dropdown">
                            <LogoutOutlined style={{ marginRight: 10 }} />
                            退出登录
                        </p>
                    ),
                },
            ]}
        />
    )

    return (
        <>
            <Header>
                <img
                    src={Logo}
                    style={{ height: 44, width: 44, float: 'left', marginTop: 6 }}
                ></img>
                <Dropdown overlay={menu} placement="bottom">
                    <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />}></Avatar>
                </Dropdown>
            </Header>
            <Layout>
                <Sider
                    // collapsible={true}
                    // collapsed={collapsed}
                    // onCollapse={collapsed => setCollapsed(collapsed)}
                    className="layout-sidebar"
                >
                    <Menu
                        defaultSelectedKeys={[RouteUri.rkConfig]}
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
            <Modal
                title="修改密码"
                wrapClassName="vertical-center-modal"
                width="600px"
                visible={isShowModel}
                onCancel={() => setIsShowModel(false)}
                footer={[
                    <Button key="close" onClick={() => setIsShowModel(false)}>
                        关闭
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        disabled={
                            originPassword == '' || newPassword == '' || confirmNewPassword == ''
                        }
                        onClick={submitModel}
                    >
                        确定
                    </Button>,
                ]}
            >
                <Row>
                    <span
                        style={{
                            width: 100,
                            display: 'inline-block',
                            textAlign: 'right',
                        }}
                    >
                        原密码:
                    </span>
                    <Input
                        placeholder="请输入原密码"
                        onChange={e => {
                            setWarningText('')
                            setOriginPassword(e.target.value)
                        }}
                        style={{ width: 200, marginLeft: 10, marginBottom: 10 }}
                        value={originPassword}
                    ></Input>
                </Row>
                <Row>
                    <span
                        style={{
                            width: 100,
                            display: 'inline-block',
                            textAlign: 'right',
                        }}
                    >
                        新密码:
                    </span>
                    <Input.Password
                        placeholder="请输入新密码"
                        onChange={e => {
                            setWarningText('')
                            setNewPassword(e.target.value)
                        }}
                        style={{ width: 200, marginLeft: 10, marginBottom: 10 }}
                        value={newPassword}
                    ></Input.Password>
                </Row>
                <Row>
                    <span
                        style={{
                            width: 100,
                            display: 'inline-block',
                            textAlign: 'right',
                        }}
                    >
                        新密码:
                    </span>
                    <Input.Password
                        placeholder="请再次输入新密码"
                        onChange={e => {
                            setWarningText('')
                            setConfirmNewPassword(e.target.value)
                        }}
                        style={{ width: 200, marginLeft: 10, marginBottom: 10 }}
                        value={confirmNewPassword}
                    ></Input.Password>
                </Row>
                <Row>
                    <span
                        style={{
                            display: isShowErrText ? 'block' : 'none',
                            color: 'red',
                            marginLeft: '110px',
                        }}
                    >
                        {warningText}
                    </span>
                </Row>
            </Modal>
        </>
    )
}

export default withRouter(AppLayout)
