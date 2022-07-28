import React, { useState, useEffect } from 'react'
import { Panel } from '@/components/Panel'
import {
    Button,
    Space,
    Table,
    Popconfirm,
    message,
    Input,
    DatePicker,
    Divider,
    Modal,
    Row,
} from 'antd'
import fetchApi from '@/ajax/index'
import XLSX from 'xlsx'
import { Auth } from '@/auth'
import { Moment } from 'moment'
import moment from 'moment'
const { Search } = Input
const { RangePicker } = DatePicker
type RangeValue = [Moment | null, Moment | null] | null
import { SearchOutlined, InboxOutlined } from '@ant-design/icons'
interface DataType {
    id: string
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
    username: string
}
/*eslint-disable*/
const dateFormat = 'YYYY-MM-DD';
let recordRow: DataType
let tableOrginData: DataType[]
const PageContext: React.FC = () => {
    const [data, setData]= useState<DataType[]>([])
    const [value, setValue] = useState<RangeValue>(null);
    const [searchName, setSearchName]= useState<string|undefined>(undefined);
    const [isShowModel, setIsShowModel]= useState(false)
    const [productName, setProductName] = useState('')
    const [modelType, setModelType] = useState('')
    // let recordRow: DataType
    // let tableOrginData: DataType[]
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
        // format('YYYY/MM/DD 00:00:00')
        
        if(value && searchName){
           const start = moment(value[0]).format('YYYY-MM-DD')
           const end = moment(value[1]).format('YYYY-MM-DD')
           const d = tableOrginData.filter((item:DataType)=>moment(item.buy_date.replace(/\//g, "-")).isBetween(start, end) && item.username==searchName)
           setData(d)
        }else if(searchName && !value){
            const d = tableOrginData.filter((item:DataType)=>item.username==searchName)
            setData(d)
        }else if(!searchName && value){
            const start = moment(value[0]).format('YYYY-MM-DD')
            const end = moment(value[1]).format('YYYY-MM-DD')
            const d = tableOrginData.filter((item:DataType)=>moment(item.buy_date.replace(/\//g, "-")).isBetween(start, end))
            setData(d)
        }else{
            setData(tableOrginData)
        }
    }
    const fetchProductlist = async ()=>{
        const result = await fetchApi('api/productlist', JSON.stringify(Auth.loginInfo),'POST')
        tableOrginData = result.data
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
            title: '操作',
            key: 'action',
            render: (_: any, record: any) => (
              <Space size="middle">
                <a onClick={()=>handleClick(record.id, record.ifopen)}>{record.ifopen==1?"停用":"启用"}</a>
                {/* <Divider type="vertical"/> */}
                <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
                   <a>删除</a>
                </Popconfirm>
                {/* <Divider type="vertical"/> */}
                <a onClick={()=>toEdit(record)}>编辑</a>
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
        const param = {id}
        const result = await fetchApi('api/delete',JSON.stringify(param),'POST')
        if(result.code==200){
            const res= await fetchProductlist()
            setData(res.data)
            message.info(result.msg)
        }
    }
    const showAllProductlist = async () =>{
        const res= await fetchProductlist()
        setData(res.data)
        setValue(null)
        setSearchName(undefined)
    }
    
    const submitModel=async ()=>{
        if(recordRow.name!==productName || recordRow.model_type!==modelType){
           //调用更新接口updateProduction
            const param={
                productName,
                modelType,
                id: recordRow.id
            }
            const result = await fetchApi('api/updateProduction',JSON.stringify(param),'POST')
            if(result.code==200){
                const res= await fetchProductlist()
                setData(res.data)
                message.info(result.msg)
            }
        }
    }

    const toEdit = (record: DataType)=>{
        recordRow = record
        const {model_type,name} = record
        setIsShowModel(true)
        setModelType(model_type)
        setProductName(name)
    }
    return (
        <Panel>
            <div>
                <Button
                    onClick={exportExcel}
                    style={{ marginLeft: 15,marginRight: 30 }}
                    type="primary"
                    disabled={data.length==0}
                >
                    导出为excel文件
                </Button>
                <Input placeholder="请输入姓名" value={searchName} onChange={e=> setSearchName(e.target.value)} style={{width: 160, marginRight: 30}}/>
                {/* <Search placeholder="请输入..." onSearch={onSearch} style={{ width: 200, marginRight: 30 }} /> */}
                <RangePicker
                    format={dateFormat}
                    value={value}
                    onChange={val => setValue(val)}
                />
                <Button
                    onClick={print}
                    style={{ marginLeft: 15, marginRight: 15 }}
                    type="primary"
                    icon={<SearchOutlined />}
                >
                    搜索
                </Button>
                <Button type="text" onClick={showAllProductlist} style={{float:'right',color:'#1890ff'}}>
                    显示全部
                </Button>
            </div>
            <Table  bordered  style={{marginTop: 10}}columns={columns} dataSource={data} id='report-table'/>;
            <Modal
                title="修改密码"
                wrapClassName="vertical-center-modal"
                width="600px"
                visible={isShowModel}
                onCancel={() => setIsShowModel(false)}
                footer={[
                    <Button key="close" onClick={() => setIsShowModel(false)}>
                        关闭
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        // disabled={
                        //     originPassword == '' || newPassword == '' || confirmNewPassword == ''
                        // }
                        onClick={submitModel}
                    >
                        确定
                    </Button>,
                ]}
            >
                <Row>
                    <span
                        style={{
                            width: 100,
                            display: 'inline-block',
                            textAlign: 'right',
                        }}
                    >
                        商品名称:
                    </span>
                    <Input
                        placeholder="请输入商品名称"
                        onChange={e => {
                            setProductName(e.target.value)
                        }}
                        value={productName}
                        style={{ width: 200, marginLeft: 10, marginBottom: 10 }}
                    ></Input>
                </Row>
                <Row>
                    <span
                        style={{
                            width: 100,
                            display: 'inline-block',
                            textAlign: 'right',
                        }}
                    >
                        型号:
                    </span>
                    <Input
                        placeholder="请输入型号"
                        onChange={e => {
                            setModelType(e.target.value)
                        }}
                        style={{ width: 200, marginLeft: 10, marginBottom: 10 }}
                        value={modelType}
                    ></Input>
                </Row>
                <Row>

                </Row>
            </Modal>
        </Panel>
    )
}

export default PageContext
