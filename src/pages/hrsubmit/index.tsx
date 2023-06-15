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
    Divider,
    Popconfirm,
    Modal,
    Row,
} from 'antd'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons'
import { Panel } from '@/components/Panel'
import './index.less'
import { Auth } from '@/auth'
import fetchApi from '@/ajax/index'
import XLSX from 'xlsx'
const { Option } = Select

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
}

const stl = {
    topic: { marginRight: '10px', fontWeight: 800 },
}

const PageSub: React.FC = () => {
    const emptylist: any[] = []
    const [totalTableData, setTotalTableData] = React.useState([])
    const [tableData, setTableData] = useState(emptylist)
    const columns = [
        {
            title: '申请类型',
            dataIndex: 'offertype',
            key: 'offertype',
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
            title: '申请时间',
            dataIndex: 'createtime',
            key: 'createtime',
            render(text: string, record: any) {
                return <span></span>
            },
        },
        /*eslint-disable*/
        {
            title: '运营部审批',
            key: 'status',
            render: (text: any, record: any) => (
                <span>

                </span>
            ),
        },
        {
            title: 'hr审批',
            key: 'hrstatus',
            render: (text: any, record: any) => (
                <span>

                </span>
            ),
        },
    ]


    const onSearch =(v:String)=>{
        if(v.length==0 || v=="" || !v){
            setTableData(totalTableData)
        }else{
            const filter = tableData.filter(item => item.employeeid.includes(v) || item.name==v)
            setTableData(filter)
        }
    }

    const query = async () => {
        const result = await fetchApi('api/salary/getallemployeesalary')
        if (result.code == '200') {
            const d = result.data
            setTableData(d)
            setTotalTableData(d)
        } else {
            message.info('查询失败, 请重新提交')
        }
    }


    return (
        <Panel >
            <Input.Search placeholder="输入员工名字" allowClear onSearch={onSearch} style={{ width: 200, marginLeft: 20,marginBottom: 10 }} />
            <Table dataSource={tableData} columns={columns} size="small" id="hr-submit-table"/>
        </Panel>
    )
}
export default PageSub
