import React, { useState, useEffect } from 'react'
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

const PageSub= () => {
    const [key, setkey] = useState(1)
    const [employeelist, setEmployeeList] = useState([])
    const [overtimeworklist, setOvertimeWorklist] = useState([])
    const [nowsalary, setNowsalary] = useState(null)
    const info = window.localStorage.getItem(AUTH_KEY)
    const departmentname = info ? JSON.parse(info).departmentname : ''
    
    const [method, setMethod] = useState('入职')

    useEffect(() => {
        fetchEmployee()
    }, [])

    const fetchEmployee = () => {

    }

    const onFinish = async (values) => {
        if (key == 1) { 
            let result;
            if(method=='入职'){
                const { type, name, departmentname, identityid, tel, emergency, emergencytel } = values
                const submitname = info ? JSON.parse(info).name : ''
                // submitonoroff
                const body = {
                    type,
                    name,
                    departmentname,
                    submitname,
                    identityid,
                    tel,
                    emergency,
                    emergencytel
                } 
                result = await fetchApi('api/submitonwork', JSON.stringify(body), 'POST')                                 
            }else{
                const { type, name, departmentname, identityid } = values
                const submitname = info ? JSON.parse(info).name : ''
                const body = {
                    type,
                    name,
                    departmentname,
                    submitname,
                    identityid
                } 
                result = await fetchApi('api/submitoffwork', JSON.stringify(body), 'POST')
            }

            if (result.code == '200') {
                message.info('申请成功')
            } else {
                message.info('申请失败, 请重新提交')
            }
        } else if (key == 3) {
            const { name, salarytype, expectedsalary } = values
            const body = {
                name,
                salarytype,
                nowsalary,
                expectedsalary,
            }
            const result = await fetchApi('api/submitaddsalary', JSON.stringify(body), 'POST')
            if (result.code == '200') {
                message.info('申请成功')
            } else {
                message.info('申请失败, 请重新提交')
            }
        }
    }

    const onChange = (key) => {
        setkey(key)
    }
    
    const selectMethod = (value) => {setMethod(value)}
    const selectDepartment = () => {}
    const selectSalaryType = () => {}
    const handleClick = () => {}
    const handleClose = (index) => {}
    const onRangeChange = (dates, dateStrings) => {}
    const handleInput = (v) => {}
    return (
        <Panel>
            <Collapse onChange={onChange} accordion>
                <Collapse.Panel header="入职离职申请" key="1">
                    <Form name="config-form-onoroff" {...formItemLayout} onFinish={onFinish}>
                        <Form.Item name="type" label="入职/离职">
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
                            name="identityid"
                            label="身份证号"
                            rules={[{ required: true, message: '必须输入身份证号' }]}
                        >
                            <Input placeholder="请输入身份证号" style={{ width: 280 }} />
                        </Form.Item>

                        {method!="离职" && 
                            <Form.Item
                                name="tel"
                                label="联系方式"
                                rules={[{ required: true, message: '必须输入联系方式' }]}
                            >
                                <Input placeholder="请输入联系方式" style={{ width: 280 }} />
                            </Form.Item>
                        }
                        {method!="离职" && 
                            <Form.Item
                                name="emergency"
                                label="紧急联系人"
                            >
                                <Input placeholder="请输入紧急联系人" style={{ width: 280 }} />
                            </Form.Item>
                        }
                        {method!="离职" && 
                            <Form.Item
                                name="emergencytel"
                                label="紧急联系方式"
                            >
                                <Input placeholder="请输入紧急联系方式" style={{ width: 280 }} />
                            </Form.Item>
                        }
                        {method!="离职" && 
                            <Form.Item
                                name="departmentname"
                                label="项目部"
                                rules={[{ required: true, message: '必须输入项目部' }]}
                            >
                                <Input
                                    placeholder="请输入项目部"
                                    style={{ width: 280 }}
                                    defaultValue={departmentname}
                                />
                            </Form.Item>
                        }
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
                            {employeelist.map(item => (
                                <Option value={item.name} key={item.id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                        <div style={{ marginTop: 20, marginBottom: 20 }}>
                            <Space size={[0, 8]} wrap>
                                {overtimeworklist.map((item) => (
                                    <Tag
                                        color="gold"
                                        key={item.id}
                                        closable
                                        onClose={item => handleClose(item)}
                                    >
                                        {item.name}
                                    </Tag>
                                ))}
                            </Space>
                        </div>
                        <TimePicker.RangePicker
                            style={{ width: 280, marginBottom: 20 }}
                            onChange={onRangeChange}
                        />
                        加班原因:
                        <input
                            placeholder="请输入姓名"
                            style={{ width: 280 }}
                            onChange={handleInput}
                        />
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
                    <Form name="config-form-salary" {...formItemLayout} onFinish={onFinish}>
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
                            <span>{nowsalary}</span>
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
