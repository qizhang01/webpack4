import React, { useState, useEffect } from 'react'
import { Panel } from '@/components/Panel'
import XLSX from 'xlsx'
import fetchApi from '@/ajax/index'
import { message, Input, Table, Button } from 'antd'
import { Auth } from '@/auth'
import Icon, { PlusOutlined,SearchOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'

const columns = [
    {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '商品编号',
        dataIndex: 'goodsno',
        key: 'goodsno',
    },
    {
        title: '商品类型',
        dataIndex: 'goodstype',
        key: 'goodstype',
    },
    {
        title: '商品编码',
        dataIndex: 'goodscode',
        key: 'goodscode',
    },
    {
        title: '商品规格',
        dataIndex: 'goodsnorms',
        key: 'goodsnorms',
    },
    {
        title: '姓名',
        dataIndex: 'userno',
        key: 'userno',
    },
    {
        title: '创建时间',
        dataIndex: 'createtime',
        key: 'createtime',
        render: (_, record) => <a>{record.createtime.slice(0, 10)}</a>,
    },
]
const tableOrginData=[]
const PageSub2= () => {
    const [dataSource, setDataSource] = useState([])
    const loginInfo = JSON.parse(localStorage.getItem('xx-auth-key') || '')
    const [searchName, setSearchName] = useState(undefined)
    useEffect(() => {
        if(document.getElementById('import')){           
            document.getElementById('import').addEventListener('change', e => {
                inputHander(e)
            })
            return document.getElementById('import').removeEventListener('change', inputHander)
        }   
    },[])
    useEffect(() => {
        getStandard()
    }, [])
    const getStandard = async () => {
        const result = await fetchApi('api/getstandard')
        if (result.code == 200) {
            setDataSource(result.data)
            tableOrginData = result.data
        }
    }
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

            // // 遍历每张表读取
            for (let sheet in workbook.Sheets) {
                if (workbook.Sheets[sheet]) {
                    items = items.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
                    // break; // 如果只取第一张表，就取消注释这行
                }
            }
            //循环生成qrcode并自动下载到文件夹
            items.map((el, index) => {
                excelData.push(getExelArray(el, index))
            })
            const userno = Auth.loginInfo.id
            const result = await fetchApi(
                'api/importstandard',
                JSON.stringify({ excelData, userno }),
                'POST'
            )
            if (result.code == '200') {
                message.info('提交成功')
                getStandard()
            } else {
                message.info('提交失败, 请重新提交')
            }
        }
    }

    const getExelArray = (el, index) => {
        const goodsNo = el['商品编号']
        const name = el['商品名称'].replace('（', '(').replace('）', ')')
        const goodsType = el['商品类别']
        const goodsCode = el['编码']
        const goodsNorms = el['规格型号']
        if (name == '' || goodsNo == '') {
            return message.info(`第${index + 1}行数据异常, 名称,编号或者价格不能为空`)
        }
        return {
            goodsNo,
            name,
            goodsType,
            goodsCode,
            goodsNorms,
        }
    }
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
            <label
                className="ant-btn ant-btn-primary"
                style={{
                    width: '160px',
                    marginBottom: 6,
                    marginLeft: 6,
                    marginRight: 60
                }}
            >
                <PlusOutlined /> 导入excel文件
                <input id="import" type="file" style={{ display: 'none' }} />
            </label>
            <Input placeholder="请输入商品名称" value={searchName} onChange={e=> setSearchName(e.target.value)} style={{width: 160, marginRight: 20}}/>
            <Button
                    onClick={search}
                    type="primary"
                    icon={<SearchOutlined />}
                >
                    搜索
            </Button>
            <Table dataSource={dataSource} columns={columns} size='small'/>;
        </Panel>: 
        <div>功能尚未完善</div>
    )
}

export default PageSub2
