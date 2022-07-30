import React, { useReducer } from 'react'
import { Input, Layout } from 'antd'
import { Auth } from '@/auth'
import { useHistory } from 'react-router-dom'
import fetchApi from '@/ajax/index'
import './index.less'
import { Testingcontent } from '@/components/Testingcontent'
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'
import { RadioChangeEvent } from 'antd'

type Account = {
    username: string
    password: string
    errMsg: string
}

type FormData = {
    account: Account
    loading: boolean
}
const list = [
    { topic: '你的家乡在哪里呢？', selectItem: ['长沙', '重庆', '武汉', '北京'], selected: '' },
    { topic: '你的爱好有哪些呢？', selectItem: ['游戏', '打架', '下棋', '读书'], selected: '' },
    {
        topic: '如何去实现自己的梦想和理想？',
        selectItem: [
            '自立更生艰苦奋战',
            '无所事事天天睡觉',
            '人生苦短我选躺平',
            '天生我才必有用，过完一天是一天',
        ],
        selected: '',
    },
]
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
    }

    return { formData, setAccount: { setUsername, setPassword, onSubmit } }
}

const Testing: React.FC = () => {
    // 自定义Hook
    const { formData, setAccount } = useAccount({
        account: { username: '', password: '', errMsg: '' },
        loading: false,
    })
    const [topicIndex, setTopicIndex] = React.useState(1)

    // 相当于 componentDidMount 和 componentDidUpdate:
    React.useEffect(() => {}, [])
    const handleOnChange = (e: RadioChangeEvent, topicIndex: number) => {
        console.log(e.target.value)
    }

    const handleClickBefore = () => {
        const value = topicIndex - 1
        setTopicIndex(value)
    }
    const handleClickAfer = () => {
        const value = topicIndex + 1
        setTopicIndex(value)
    }
    return (
        <section className="login-wrapper">
            {/* <div className="login-content">
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
                        开始测验
                    </Button>
                </section>
            </div> */}
            <div className="testing-content">
                第{topicIndex}题
                <Testingcontent
                    key={topicIndex}
                    topic={list[topicIndex - 1].topic}
                    onChange={(e: RadioChangeEvent) => handleOnChange(e, topicIndex)}
                    selectItem={list[topicIndex - 1].selectItem}
                ></Testingcontent>
                <div className="navigation">
                    <DoubleLeftOutlined
                        style={{
                            fontSize: '200%',
                            visibility: topicIndex == 1 ? 'hidden' : 'visible',
                        }}
                        onClick={handleClickBefore}
                    />
                    <DoubleRightOutlined
                        style={{
                            fontSize: '200%',
                            visibility: topicIndex == list.length ? 'hidden' : 'visible',
                        }}
                        onClick={handleClickAfer}
                    />
                </div>
            </div>
        </section>
    )
}

export default Testing