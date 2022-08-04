import React, { useReducer } from 'react'
import { Input, Button, Select, Avatar } from 'antd'
import { Auth } from '@/auth'
import { useHistory, useLocation } from 'react-router-dom'
import fetchApi from '@/ajax/index'
import './index.less'
import { Testingcontent } from '@/components/Testingcontent'
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'
import { RadioChangeEvent } from 'antd'
const { Option } = Select

type Account = {
    username: string
    password: string
    errMsg: string
}

type FormData = {
    account: Account
    loading: boolean
    hasLogin: boolean
    // options: optionObj[]
}
type optionObj = {
    key: number
    option: string
    tablename: string
}

type ListType = {
    topic: string
    selectItem: string[]
    selected: string
}

// const list = [
//     { topic: '你的家乡在哪里呢？', selectItem: ['长沙', '重庆', '武汉', '北京'], selected: '' },
//     { topic: '你的爱好有哪些呢？', selectItem: ['游戏', '打架', '下棋', '读书'], selected: '' },
//     {
//         topic: '如何去实现自己的梦想和理想？',
//         selectItem: [
//             '自立更生艰苦奋战',
//             '无所事事天天睡觉',
//             '人生苦短我选躺平',
//             '天生我才必有用，过完一天是一天',
//         ],
//         selected: '',
//     },
// ]
type LoginInfo = {
    id: number
    roles: string
}
let tablename = ''
let loginInfo: LoginInfo
const useAccount = (props: FormData) => {
    const [formData, setAccount] = React.useState<FormData>({
        account: props.account,
        loading: props.loading,
        hasLogin: false,
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

    const setHasLogin = (flag: boolean) => {
        setAccount({
            ...formData,
            hasLogin: flag,
        })
    }

    const onSubmit = async () => {
        setLoading(true)
        const result = await fetchApi('api/users/login', JSON.stringify(formData.account), 'POST')
        if (result.code == 200) {
            setHasLogin(true)
            loginInfo = result.data
            localStorage.setItem('testing-auth-key', JSON.stringify(result.data))
        } else {
            setLoading(false)
            setErrMsg(result.msg)
        }
    }

    return { formData, setAccount: { setUsername, setPassword, onSubmit, setHasLogin } }
}
type LastResult = {
    totalNumber: number
    rightNumber: number
    selectedArr: SingleResult[]
}
type SingleResult = {
    value: string
    isTrue: boolean
}
const Testing: React.FC = () => {
    // 自定义Hook
    const { formData, setAccount } = useAccount({
        account: { username: '', password: '', errMsg: '' },
        loading: false,
        hasLogin: false,
    })
    const [topicIndex, setTopicIndex] = React.useState(1)
    const [options, setOptions] = React.useState<optionObj[]>([]) //试题选项
    const [list, setList] = React.useState<ListType[]>([])
    const [isShowLastScore, setIsShowLastScore] = React.useState(false)
    // 相当于 componentDidMount 和 componentDidUpdate:
    React.useEffect(() => {
        fetchOptions()
        if (localStorage.getItem('xx-auth-key') && location.hash.split('?')[1] == 'from=main') {
            setAccount.setHasLogin(true)
        }
    }, [])
    const [isShowSubject, setIsShowSubject] = React.useState(false)
    const [lastResut, setLastResult] = React.useState<LastResult>({
        totalNumber: 0,
        rightNumber: 0,
        selectedArr: [],
    })

    const handleOnChange = (e: RadioChangeEvent, topicIndex: number) => {
        console.log(e.target.value)
        list[topicIndex - 1].selected = e.target.value
    }
    const fetchOptions = async () => {
        const res = await fetchApi('api/testing/alltestinglibname')
        setOptions(generateOptions(res.data))
    }
    const generateOptions = (d: any) => {
        const { name, tablename } = d[0]
        const nameArr = name.split(',')
        const tableArr = tablename.split(',')
        const result = []
        for (let i = 0; i < nameArr.length; i++) {
            result.push({
                key: i,
                option: nameArr[i],
                tablename: tableArr[i],
            })
        }
        return result
    }
    const handleClickBefore = () => {
        const value = topicIndex - 1
        setTopicIndex(value)
    }
    const handleClickAfer = () => {
        const value = topicIndex + 1
        setTopicIndex(value)
    }

    const handleChange = async (value: string) => {
        tablename = value //表名保存
        const result = await fetchApi(
            'api/testing/alltopics',
            JSON.stringify({ tablename: value }),
            'POST'
        )
        const list = result.data.map((item: any) => {
            return {
                topic: item.topic,
                selectItem: [item.A, item.B, item.C, item.D, item.E, item.F, item.G],
                selected: '',
            }
        })
        setList(list)
    }

    const toStart = () => {
        list.length > 0 && setIsShowSubject(true)
    }

    const finished = async () => {
        const map = new Map()
        map.set(0, 'A')
        map.set(1, 'B')
        map.set(2, 'C')
        map.set(3, 'D')
        map.set(4, 'E')
        map.set(5, 'F')
        map.set(6, 'G')
        const selectedArr: string[] = list.map(item => map.get(item.selected))
        const result = await fetchApi(
            'api/testing/submittestingresult',
            JSON.stringify({
                tablename,
                selectedArr,
                id: loginInfo.id,
            }),
            'POST'
        )

        // let errNumber = 0,
        //     tempObj: any[] = []
        // for (let i = 0; i < selectedArr.length; i++) {
        //     if (selectedArr[i] !== res[i].answer) {
        //         errNumber++
        //         tempObj.push({
        //             value: selectedArr[i],
        //             isTrue: false,
        //         })
        //     } else {
        //         tempObj.push({
        //             value: selectedArr[i],
        //             isTrue: true,
        //         })
        //     }
        // }
        setLastResult({
            totalNumber: selectedArr.length,
            rightNumber: result.data.rightNumber,
            selectedArr: result.data.tempObj,
        })
        setIsShowLastScore(true)
    }

    return (
        <section className="login-wrapper">
            {!formData.hasLogin && !isShowLastScore && (
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
                        <Button
                            block={true}
                            loading={formData.loading}
                            onClick={setAccount.onSubmit}
                        >
                            登录
                        </Button>
                    </section>
                </div>
            )}
            {formData.hasLogin && !isShowLastScore && (
                <div className="testing-content">
                    {isShowSubject ? (
                        <>
                            第{topicIndex}题
                            <Testingcontent
                                key={topicIndex}
                                value={list[topicIndex - 1].selected}
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
                                        display: topicIndex == list.length ? 'none' : 'block',
                                    }}
                                    onClick={handleClickAfer}
                                />
                                <Button
                                    onClick={finished}
                                    type="primary"
                                    style={{
                                        display: topicIndex == list.length ? 'block' : 'none',
                                    }}
                                >
                                    完成提交
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="subject-select">
                            <div className="subject-introduce">
                                *注意事项：
                                <span style={{ color: '#1890ff' }}>
                                    本测试是关于专业知识的测试, 试题分为单选题和多选题,
                                    务必一次性做完，做题期间不能退出。首先请选择试题的类型。
                                </span>
                            </div>
                            <Select
                                placeholder="请选择试题类型"
                                style={{ width: 250, marginBottom: 50 }}
                                onChange={handleChange}
                            >
                                {options.map(item => (
                                    <Option key={item.key} value={item.tablename}>
                                        {item.option}
                                    </Option>
                                ))}
                            </Select>
                            <div>
                                <Button
                                    type="primary"
                                    style={{ width: 250, marginBottom: 10 }}
                                    onClick={toStart}
                                >
                                    开始测验
                                </Button>
                            </div>
                            <a href="javascript:;">点击查看历史记录</a>
                        </div>
                    )}
                </div>
            )}
            {isShowLastScore && (
                <div className="testing-content">
                    <div style={{ textAlign: 'center', marginTop: 80, marginBottom: 30 }}>
                        <Avatar size={100} style={{ color: '#1890ff', backgroundColor: '#fde3cf' }}>
                            <span style={{ fontSize: 36 }}>{lastResut.rightNumber}分</span>
                        </Avatar>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ marginBottom: 10, fontSize: 30 }}>
                            {lastResut.selectedArr.map((item, index) => (
                                <span key={index} className={item.isTrue ? 'isTrue' : 'isFalse'}>
                                    {item.value}
                                </span>
                            ))}
                        </div>
                        本次测验的题数是
                        <span style={{ color: '#1890ff', fontSize: 18, margin: '0 6px' }}>
                            {lastResut.totalNumber}
                        </span>
                        道, 正确的题数是
                        <span style={{ color: '#1890ff', fontSize: 18, margin: '0 6px' }}>
                            {lastResut.rightNumber}
                        </span>
                        道
                    </div>
                </div>
            )}
        </section>
    )
}

export default Testing
