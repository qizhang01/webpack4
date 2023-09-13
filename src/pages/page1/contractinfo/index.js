import React, { useState, useEffect } from 'react'
import { Panel } from '@/components/Panel'
import fetchApi from '@/ajax/index'
import { Form, Input, Table, Button, Tabs, Space,InputNumber, DatePicker, Select, Timeline, Modal} from 'antd'
import Icon, { PlusOutlined,SearchOutlined } from '@ant-design/icons'
const { Option } = Select

const ContractInput =() =>{
    const [employeelist, setEmployeeList] = useState([])
    const [identityid, setIdentityid] = useState("")
    const [departmentname, setDepartmentname] = useState("")
    const [employeeid, setEmployeeid] = useState("")
    const stl = { width: 280}
    const [employeeType,setEmployeetype ]= useState("4")
    useEffect(()=>{
        fetchEmployee()
    },[])
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 12 },
    }
    const onFinish= async (values)=>{
        console.log(values,"3333333333333333333333333")
    }
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

    const selectEmployee = (identityid)=>{
        setIdentityid(identityid)
        let d = employeelist.filter(item => item.identityid==identityid)
        setDepartmentname(d[0].departmentname)
        setEmployeeid(d[0].employeeid)
    }
    const selectEmployeeType = (key)=>{
        setEmployeetype(key)
    }

    return (
        <Form name="config-form-onoroff" {...formItemLayout} onFinish={onFinish}>
            <Form.Item
                name="name"
                label="请选择姓名"
                rules={[{ required: true, message: '必须选择员工' }]}
            >
                <Select
                    placeholder="请选择员工姓名"
                    style={{ width: 280, display: 'block' }}
                    onChange={selectEmployee}
                >
                    {employeelist.map(item => (
                        <Option value={item.identityid} key={item.id}>
                            {`${item.name}  ${item.identityid.substring(13)}`}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="type"
                label="请选择合同种类"
                rules={[{ required: true, message: '必须选择一种类型'}]}
            >
                <Select
                    placeholder="请选择类型"
                    style={{ width: 280, display: 'block' }}
                    onChange={selectEmployeeType}
                >
                    <Option value="提前离职" key="1">提前离职</Option>
                    <Option value="到期离职" key="2">到期离职</Option>
                    <Option value="到期续约" key="3">到期续约</Option>
                    <Option value="首次入职" key="4">首次入职</Option>
                </Select>
            </Form.Item>
            <Form.Item label="身份证号">
                <Input placeholder="请输入身份证号" value={identityid} disabled />
            </Form.Item>
            <Form.Item label="员工编号">
                <Input placeholder="请输入员工编号" value={employeeid} disabled />
            </Form.Item>
            <Form.Item label="项目部">
                <Input placeholder="请输入项目部" value={departmentname} disabled />
            </Form.Item>
            <Form.Item label="用人单位" name="company">
                <Input placeholder="请输入单位" style={stl}/>
            </Form.Item>
            {employeeType=="4" && 
                <Form.Item name="firsttime" label="初次入职时间" rules={[{ required: true, message: '必须输入签约时间' }]}>
                    <DatePicker style={stl}/>
                </Form.Item>
            }
            <Form.Item label="合同类型" name="contracttype" rules={[{ required: true, message: '必须输入合同类型' }]}>
                <Input placeholder="请输入合同类型" style={stl}/>
            </Form.Item>
            <Form.Item label="员工类型" name="employeetype" rules={[{ required: true, message: '必须输入员工类型' }]}>
                <Input placeholder="请输入员工类型" style={stl}/>
            </Form.Item>
            <Form.Item label="签约次数" name="number" rules={[{ required: true, message: '必须选择签约次数' }]}>
                <InputNumber min={1} max={10} placeholder="请选择签约次数"/>
            </Form.Item>
            <Form.Item name="signstarttime" label="签约起始时间" rules={[{ required: true, message: '必须输入签约时间' }]}>
                <DatePicker style={stl}/>
            </Form.Item>
            <Form.Item name="signendtime" label="签约终止时间" rules={[{ required: true, message: '必须输入签约时间' }]}>
                <DatePicker style={stl}/>
            </Form.Item>
            <Form.Item label="社保缴纳地" name="sbaoaddress">
                <Input placeholder="请输入社保缴纳地" style={stl}/>
            </Form.Item>
            <Form.Item name="sbaotime" label="缴纳时间" >
                <DatePicker style={stl}/>
            </Form.Item>
            <Form.Item label="社保转移地" name="sbaochangeaddress">
                <Input placeholder="请输入社保转移地" style={stl}/>
            </Form.Item>
            <Form.Item name="sbaochangetime" label="社保转移时间" >
                <DatePicker style={stl}/>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 6, offset: 9 }}>
                <Button type="primary" htmlType="submit" block>
                    完成提交
                </Button>
            </Form.Item>
        </Form>  
    )
}

const PageSub = () => {
    const [dataSource, setDataSource] = useState([])
    const loginInfo = JSON.parse(localStorage.getItem('xx-auth-key') || '')
    const [searchName, setSearchName] = useState(undefined)
    const [tableloading,setTableloading] = useState(true)
    const tableOrginData = []
    const columns = [
        {
            title: '合同编号',
            dataIndex: 'contractid',
            key: 'contractid',
        },
        {
            title: '员工编号',
            dataIndex: 'employeeid',
            key: 'employeeid',
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '项目部',
            dataIndex: 'departmentname',
            key: 'departmentname',
        },
        {
            title: '初次入职时间',
            dataIndex: 'firstworktime',
            key: 'firstworktime',
        },
        {
            title: '入职声明时间',
            dataIndex: 'announcetime',
            key: 'announcetime',
        },
        {
            title: '用人单位',
            dataIndex: 'companyserve',
            key: 'companyserve',
        },
        {
            title: '员工类型',
            dataIndex: 'jobtype',
            key: 'jobtype',
            // render: (_, record) => <a></a>,
        },
        {
            title: '合同类型',
            dataIndex: 'contracttype',
            key: 'contracttype',
        },
        {
            title: '合同起始日期',
            dataIndex: 'starttime',
            key: 'starttime',
        },
        {
            title: '合同结束日期',
            dataIndex: 'endtime',
            key: 'endtime',
        },
        {
            title: '社保缴纳地',
            dataIndex: 'sbaoaddress',
            key: 'sbaoaddress',
        },
        {
            title: '缴纳时间',
            dataIndex: 'sbaotime',
            key: 'sbaotime',
        },
        {
            title: '社保转移地',
            dataIndex: 'sbaochangeaddress',
            key: 'sbaochangeaddress',
        },
        {
            title: '社保转移时间',
            dataIndex: 'sbaochangetime',
            key: 'sbaochangetime',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
              <Space size="middle">
                <a onClick={() => toLog(record)}>签约历史</a>
                {/* <a>签约历史</a> */}
              </Space>
            ),
        },
    ]
    
    const toLog = (record)=>{
        const config = {
            title: '签约历史',
            content: (
                <Timeline>
                    <Timeline.Item>第一次 {record.firstworktime}</Timeline.Item>
                    <Timeline.Item>第二次 2019/09/01</Timeline.Item>
                </Timeline>
            ),
            onOk() {},
        }
        Modal.info(config)
    }


    useEffect(() =>{
        getcontractinfo()
    },[])

    const getcontractinfo = async ()=> {
        const result = await fetchApi('api/getcontractinfo')
        if (result.code == 200) {
            setDataSource(result.data)
            tableOrginData = result.data
        }
        setTableloading(false)
    }

    const onChange = (key) => {
        if(key==1){
            getcontractinfo()
        }
    };

    const search =()=>{
        if(searchName){
            const d = tableOrginData.filter(item=>item.name.includes(searchName))
            setDataSource(d)
        }else{
            setDataSource(tableOrginData)
        }
    }

    return (loginInfo.roles.includes('ADMIN') ? 
        <Panel>
            <Tabs defaultActiveKey="1" onChange={onChange}>
                <Tabs.TabPane tab="合同概览" key="1">
                    <Input placeholder="请输入员工名称" value={searchName} onChange={e=> setSearchName(e.target.value)} style={{width: 160, marginRight: 20}}/>
                    <Button
                            onClick={search}
                            type="primary"
                            icon={<SearchOutlined />}
                        >
                            搜索
                    </Button>
                    <Table dataSource={dataSource} loading ={tableloading} columns={columns} size='small'/>;
                </Tabs.TabPane>

                <Tabs.TabPane tab="合同录入" key="2">
                    <ContractInput />
                </Tabs.TabPane>
            </Tabs>
        </Panel>: 
        <div>功能尚未完善</div>
    )
}

export default PageSub