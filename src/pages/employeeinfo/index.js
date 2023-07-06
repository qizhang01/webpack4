import React, { useState, useEffect } from 'react'
import {
    Input,
    Table,
    message,
} from 'antd'
import { Panel } from '@/components/Panel'
import './index.less'
import fetchApi from '@/ajax/index'
import { PlusOutlined } from '@ant-design/icons'

const PageSub = () => {
    const emptylist = []
    const [totalTableData, setTotalTableData] = React.useState([])
    const [tableData, setTableData] = useState(emptylist)
    const columns = [
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
            title: '身份证号',
            dataIndex: 'identityid',
            key: 'identityid',
        },
        {
            title: '出生日期',
            dataIndex: 'borntime',
            key: 'borntime',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: '职位',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: '岗位',
            dataIndex: 'station',
            key: 'station',
        },
        /*eslint-disable*/
        {
            title: '入职时间',
            dataIndex: 'startworktime',
            key: 'startworktime',
        },
        {
            title: '电话',
            dataIndex: 'tel',
            key: 'tel',
        },
        {
            title: '紧急联系人1',
            dataIndex: 'emergency1',
            key: 'emergency1',
        },
        {
            title: '紧急联系人1电话',
            dataIndex: 'emergencytel1',
            key: 'emergencytel1',
        },
        {
            title: '关系',
            dataIndex: 'relationship1',
            key: 'relationship1',
        },
        {
            title: '紧急联系人2',
            dataIndex: 'emergency2',
            key: 'emergency2',
        },
        {
            title: '紧急联系人2电话',
            dataIndex: 'emergencytel2',
            key: 'emergencytel2',
        },
        {
            title: '关系',
            dataIndex: 'relationship2',
            key: 'relationship2',
        },
    ]

    useEffect(() => {
        if(document.getElementById('importEmployeeInfo')){           
            document.getElementById('importEmployeeInfo').addEventListener('change', e => {
                inputHander(e)
            })
            return document.getElementById('importEmployeeInfo').removeEventListener('change', inputHander)
        }   
    },[])

    useEffect(()=>{
        query()
    },[])

    const inputHander = (e) => {
        let data,
            workbook,
            items = [],
            excelData= []
        const files = e.target.files
        if (!/\.(xlsx|xls)$/.test(files[0].name)) {
            return alert('文件类型不正确')
        }
        let fileReader = new FileReader()

        // // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0])

        fileReader.onload = async function(ev) {
            try {
                data = ev.target.result
                workbook = XLSX.read(data, {
                    type: 'binary',
                }) // 以二进制流方式读取得到整份excel表格对象
            } catch {
                return alert('文件有错误，请重新编辑后导入')
            }

            for (let sheet in workbook.Sheets) {
                if (workbook.Sheets[sheet]) {
                    items = items.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
                    // break; // 如果只取第一张表，就取消注释这行
                }
            }

            //循环生成qrcode并自动下载到文件夹
            items.map((el, index) => {
                const employeeid = el['员工编号']
                const departmentname = el['所在现场']
                const name = el['姓名']
                const identityid = el['身份证号']
                const borntime = el['出生日期']
                const gender = el['性别']
                const position = el['职位']
                const station = el['岗位']
                const startworktime = el['入职时间']
                const tel = el['联系电话']
                const emergency1 = el['紧急联系人1']
                const emergencytel1 = el['紧急联系人1电话']
                const relationship1 = el['紧急联系人1关系']
                const emergency2 = el['紧急联系人2']
                const emergencytel2 = el['紧急联系人2电话']
                const relationship2 = el['紧急联系人2关系']
                excelData.push([
                    employeeid, departmentname, name, identityid, borntime, gender,  position,
                    station, startworktime, tel, emergency1, emergencytel1, relationship1,
                    emergency2, emergencytel2, relationship2
                ])
            })
            const userno = Auth.loginInfo.id
            const result = await fetchApi(
                'api/importallemployeeinfo',
                JSON.stringify(excelData),
                'POST'
            )
            if (result.code == '200') {
                message.info('提交成功')
                query()
            } else {
                message.info('提交失败, 请重新提交')
            }
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

    const query = async () => {
        const {roles, departmentname} = JSON.parse(localStorage.getItem("xx-auth-key"))
        const result = await fetchApi('api/applyallemployee', JSON.stringify({roles, departmentname}),'POST')
        if (result.code == '200') {
            const d = result.data
            setTableData(d)
            setTotalTableData(d)
        } else {
            message.info('查询失败, 请重新提交')
        }
    } 

    return (
        <Panel>
            <Input.Search placeholder="输入员工名字" allowClear onSearch={onSearch} style={{ width: 200, marginLeft: 20,marginBottom:10}} />
            {/* <label
                className="ant-btn ant-btn-primary"
                style={{
                    width: '160px',
                    marginLeft: 20,
                }}
            >
                <PlusOutlined /> 导入excel文件
                <input id="importEmployeeInfo" type="file" style={{ display: 'none' }} />
            </label> */}
            <Table dataSource={tableData} columns={columns} size="small" id="employee-table"/>
        </Panel>
    )
}
export default PageSub
