import React, { useState } from 'react'
import {
    Form,
    Select,
    Input,
    InputNumber,
    Button,
    Table,
    Collapse,
    message,
    Space,
    Tag,
    TimePicker,
    Row,
    Tabs,
} from 'antd'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons'
import { Panel } from '@/components/Panel'
import './index.less'
import { Auth, AUTH_KEY } from '@/auth'
import fetchApi from '@/ajax/index'
const { Option } = Select

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
}

const items = [
    {
        key: '1',
        label: 'Tab 1',
        children: 'Content of Tab Pane 1',
    },
    {
        key: '2',
        label: 'Tab 2',
        children: 'Content of Tab Pane 2',
    },
    {
        key: '3',
        label: 'Tab 3',
        children: 'Content of Tab Pane 3',
    },
]

const PageSub: React.FC = () => {
    const [key, setkey] = useState(1)
    const info = window.localStorage.getItem(AUTH_KEY)
    const departmentname = info ? JSON.parse(info).departmentname : ''
    const onFinish = async (values: any) => {
        if (key == 1) {
            console.log(key)
        } else if (key == 2) {
            console.log(key)
        } else if (key == 3) {
            console.log(key)
        }
    }

    const onChange = (key: any) => {
        setkey(key)
    }

    const selectMethod = () => {}
    const selectDepartment = () => {}
    const selectSalaryType = () => {}
    const handleClick = () => {}
    const handleClose = () => {}
    return (
        <Panel>
            <Collapse onChange={onChange} accordion>
                <Collapse.Panel header="入职离职申请" key="1">
                    <Form name="config-form" {...formItemLayout} onFinish={onFinish}>
                        <Form.Item name="offertype" label="入职/离职">
                            <Select
                                defaultValue="入职"
                                style={{ width: 280 }}
                                onChange={selectMethod}
                            >
                                <Option value="入职">入职</Option>
                                <Option value="离职">离职</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="姓名"
                            rules={[{ required: true, message: '必须输入姓名' }]}
                        >
                            <Input placeholder="请输入姓名" style={{ width: 280 }} />
                        </Form.Item>

                        <Form.Item
                            name="departmentname"
                            label="项目部"
                            rules={[{ required: true, message: '必须输入项目部' }]}
                        >
                            <Input
                                placeholder="请输入姓名"
                                style={{ width: 280 }}
                                defaultValue={departmentname}
                            />
                        </Form.Item>

                        <div style={{ marginTop: 30, marginBottom: 10 }}>
                            <Form.Item wrapperCol={{ span: 3, offset: 9 }}>
                                <Button type="primary" htmlType="submit" block>
                                    完成提交
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </Collapse.Panel>
                <Collapse.Panel header="加班申请" key="2">
                    <div style={{ marginLeft: '16%' }}>
                        <Select
                            placeholder="请选择员工姓名"
                            style={{ width: 280, display: 'block' }}
                            onChange={selectDepartment}
                        >
                            <Option value="入职">入职</Option>
                            <Option value="离职">离职</Option>
                        </Select>
                        <div style={{ marginTop: 20, marginBottom: 20 }}>
                            <Space size={[0, 8]} wrap>
                                <Tag color="gold" closable onClose={handleClose}>
                                    李军
                                </Tag>
                                <Tag color="gold" closable onClose={handleClose}>
                                    王琦
                                </Tag>
                                <Tag color="gold" closable onClose={handleClose}>
                                    张其中
                                </Tag>
                            </Space>
                        </div>
                        <TimePicker.RangePicker style={{ width: 280 }} />
                    </div>
                    <div
                        style={{
                            marginTop: 30,
                            marginBottom: 10,
                            width: '100%',
                            textAlign: 'center',
                        }}
                    >
                        <Button type="primary" onClick={handleClick}>
                            完成提交
                        </Button>
                    </div>
                </Collapse.Panel>
                <Collapse.Panel header="调薪申请" key="3">
                    <Form name="config-form" {...formItemLayout} onFinish={onFinish}>
                        <Form.Item name="name" label="姓名">
                            <Input placeholder="请输入员工姓名" style={{ width: 280 }} />
                        </Form.Item>
                        <Form.Item name="salarytype" label="日薪/月薪">
                            <Select
                                defaultValue="日薪"
                                style={{ width: 180 }}
                                onChange={selectSalaryType}
                            >
                                <Option value="日薪">日薪</Option>
                                <Option value="月薪">月薪</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="nowsalary" label="当前薪水">
                            <span></span>
                        </Form.Item>
                        <Form.Item
                            name="expectedsalary"
                            label="期望薪水"
                            rules={[{ required: true, message: '必须输入期望薪水' }]}
                        >
                            <InputNumber placeholder="请输入期望薪水" style={{ width: 280 }} />
                        </Form.Item>

                        <div style={{ marginTop: 30, marginBottom: 10 }}>
                            <Form.Item wrapperCol={{ span: 3, offset: 9 }}>
                                <Button type="primary" htmlType="submit" block>
                                    完成提交
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </Collapse.Panel>
            </Collapse>
        </Panel>
    )
}
export default PageSub
