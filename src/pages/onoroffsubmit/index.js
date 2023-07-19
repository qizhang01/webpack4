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
    DatePicker,
    Tabs,
} from 'antd'
import moment from 'moment';
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
    const [nowsalarytip, setNowsalaryTip] = useState(null)
    const info = window.localStorage.getItem(AUTH_KEY)
    const defaultdepartmentname = info ? JSON.parse(info).departmentname : ''

    const overworkreason = "" //加班理由
    const startoverworktime =""
    const endoverworktime = ""
    const nowsalary = 0
    const [method, setMethod] = useState('入职')

    useEffect(() => {
        fetchEmployee()
    }, [])

    const fetchEmployee = async () => {
        const {roles, departmentname} = JSON.parse(localStorage.getItem("xx-auth-key"))
        const result = await fetchApi('api/applyallemployee', JSON.stringify({roles, departmentname}),'POST')
        if (result.code == '200') {
            const d = result.data
            setEmployeeList(d)
        } else {
            message.info('查询失败, 请重新提交')
        }
    }

    const onFinish = async (values) => {
        if (key == 1) { 
            let result;
            if(method=='入职'){
                const { 
                    departmentname, identityid, tel, 
                    emergency1="", emergencytel1="", relationship1="",
                    emergency2="", emergencytel2 ="", relationship2="",
                    position="", station="", gender, startworktime
                } = values
                if(identityid.length!==18 && identityid.length!==16) {
                    return message.info('身份证位数不正确, 请重新输入')
                }
                const submitname = info ? JSON.parse(info).name : ''
                // submitonoroff
                const body = {
                    type: method,
                    name: values.name,
                    departmentname: departmentname? departmentname: defaultdepartmentname,
                    submitname,
                    identityid,
                    gender,
                    tel,
                    emergency1,
                    emergencytel1,
                    relationship1,
                    emergency2,
                    emergencytel2,
                    relationship2,
                    position,
                    startworktime: onTimeChangeNohour(startworktime),
                    station
                } 
                result = await fetchApi('api/submitonwork', JSON.stringify(body), 'POST')                                 
            }else{
                const identityid = values.identityid
                const startworktime = values.startworktime
                const submitname = info ? JSON.parse(info).name : ''
                const filteritem = employeelist.filter(item=>item.identityid==identityid)
                const body = {
                    type: method,
                    name: filteritem[0].name,
                    departmentname: defaultdepartmentname,
                    startworktime: onTimeChangeNohour(startworktime),
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
        } else if(key==2){
            const { time, reason } = values
            const {name, departmentname} = JSON.parse(localStorage.getItem("xx-auth-key"))
            const body = {
                overtimeworklist,
                startoverworktime: onTimeChange(time[0]),
                endoverworktime: onTimeChange(time[1]),
                overworkreason: reason,
                submitname: name,
                departmentname
            }
            const result = await fetchApi('api/submitovertimework', JSON.stringify(body), 'POST')
            if (result.code == '200') {
                message.info('申请成功')
                setOvertimeWorklist([])
            } else {
                message.info('申请失败, 请重新提交')
            }
        } else if (key == 3) {
            const { employeeid, salarytype="日薪", expectedsalary } = values
            const {name, departmentname} = JSON.parse(localStorage.getItem("xx-auth-key"))
            const filterItem = employeelist.filter(item=>item.employeeid == employeeid)
            const body = {
                employeeid,
                salarytype,
                nowsalary,
                expectedsalary,
                departmentname: filterItem[0].departmentname,
                submitname: name,
                name: filterItem[0].name
            }
            const result = await fetchApi('api/salary/submitaddsalary', JSON.stringify(body), 'POST')
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

    const selectDepartment = (value) => {
        const filterItem = employeelist.filter(item=>item.identityid == value)
        if(overtimeworklist.filter(item=>item.identityid==value).length==0){
            const newlist = [
                ...overtimeworklist,
                filterItem[0]
            ]
            setOvertimeWorklist(newlist)
        }
    }

    const handleSelectOfAddsalary = async (value) => {
        const result = await fetchApi('api/salary/getemployeesalarybyid', JSON.stringify({employeeid: value}), 'POST')
        if (result.code == '200') {
            if(result.data.length > 0){
                let data = result.data[0]
                if(data.salarytype=="按比例核定"){
                    setNowsalaryTip(`月薪-${data.salaryday}`)
                }else{
                    setNowsalaryTip(`${data.salarytype}-${data.salaryday}`)
                }
                nowsalary = data.salaryday
            }
        } else {
            message.info('获取员工薪水信息失败')
        }
    }

    const handleClick = async () => {
        const {name, departmentname} = JSON.parse(localStorage.getItem("xx-auth-key"))
        const body = {
            overtimeworklist,
            startoverworktime,
            endoverworktime,
            overworkreason,
            submitname: name,
            departmentname
        }
        const result = await fetchApi('api/submitovertimework', JSON.stringify(body), 'POST')
        if (result.code == '200') {
            message.info('申请成功')
        } else {
            message.info('申请失败, 请重新提交')
        }
    }
    const handleClose = (identityid) => {
        const newlist = overtimeworklist.filter(el=>el.identityid!=identityid)
        setOvertimeWorklist([...newlist])
    }

    const onTimeChange = ( dateStrings) => {
        const date = new Date(dateStrings);
        const minutes = date.getMinutes()<10 ? `0${date.getMinutes()}`: date.getMinutes()
        return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' 
            + minutes
    }

    const onTimeChangeNohour = (dateStrings) => {
        const date = new Date(dateStrings);
        return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
    }

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

                        {method!="离职" ?
                        <>
                            <Form.Item
                                name="name"
                                label="姓名"
                                rules={[{ required: true, message: '必须输入姓名' }]}
                            >
                                <Input placeholder="请输入姓名" style={{ width: 280 }} />
                            </Form.Item>
                            <Form.Item
                                name="gender"
                                label="性别"
                                rules={[{ required: true, message: '必须输入性别' }]}
                            >
                                <Select
                                    style={{ width: 280 }}
                                    placeholder="请选择性别"
                                >
                                    <Option value="男">男</Option>
                                    <Option value="女">女</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="identityid"
                                label="身份证号"
                                rules={[{ required: true, message: '必须输入身份证号' }]}
                            >
                                <Input placeholder="请输入身份证号" style={{ width: 280 }} />
                            </Form.Item>
                            <Form.Item
                                name="position"
                                label="职位"
                            >
                                <Input placeholder="请输入职位" style={{ width: 280 }} />
                            </Form.Item>
                            <Form.Item
                                name="station"
                                label="岗位"
                            >
                                <Input placeholder="请输入岗位" style={{ width: 280 }} />
                            </Form.Item>
                            <Form.Item name="startworktime" label="入职时间" rules={[{ required: true, message: '必须输入入职时间' }]}>
                                <DatePicker style={{ width: 280}}/>
                            </Form.Item>
                            <Form.Item
                                name="tel"
                                label="联系方式"
                                rules={[{ required: true, message: '必须输入联系方式' }]}
                            >
                                <Input placeholder="请输入联系方式" style={{ width: 280 }} />
                            </Form.Item>
                            <Form.Item
                                name="emergency1"
                                label="紧急联系人1"
                            >
                                <Input placeholder="请输入紧急联系人" style={{ width: 280 }} />
                            </Form.Item>
                            <Form.Item
                                name="emergencytel1"
                                label="紧急联系方式1"
                            >
                                <Input placeholder="请输入紧急联系方式" style={{ width: 280 }} />
                            </Form.Item>
                            <Form.Item
                                name="relationship1"
                                label="关系"
                            >
                                <Input placeholder="请输入关系" style={{ width: 280 }} />
                            </Form.Item>
                            <Form.Item
                                name="emergency2"
                                label="紧急联系人2"
                            >
                                <Input placeholder="请输入紧急联系人" style={{ width: 280 }} />
                            </Form.Item>
                            <Form.Item
                                name="emergencytel2"
                                label="紧急联系方式2"
                            >
                                <Input placeholder="请输入紧急联系方式" style={{ width: 280 }} />
                            </Form.Item>
                            <Form.Item
                                name="relationship2"
                                label="关系"
                            >
                                <Input placeholder="请输入关系" style={{ width: 280 }} />
                            </Form.Item>
                        </>:
                        <>
                            <Form.Item
                                name="identityid"
                                label="请选择姓名"
                            >
                                <Select
                                    placeholder="请选择员工姓名"
                                    style={{ width: 280, display: 'block' }}
                                >
                                    {employeelist.map(item => (
                                        <Option value={item.identityid} key={item.id}>
                                            {`${item.name}  ${item.identityid.substring(13)}`}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="startworktime" label="离职时间" rules={[{ required: true, message: '必须输入离职时间' }]}>
                                <DatePicker style={{ width: 280}}/>
                            </Form.Item>
                        </>
                        }
     
                        <Form.Item
                            name="departmentname"
                            label="项目部"
                        >
                            <span>{defaultdepartmentname}</span>
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
                    <Form name="config-form-onoroff" {...formItemLayout} onFinish={onFinish}>
                    <Form.Item label="姓名" rules={[{ required: true, message: '必须选择加班名单' }]}>
                        <Select
                            placeholder="请选择员工姓名"
                            style={{ width: 280, display: 'block' }}
                            onChange={selectDepartment}
                        >
                            {employeelist.map(item => (
                                <Option value={item.identityid} key={item.id}>
                                    {`${item.name}  ${item.identityid.substring(13)}`}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item> 
                    <Form.Item label="加班名单">
                            <Space size={[0, 8]} wrap>
                                {overtimeworklist.map((item) => (
                                    <Tag
                                        color="gold"
                                        key={item.identityid}
                                        closable
                                        onClose={() => handleClose(item.identityid)}
                                    >
                                        {item.name}
                                    </Tag>
                                ))}
                            </Space>
                        </Form.Item>
                        <Form.Item label="加班时间区间" name="time" rules={[{ required: true, message: '必须输入加班日期' }]}>
                            <DatePicker.RangePicker
                                showTime={{
                                    hideDisabledOptions: true,
                                    defaultValue: [moment('00:00', 'HH:mm'), moment('11:59', 'HH:mm')],
                                }}
                                format="YYYY-MM-DD HH:mm"
                                />
                        </Form.Item>

                        <Form.Item label="加班原因" name="reason" rules={[{ required: true, message: '必须输入加班原因' }]}>
                            <Input
                                placeholder="请输入加班原因"
                                style={{ width: 280}}
                             />
                        </Form.Item>                   
                        <Form.Item wrapperCol={{ span: 3, offset: 9 }}>
                            <Button type="primary" htmlType="submit" block>
                                完成提交
                            </Button>
                        </Form.Item>
                    </Form>
                </Collapse.Panel>
                <Collapse.Panel header="调薪申请" key="3">
                    <Form name="config-form-salary" {...formItemLayout} onFinish={onFinish}>
                        <Form.Item name="employeeid" label="姓名">
                            <Select
                                placeholder="请选择员工姓名"
                                style={{ width: 280, display: 'block' }}
                                onChange ={handleSelectOfAddsalary}
                            >
                                {employeelist.map(item => (
                                    <Option value={item.employeeid} key={item.id}>
                                        {`${item.name}  ${item.identityid.substring(13)}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="salarytype" label="日薪/月薪">
                            <Select
                                defaultValue="日薪"
                                style={{ width: 180 }}
                            >
                                <Option value="日薪">日薪</Option>
                                <Option value="月薪">月薪</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="nowsalary" label="当前薪水">
                            <span>{nowsalarytip}</span>
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
