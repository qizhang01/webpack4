import React, { useState, useEffect } from 'react'
import { Panel } from '@/components/Panel'
import { Button, Space, Table } from 'antd'
import fetchApi from '@/ajax/index'

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
const columns = [
    {
        title: '商品类别',
        dataIndex: 'goods_type',
        key: 'goods_type',
        //   render: text => <a>{text}</a>,
    },
    {
        title: '商品编号',
        dataIndex: 'goods_no',
        key: 'goods_no',
    },
    {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '规格型号',
        dataIndex: 'model_type',
        key: 'model_type',
    },
    {
        title: '采购价',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: '计量单位',
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
        title: '收获地址',
        dataIndex: 'delivery_address',
        key: 'delivery_address',
    },
    {
        title: 'Action',
        key: 'action',
        render: (_: any, record: any) => (
          <Space size="middle">
            <a>修改</a>
            <a>删除</a>
          </Space>
        ),
    },
]

const PageContext: React.FC = () => {
    const [data, setData]= useState([])
    useEffect(() => {
        inputHander()
    }, [])

    const inputHander = async () => {
        const result = await fetchApi('api/productlist')
        console.log(result.data)
        setData(result.data)
    }
    return (
        <Panel>
            <Table columns={columns} dataSource={data} />;
        </Panel>
    )
}

export default PageContext
