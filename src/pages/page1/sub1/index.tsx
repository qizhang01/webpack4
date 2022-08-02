import React, { useState } from 'react'
import {
    Form,
    Select,
    Input,
    InputNumber,
    Switch,
    Radio,
    Button,
    Checkbox,
    Modal,
    message,
    Col,
    Tag,
    Card,
} from 'antd'
const { TextArea } = Input
import { PlusOutlined, InboxOutlined } from '@ant-design/icons'
import { Panel } from '@/components/Panel'
import { useLocation } from 'react-router-dom'
import './index.less'
import moment from 'moment'
import { Auth } from '@/auth'
import fetchApi from '@/ajax/index'
import { CustomTagProps } from 'rc-select/lib/BaseSelect'

const { Option } = Select

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
}

const stl = {
    topic: { marginRight: '10px', fontWeight: 800 },
}
const InputNumberStl = { width: '60%' }
const options = [{ value: 'A' }, { value: 'B' }, { value: 'C' }, { value: 'D' }]

const PageSub: React.FC = () => {
    const param = useLocation()

    const [isShowModel, setIsShowModel] = useState(false)
    const [activeTabKey1, setActiveTabKey1] = useState<string>('testinglib1')
    const [alltopics, setAllTopics] = useState<string[]>([])

    const tabList = [
        {
            key: 'testinglib1',
            tab: '试题1',
        },
        {
            key: 'testinglib2',
            tab: '试题2',
        },
    ]
    React.useEffect(() => {
        getAllTopics()
    }, [activeTabKey1])

    const getAllTopics = async () => {
        const result = await fetchApi(
            'api/testing/alltopics',
            JSON.stringify({ tablename: activeTabKey1 }),
            'POST'
        )
        setAllTopics(result.data)
    }
    const renderTopicCard = () => {
        return alltopics.map((item: any, index) => {
            return (
                <Card
                    type="inner"
                    title={`第${index + 1}题`}
                    key={index}
                    extra={<a href="#">删除</a>}
                >
                    {item.topic}
                </Card>
            )
        })
    }
    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values)
        const { topic, A, B, C = '', D = '', E = '', F = '', G = '', answer } = values
        const obj: any = {
            A,
            B,
            C,
            D,
            E,
            F,
            G,
        }

        const body = {
            name: activeTabKey1,
            topic,
            oneSelect: answer.length == 1 ? 1 : 0,
            answer: answer.join(','),
            ...obj,
        }
        const result = await fetchApi('api/testing/importonetopic', JSON.stringify(body), 'POST')
        console.log(result)
        if (result.code == '200') {
            message.info('提交成功')
        } else {
            message.info('提交失败, 请重新提交')
        }
    }
    const onTab1Change = (key: string) => {
        setActiveTabKey1(key)
    }
    const closeModel = () => {
        getAllTopics()
        setIsShowModel(false)
    }
    const addTablist = () => {}
    const handlePlusIcon = () => {
        setIsShowModel(true)
    }
    const onChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {}

    const tagRender = (props: CustomTagProps) => {
        const { label, closable, onClose } = props
        const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
            event.preventDefault()
            event.stopPropagation()
        }
        return (
            <Tag
                color="gold"
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{ marginRight: 10 }}
            >
                <span style={{ marginRight: 6 }}>{label}</span>
            </Tag>
        )
    }
    return (
        <Panel>
            <Card
                style={{ width: '100%' }}
                tabBarExtraContent={
                    <PlusOutlined
                        onClick={addTablist}
                        style={{ cursor: 'pointer', fontSize: '150%', color: '#1890ff' }}
                    />
                }
                tabList={tabList}
                activeTabKey={activeTabKey1}
                onTabChange={key => {
                    onTab1Change(key)
                }}
            >
                {renderTopicCard()}
                <span
                    style={{
                        width: 120,
                        height: 100,
                        marginTop: 10,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px dashed #1890ff',
                        cursor: 'pointer',
                    }}
                    onClick={handlePlusIcon}
                >
                    <PlusOutlined style={{ fontSize: '300%', color: '#1890ff' }} />
                </span>
            </Card>
            <Modal
                title="添加试题"
                wrapClassName="vertical-center-modal"
                width="600px"
                visible={isShowModel}
                onCancel={closeModel}
                footer={null}
            >
                <Form name="config-form" {...formItemLayout} onFinish={onFinish} initialValues={{}}>
                    <Form.Item name="topic" label="标题">
                        <TextArea showCount style={{ height: 80 }} onChange={onChangeTextArea} />
                    </Form.Item>
                    <Form.Item
                        name="A"
                        label="A"
                        rules={[{ required: true, message: '必须输入选项' }]}
                    >
                        <Input placeholder="请输入选项1" />
                    </Form.Item>
                    <Form.Item
                        name="B"
                        label="B"
                        rules={[{ required: true, message: '必须输入选项' }]}
                    >
                        <Input placeholder="请输入选项2" />
                    </Form.Item>
                    <Form.Item name="C" label="C">
                        <Input placeholder="请输入选项3" />
                    </Form.Item>
                    <Form.Item name="D" label="D">
                        <Input placeholder="请输入选项4" />
                    </Form.Item>
                    <Form.Item
                        label="正确答案"
                        name="answer"
                        rules={[{ required: true, message: '必须输入正确答案' }]}
                    >
                        <Select
                            mode="multiple"
                            showArrow
                            tagRender={tagRender}
                            style={{ width: '100%' }}
                            options={options}
                        />
                        {/* <InputNumber min={1} placeholder="请输入正确答案" style={InputNumberStl} /> */}
                    </Form.Item>
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <Button type="primary" htmlType="submit" block style={{ width: '40%' }}>
                            完成提交
                        </Button>
                    </div>
                </Form>
            </Modal>
        </Panel>
    )
}
export default PageSub
