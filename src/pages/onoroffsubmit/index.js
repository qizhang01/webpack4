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

    useEffect(() => {
        fetchEmployee()
    }, [])
    const fetchEmployee = () => {}
    const onFinish = async (values) => {
        if (key == 1) {
            console.log(key)
            const { type, name, departmentname } = values
            const submitname = info ? JSON.parse(info).name : ''
            // submitonoroff
            const body = {
                type,
                name,
                departmentname,
                submitname,
            }
            const result = await fetchApi('api/submitonoroff', JSON.stringify(body), 'POST')
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

    React.useEffect(() => {
        if(document.getElementById('importdepart')){           
            document.getElementById('importdepart')?.addEventListener('change', e => {
                inputHander(e)
            })
            return document.getElementById('importdepart')?.removeEventListener('change', inputHander)
        }   
    })
    
    const inputHander = (e) => {
        let data,
            workbook,
            items = [],
            lastJson={}
        const files = e.target.files
        if (!/\.(xlsx|xls)$/.test(files[0].name)) {
            return alert('文件类型不正确')
        }
        let fileReader = new FileReader()

        // // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0])

        fileReader.onload = async function(ev) {
            try {
                data = ev.target?.result
                workbook = XLSX.read(data, {
                    type: 'binary',
                }) // 以二进制流方式读取得到整份excel表格对象
            } catch {
                return alert('文件有错误，请重新编辑后导入')
            }

            // // 遍历每张表读取
            for (let sheet in workbook.Sheets) {
                if (workbook.Sheets[sheet]) {
                    items = items.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
                    // break; // 如果只取第一张表，就取消注释这行
                }
            }
            items.map((el, index) => {
                const id = el["员工编号"]
                const departmentname = el["所在现场"]
                // const identityid = el["身份证号"]
                // const period = el["入职时间"]
                // const telephone = el["联系电话"]
                lastJson[id]= departmentname
            }) 
            const result = await fetchApi(
                'api/salary/updatedepartment',
                JSON.stringify(lastJson),
                'POST'
            )
        }
    }
    const selectMethod = () => {}
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
                        <label
                            className="ant-btn ant-btn-primary"
                            style={{
                                width: '160px',
                                marginBottom: 6,
                                marginLeft: 6,
                                marginRight: 60
                            }}
                        >
                            <UploadOutlined /> 导入excel文件
                            <input id="importdepart" type="file" style={{ display: 'none' }} />
                        </label>
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
