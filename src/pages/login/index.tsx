import React, { useReducer } from 'react'
import { Input, Button } from 'antd'
import { Auth } from '@/auth'
import { RouteUri } from '@/router/config'
import { useHistory } from 'react-router-dom'

import './index.less'

type Account = {
    username: string
    password: string
}

type FormData = {
    account: Account
    loading: boolean
}

const useAccount = (props: FormData) => {
    const [formData, setAccount] = React.useState<FormData>({
        account: props.account,
        loading: props.loading,
    })

    const setUsername = (e: any) => {
        setAccount({
            ...formData,
            account: {
                ...formData.account,
                username: e.target.value,
            },
        })
    }

    const setPassword = (e: any) => {
        setAccount({
            ...formData,
            account: {
                ...formData.account,
                password: e.target.value,
            },
        })
    }

    const setLoading = () => {
        setAccount({
            ...formData,
            loading: true,
        })
    }

    const onSubmit = () => {
        const date = new Date()
        Auth.setAuth(date.valueOf())
        setLoading()
        // let history = useHistory()
        // history.push('/root/page-sub1')
        window.location.href = '#/root/rkconfig'
    }

    return { formData, setAccount: { setUsername, setPassword, onSubmit } }
}

const Login: React.FC = () => {
    // 自定义Hook
    const { formData, setAccount } = useAccount({
        account: { username: '', password: '' },
        loading: false,
    })

    // 相当于 componentDidMount 和 componentDidUpdate:
    React.useEffect(() => {
        console.log('Login Page')
    })

    return (
        <section className="login-wrapper">
            <div className="login-content">
                <aside>
                    <div />
                </aside>

                <section>
                    <Input
                        bordered={false}
                        placeholder="请输入用户名"
                        onChange={setAccount.setUsername}
                    />
                    <Input
                        bordered={false}
                        placeholder="请输入密码"
                        onChange={setAccount.setPassword}
                    />

                    <Button block={true} loading={formData.loading} onClick={setAccount.onSubmit}>
                        登 录
                    </Button>
                </section>
            </div>
        </section>
    )
}

export default Login
