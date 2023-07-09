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
    Divider,
    Popconfirm,
} from 'antd'
import { Panel } from '@/components/Panel'
import './index.less'
import fetchApi from '@/ajax/index'


const PageSub = () => {
    const emptylist = []
    const [totalTableData, setTotalTableData] = React.useState([])
    const [tableData, setTableData] = useState(emptylist)
    const [addsalarytableData, setAddSalaryTableData] = useState(emptylist)
    const [overworktableData, setOverworkTableData] = useState(emptylist)
    const [buttonkey, setButtonkey] = useState(1)
    const cache = localStorage.getItem('xx-auth-key')
        ? JSON.parse(localStorage.getItem('xx-auth-key'))
        : null
    const roles = cache.roles
    const columns = [
        {
            title: '申请类型',
            dataIndex: 'type',
            key: 'type',
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
        },
        {
            title: '申请人',
            dataIndex: 'offerpersonname',
            key: 'offerpersonname',
        },
        /*eslint-disable*/
        
        {
            title: '运营部审批',
            key: 'status',
            render: (text, record) => {
                if(record.operatestatus){
                    return (<span style={{color: "#1890ff"}}>{record.operatestatus=="Y"?"已同意":"未通过"}</span>)
                }
                if(roles.includes('OPERATE')){
                    return (
                        <span>
                            <a href="javascript:;" onClick={() => agree(record, 1)}>
                                同意
                            </a>
                            <Divider type="vertical"/>
                            <Popconfirm title="确定拒绝?" onConfirm={() => reject(record,1)}>
                                <a>拒绝</a>
                            </Popconfirm>
                        </span>
                    )
                }
            } 
        },
        {
            title: 'hr审批',
            key: 'hrstatus',
            render: (text, record) => {
                if(record.hrstatus){
                    return (
                        <span>
                            {record.hrstatus =="Y"?"已知晓":"未处理"}
                        </span>
                    )
                }
                if(roles.includes('HR')){
                    return (
                        <span>
                            <a href="javascript:;" onClick={() => knowledged(record,1)}>
                                未处理
                            </a>
                        </span>
                    )
                }
            }
        },
    ]
    const columnsoverwork = [
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
            title: '开始加班时间',
            dataIndex: 'startoverworktime',
            key: 'startoverworktime',
        },
        {
            title: '结束加班时间',
            dataIndex: 'endoverworktime',
            key: 'endoverworktime'
        },
        {
            title: '申请时间',
            dataIndex: 'createtime',
            key: 'createtime',
        },
        {
            title: '申请人',
            dataIndex: 'submitname',
            key: 'submitname',
        },
        /*eslint-disable*/
        
        {
            title: '运营部审批',
            key: 'status',
            render: (text, record) => {
                if(record.operatestatus){
                    return (<span style={{color: "#1890ff"}}>{record.operatestatus=="Y"?"已同意":"未通过"}</span>)
                }
                if(roles.includes('OPERATE')){
                    return (
                        <span>
                            <a href="javascript:;" onClick={() => agree(record, 2)}>
                                同意
                            </a>
                            <Divider type="vertical"/>
                            <Popconfirm title="确定拒绝?" onConfirm={() => reject(record,2)}>
                                <a>拒绝</a>
                            </Popconfirm>
                        </span>
                    )
                }
            }  
        },
        {
            title: 'hr审批',
            key: 'hrstatus',
            render: (text, record) => {
                if(record.hrstatus){
                    return (
                        <span>
                            {record.hrstatus =="Y"?"已知晓":"未处理"}
                        </span>
                    )
                }
                if(roles.includes('HR')){
                    return (
                        <span>
                            <a href="javascript:;" onClick={() => knowledged(record,2)}>
                                未处理
                            </a>
                        </span>
                    )
                }
            },
        },
    ]
    const columnsaddsalary = [
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
            title: '目前薪水',
            dataIndex: 'nowsalary',
            key: 'nowsalary',
        },
        {
            title: '期望薪水',
            dataIndex: 'expectedsalary',
            key: 'expectedsalary',
        },
        {
            title: '薪水类型',
            dataIndex: 'salarytype',
            key: 'salarytype',
        },
        
        {
            title: '申请时间',
            dataIndex: 'createtime',
            key: 'createtime',
        },
        {
            title: '申请人',
            dataIndex: 'submitname',
            key: 'submitname',
        },
        /*eslint-disable*/
        
        {
            title: '运营部审批',
            key: 'status',
            render: (text, record) => {
                if(record.operatestatus){
                    return (<span style={{color: "#1890ff"}}>{record.operatestatus=="Y"?"已同意":"未通过"}</span>)
                }
                if(roles.includes('OPERATE')){
                    return (
                        <span>
                            <a href="javascript:;" onClick={() => agree(record, 3)}>
                                同意
                            </a>
                            <Divider type="vertical"/>
                            <Popconfirm title="确定拒绝?" onConfirm={() => reject(record,3)}>
                                <a>拒绝</a>
                            </Popconfirm>
                        </span>
                    )
                }
            } 
        },
        {
            title: 'hr审批',
            key: 'hrstatus',
            render: (text, record) =>{
                if(record.hrstatus){
                    return (
                        <span>
                            {record.hrstatus =="Y"?"已知晓":"未处理"}
                        </span>
                    )
                }
                if(roles.includes('HR')){
                    return (
                        <span>
                            <a href="javascript:;" onClick={() => knowledged(record,3)}>
                                未处理
                            </a>
                        </span>
                    )
                }
            }
        },
    ]
    useEffect(()=>{
        if(buttonkey==1){
            query()
        }else if(buttonkey==2){
            queryForOvertimework()
        }else if(buttonkey==3){
            queryAddSalary()
        }
    },[buttonkey])
    
    const refresh=(type)=>{
        if(type==1){
            query()
        }else if(type==2){
            queryForOvertimework()
        }else if(type==3){
            queryAddSalary()
        }
    }
    const agree =async (record, type)=>{
        const {id }=record
        const result = await fetchApi(`api/submitoperate`, JSON.stringify({type, id, operatestatus: 'Y'}), 'POST')
        if (result.code == '200') {
            refresh(type)
        } else {
            message.info('提交失败, 请重新提交')
        }
    }

    const onSearch =(v)=>{
        if(v.length==0 || v=="" || !v){
            setTableData(totalTableData)
        }else{
            const filter = tableData.filter(item => item.employeeid.includes(v) || item.name==v)
            setTableData(filter)
        }
    }

    const reject = async (record, type)=>{
        const { id }=record
        const result = await fetchApi(`api/submitoperate`, JSON.stringify({type, id, operatestatus: 'N'}), 'POST')
        if (result.code == '200') {
            message.info(`删除成功`)
            refresh(type)
        } else {
            message.info('提交失败, 请重新提交')
        }
    }

    const knowledged = async (record, type)=>{
        const { id }=record
        const result = await fetchApi(`api/submithr`, JSON.stringify({type, id, hrstatus: 'Y'}), 'POST')
        if (result.code == '200') {
            message.info(`删除成功`)
            refresh(type)
        } else {
            message.info('提交失败, 请重新提交')
        }
    }

    const query = async () => {
        const result = await fetchApi('api/getonoroffworkstatus')
        if (result.code == '200') {
            const d = result.data
            setTableData(d)
            setTotalTableData(d)
        } else {
            message.info('查询失败, 请重新提交')
        }
    } 
    //applyforaddsalarystatus
    const queryAddSalary = async () => {
        const result = await fetchApi('api/applyforaddsalarystatus')
        if (result.code == '200') {
            const d = result.data
            setAddSalaryTableData(d)
        } else {
            message.info('查询失败, 请重新提交')
        }
    } 

    //applyforovertimeworkstatus
    const queryForOvertimework = async () => {
        const result = await fetchApi('api/applyforovertimeworkstatus')
        if (result.code == '200') {
            const d = result.data
            setOverworkTableData(d)
        } else {
            message.info('查询失败, 请重新提交')
        }
    } 

    const handleButtonClick=(key)=>{
       if(buttonkey==key) return
       setButtonkey(key)
    }
    return (
        <Panel>
            <Input.Search placeholder="输入员工名字" allowClear onSearch={onSearch} style={{ width: 200, marginLeft: 20,marginBottom:10}} />
            <Button style={{marginLeft: 30}} type={buttonkey==1?"primary":"default"} onClick={()=>handleButtonClick(1)}>入职/离职</Button>
            <Button style={{marginLeft: 30}} type={buttonkey==2?"primary":"default"} onClick={()=>handleButtonClick(2)}>加班申请</Button > 
            <Button style={{marginLeft: 30}} type={buttonkey==3?"primary":"default"} onClick={()=>handleButtonClick(3)}>加薪申请</Button>
            {buttonkey==1 &&<Table dataSource={tableData} columns={columns} size="small" id="operate-submit-table"/>}
            {buttonkey==2 &&<Table dataSource={overworktableData} columns={columnsoverwork} size="small" id="operate-submit-table"/>}
            {buttonkey==3 &&<Table dataSource={addsalarytableData} columns={columnsaddsalary} size="small" id="operate-submit-table"/>}
        </Panel>
    )
}
export default PageSub
