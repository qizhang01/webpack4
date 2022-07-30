import React, { useState } from 'react'
import {
    Form,
    Select,
    Input,
    InputNumber,
    Switch,
    Radio,
    Button,
    Upload,
    Checkbox,
    Modal,
    Row,
    Col,
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

const { Option } = Select

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
}

const stl = {
    topic: { marginRight: '10px', fontWeight: 800 },
}
const InputNumberStl = { width: '60%' }

const PageSub: React.FC = () => {
    const param = useLocation()

    const [isShowModel, setIsShowModel] = useState(false)
    const [activeTabKey1, setActiveTabKey1] = useState<string>('testinglib1')
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
    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values)
        const { topic, item1, item2, item3, item4, answer } = values
        // const result = await fetchApi('api/addOneProduct', JSON.stringify(body), 'POST')
        // console.log(result)
        // if (result.code == '200') {
        //     message.info('提交成功')
        // } else {
        //     message.info('提交失败, 请重新提交')
        // }
    }
    const onTab1Change = (key: string) => {
        setActiveTabKey1(key)
    }
    const submitModel = () => {}
    const addTablist = () => {}
    const handlePlusIcon = () => {
        setIsShowModel(true)
    }
    const onChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {}
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
                <span
                    style={{
                        width: 160,
                        height: 140,
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
                onCancel={() => setIsShowModel(false)}
                footer={null}
            >
                <Form name="config-form" {...formItemLayout} onFinish={onFinish} initialValues={{}}>
                    <Form.Item name="topic" label="标题">
                        <TextArea showCount style={{ height: 80 }} onChange={onChangeTextArea} />
                    </Form.Item>
                    <Form.Item
                        name="item1"
                        label="选项1"
                        rules={[{ required: true, message: '必须输入选项' }]}
                    >
                        <Input placeholder="请输入选项1" />
                    </Form.Item>
                    <Form.Item
                        name="item2"
                        label="选项2"
                        rules={[{ required: true, message: '必须输入选项' }]}
                    >
                        <Input placeholder="请输入选项2" />
                    </Form.Item>
                    <Form.Item name="item3" label="选项3">
                        <Input placeholder="请输入选项3" />
                    </Form.Item>
                    <Form.Item name="item4" label="选项4">
                        <Input placeholder="请输入选项4" />
                    </Form.Item>
                    <Form.Item
                        label="正确答案"
                        name="answer"
                        rules={[{ required: true, message: '必须输入正确答案' }]}
                    >
                        <InputNumber min={1} placeholder="请输入正确答案" style={InputNumberStl} />
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
