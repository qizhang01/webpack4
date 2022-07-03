import React, { useState, useEffect } from 'react'
import { Panel } from '@/components/Panel'
import { Button, Space, Table } from 'antd'

interface DataType {
    key: string
    name: string
    goodsType: string
    goodsNo: string
    modelType: string
    price: number
    unit: string
    ifOpen: boolean
    goodsProdAddress: string
    buyDate: string
    buyNumber: number
    storeHouse: string
    deliveryAddress: string
}
/*eslint-disable*/
const columns = [
    {
        title: '商品类别',
        dataIndex: 'goodsType',
        key: 'goodsType',
        //   render: text => <a>{text}</a>,
    },
    {
        title: '商品编号',
        dataIndex: 'goodsNo',
        key: 'goodsNo',
    },
    {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '规格型号',
        dataIndex: 'modelType',
        key: 'modelType',
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
        dataIndex: 'ifOpen',
        key: 'ifOpen',
        render: (text: Boolean) => <a>{text ? '是' : '否'}</a>,
    },
    {
        title: '产地',
        dataIndex: 'goodsProdAddress',
        key: 'goodsProdAddress',
    },

    {
        title: '采购日期',
        dataIndex: 'buyDate',
        key: 'buyDate',
    },
    {
        title: '购买数量',
        dataIndex: 'buyNumber',
        key: 'buyNumber',
    },
    {
        title: '仓库',
        dataIndex: 'storeHouse',
        key: 'storeHouse',
    },
    {
        title: '收获地址',
        dataIndex: 'deliveryAddress',
        key: 'deliveryAddress',
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
/*eslint-disable*/
const data: DataType[] = [
    {
        key: '1',
        name: '静电服白分XXS',
        goodsType: '070108分体静电服',
        goodsNo: '1111',
        modelType: 'WWWDDD',
        price: 1000,
        unit: '套',
        ifOpen: true,
        goodsProdAddress: '河南郑州',
        buyDate: '2022/8/5',
        buyNumber: 10,
        storeHouse: '',
        deliveryAddress: '',
    },
    {
        key: '2',
        name: '车配件',
        goodsType: '070108分体静电服',
        goodsNo: '1111',
        modelType: 'WWWDDD',
        price: 2000,
        unit: '套',
        ifOpen: false,
        goodsProdAddress: '湖北武汉',
        buyDate: '2022/8/5',
        buyNumber: 10,
        storeHouse: '',
        deliveryAddress: '',
    },
]
const PageContext: React.FC = () => {
    useEffect(() => {
        inputHander()
    }, [])

    const inputHander = () => {}
    return (
        <Panel>
            <Table columns={columns} dataSource={data} />;
        </Panel>
    )
}

export default PageContext
