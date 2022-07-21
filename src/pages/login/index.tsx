import React, { useReducer } from 'react'
import { Input, Button } from 'antd'
import { Auth } from '@/auth'
import { useHistory } from 'react-router-dom'
import fetchApi from '@/ajax/index'
import './index.less'

type Account = {
    username: string
    password: string
    errMsg: string
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

    const setLoading = (value: boolean) => {
        setAccount({
            ...formData,
            loading: value,
        })
    }

    const setErrMsg = (text: string) => {
        setAccount({
            ...formData,
            account: {
                ...formData.account,
                errMsg: text,
            },
        })
    }
    const onSubmit = async () => {
        setLoading(true)
        const result = await fetchApi('api/users/login', JSON.stringify(formData.account), 'POST')
        if (result.code == 200) {
            Auth.setAuth(result.data)
            setTimeout(() => (window.location.href = '#/root/rkconfig'))
        } else {
            setLoading(false)
            setErrMsg(result.msg)
        }
        // let history = useHistory()
        // history.push('/root/page-sub1')
    }

    return { formData, setAccount: { setUsername, setPassword, onSubmit } }
}

const Login: React.FC = () => {
    // 自定义Hook
    const { formData, setAccount } = useAccount({
        account: { username: '', password: '', errMsg: '' },
        loading: false,
    })

    // 相当于 componentDidMount 和 componentDidUpdate:
    React.useEffect(() => {
        if (window.localStorage.getItem('xx-auth-key')) {
            window.location.href = '#/root/rkconfig'
        }
    }, [])

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
                    <span className="err-msg">{formData.account.errMsg}</span>
                    <Button block={true} loading={formData.loading} onClick={setAccount.onSubmit}>
                        登 录
                    </Button>
                </section>
            </div>
        </section>
    )
}

export default Login
