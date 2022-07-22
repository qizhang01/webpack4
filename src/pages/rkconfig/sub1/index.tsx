import React, { useState, useEffect } from 'react'
import { Panel } from '@/components/Panel'
import { Button, Space, Table, Popconfirm, message, Input } from 'antd'
import fetchApi from '@/ajax/index'
import XLSX from 'xlsx'
import { Auth } from '@/auth'
const { Search } = Input

interface DataType {
    key: string
    name: string
    goods_type: string
    goods_no: string
    model_type: string
    price: number
    unit: string
    ifopen: boolean
    goods_prod_address: string
    buy_date: string
    buyNumber: number
    store_house: string
    delivery_address: string
}
/*eslint-disable*/

const PageContext: React.FC = () => {
    const [data, setData]= useState([])
    useEffect(() => {
        inputHander()
    }, [])
    
    const inputHander = async () => {
        const result = await fetchProductlist()
        setData(result.data)
    }
    const exportExcel=()=>{
        const content = XLSX.utils.table_to_book(document.getElementById('report-table'))
        XLSX.writeFile(content, `export.xlsx`)
    }
    const print=()=>{

    }
    const fetchProductlist = async ()=>{
        const result = await fetchApi('api/productlist', JSON.stringify(Auth.loginInfo),'POST')
        return result
    }
    const columns = [
        {
            title: '商品类别',
            dataIndex: 'goods_type',
            key: 'goods_type',
            width: 150
            //   render: text => <a>{text}</a>,
        },
        {
            title: '商品编号',
            dataIndex: 'goods_no',
            key: 'goods_no',
            sorter: (a:any, b:any) => a.goods_no.length - b.goods_no.length,
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            sorter: (a:any, b:any) => a.name.length - b.name.length,
        },
        {
            title: '型号',
            dataIndex: 'model_type',
            key: 'model_type',
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            sorter: (a:any, b:any) => a.price - b.price,
        },
        {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
        },
        {
            title: '是否启用',
            dataIndex: 'ifopen',
            key: 'ifopen',
            render: (text:number) => <a>{text==1 ? '是' : '否'}</a>,
        },
        {
            title: '产地',
            dataIndex: 'goods_prod_address',
            key: 'goods_prod_address',
        },
    
        {
            title: '采购日期',
            dataIndex: 'buy_date',
            key: 'buy_date',
        },
        {
            title: '购买数量',
            dataIndex: 'buy_number',
            key: 'buy_number',
        },
        {
            title: '仓库',
            dataIndex: 'store_house',
            key: 'store_house',
        },
        {
            title: '名字',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '收货地址',
            dataIndex: 'delivery_address',
            key: 'delivery_address',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
              <Space size="middle">
                <a onClick={()=>handleClick(record.id, record.ifopen)}>{record.ifopen==1?"停用":"启用"}</a>
                <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
                   <a>删除</a>
                </Popconfirm>
              </Space>
            ),
        },
    ]
    const handleClick=async (id: string, ifopen:number)=>{
        const param={
            id,
            ifopen
        }
        const result = await fetchApi('api/startorend',JSON.stringify(param),'POST')
        if(result.code==200){
            const result = await fetchProductlist()
            setData(result.data)
        }
    }
    const handleDelete=async (id:string)=>{
        console.log(id)
        const param = {id}
        const result = await fetchApi('api/delete',JSON.stringify(param),'POST')
        if(result.code==200){
            const res= await fetchProductlist()
            setData(res.data)
            message.info(result.msg)
        }
    }
    const onSearch = async (value: string) =>{
        const str=value.trim()
        if(str){
            const d = data.filter((item:DataType)=>item.name.includes(str))
            setData(d)
        }else{
            const res= await fetchProductlist()
            setData(res.data)
        }
    }

    return (
        <Panel>
            <Button
                onClick={exportExcel}
                style={{ marginLeft: 15 }}
                type="primary"
                disabled={data.length==0}
            >
                导出为excel文件
            </Button>
            <Button
                onClick={print}
                style={{ marginLeft: 15, marginRight: 300 }}
                type="primary"
                disabled={data.length==0}
            >
                打印报表
            </Button>
            <Search placeholder="请输入..." onSearch={onSearch} style={{ width: 200 }} />

            <Table  bordered  style={{marginTop: 10}}columns={columns} dataSource={data} id='report-table'/>;
        </Panel>
    )
}

export default PageContext
