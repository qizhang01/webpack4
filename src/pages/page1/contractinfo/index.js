import React, { useState, useEffect } from 'react'
import { Panel } from '@/components/Panel'
import fetchApi from '@/ajax/index'
import { Form, Input, Table, Button, Tabs, Checkbox,InputNumber} from 'antd'
import { Auth } from '@/auth'
import Icon, { PlusOutlined,SearchOutlined } from '@ant-design/icons'

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
            <a onClick={()=>toSignAgain(record.employeeid)}>签约</a>
            <a onClick={()=>toLog(record.employeeid)}>历史</a>
          </Space>
        ),
    },
]

toSignAgain = (employeeid) =>{

}

toLog = (employeeid)=>{

}

const onFinish= async (values)=>{

}

const ContractInput =() =>{
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 12 },
    }
    return (
        <Form name="config-form-onoroff" {...formItemLayout} onFinish={onFinish}>
            <Form.Item label="姓名">
                <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item label="身份证号">
                <Input placeholder="请输入身份证号" />
            </Form.Item>
            <Form.Item label="项目部">
                <Input placeholder="请输入项目部" />
            </Form.Item>
            <Form.Item label="签约次数">
                <InputNumber min={1} max={10} placeholder="请选择签约次数"/>
            </Form.Item>
            <Form.Item label="是否完成签约">
                <Checkbox>签约完成</Checkbox>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 8, offset: 9 }}>
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

    useEffect(() =>{
        getcontractinfo()
    },[] )

    const getcontractinfo = async ()=> {
        const result = await fetchApi('api/getcontractinfo')
        if (result.code == 200) {
            setDataSource(result.data)
        }
    }

    const search =()=>{
        // if(searchName){
        //     const d = tableOrginData.filter(item=>item.name.includes(searchName))
        //     setDataSource(d)
        // }else{
        //     setDataSource(tableOrginData)
        // }
    }

    return (loginInfo.roles.includes('ADMIN') ? 
        <Panel>
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="合同概览" key="1">
                    <Input placeholder="请输入员工名称" value={searchName} onChange={e=> setSearchName(e.target.value)} style={{width: 160, marginRight: 20}}/>
                    <Button
                            onClick={search}
                            type="primary"
                            icon={<SearchOutlined />}
                        >
                            搜索
                    </Button>
                    <Table dataSource={dataSource} columns={columns} size='small'/>;
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