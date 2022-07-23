import React, { useState } from 'react'
import {
    Form,
    Select,
    Input,
    InputNumber,
    Switch,
    Radio,
    Button,
    Upload,
    Checkbox,
    DatePicker,
    Row,
    Col,
    message,
} from 'antd'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons'
import { Panel } from '@/components/Panel'
import { useLocation } from 'react-router-dom'
import './index.less'
import moment from 'moment'
import { Auth } from '@/auth'
import fetchApi from '@/ajax/index'

const { Option } = Select

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
}

const stl = {
    topic: { marginRight: '10px', fontWeight: 800 },
}
const InputNumberStl = { width: '60%' }
const normFile = (e: any) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
        return e
    }
    return e && e.fileList
}

const PageSub: React.FC = () => {
    const param = useLocation()

    const [ifOpen, setIfOpen] = useState(false)

    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values)
        // name,goods_type,goods_no,model_type,price,unit,ifopen,goods_prod_address,buy_date,buy_number,store_house,delivery_address,ifdelete
        const {
            name,
            goods_type = '',
            goods_no,
            model_type = '',
            price,
            unit = '',
            ifopen = 1,
            goods_prod_address = '',
            buy_date = '',
            buy_number = 0,
            store_house = '',
            delivery_address = '',
        } = values
        const body = {
            name,
            goods_type,
            goods_no,
            model_type,
            price,
            unit,
            ifopen: ifOpen ? 1 : 0,
            goods_prod_address,
            buy_date: buy_date ? moment(buy_date).format(dateFormat) : '',
            buy_number,
            store_house,
            delivery_address,
            ifdelete: 0,
            userno: Auth.loginInfo.id,
        }
        console.log(body)
        const result = await fetchApi('api/addOneProduct', JSON.stringify(body), 'POST')
        console.log(result)
        if (result.code == '200') {
            message.info('提交成功')
        } else {
            message.info('提交失败, 请重新提交')
        }
    }

    const onSelectIfOpenStatus = (e: any) => {
        const value = e.target.value
        if (value === 'true') {
            setIfOpen(true)
        } else {
            setIfOpen(false)
        }
    }
    const dateFormat = 'yyyy-MM-DD'
    const onChangeTime = () => {}
    return (
        <Panel>
            <Form
                name="config-form"
                {...formItemLayout}
                onFinish={onFinish}
                initialValues={{
                    ['checkbox-group']: ['A', 'B'],
                    rate: 3.5,
                }}
            >
                <Form.Item name="ifopen" label="是否启用">
                    <Radio.Group onChange={onSelectIfOpenStatus} value={ifOpen}>
                        <Radio value="true">是</Radio>
                        <Radio value="false">否</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name="goods_type" label="商品类别">
                    <Input placeholder="请输入商品类别" />
                </Form.Item>
                <Form.Item
                    name="goods_no"
                    label="商品编号"
                    rules={[{ required: true, message: '必须输入商品编号' }]}
                >
                    <Input placeholder="请输入商品编号" />
                </Form.Item>
                <Form.Item
                    name="name"
                    label="商品名称"
                    rules={[{ required: true, message: '必须输入商品名称' }]}
                >
                    <Input placeholder="请输入商品名称" />
                </Form.Item>

                <Form.Item name="model_type" label="规格型号">
                    <Input placeholder="请输入规格型号" />
                </Form.Item>

                <Form.Item
                    label="采购价"
                    name="price"
                    rules={[{ required: true, message: '必须输入商品价格' }]}
                >
                    <InputNumber min={0} placeholder="请输入采购价" style={InputNumberStl} />
                </Form.Item>
                <Form.Item name="unit" label="计量单位">
                    <Input placeholder="请输入计量单位" />
                </Form.Item>
                <Form.Item name="goods_prod_address" label="产地">
                    <Input placeholder="请输入产地" />
                </Form.Item>
                <Form.Item name="buy_number" label="采购数量">
                    <InputNumber placeholder="请输入采购数量" style={InputNumberStl}></InputNumber>
                </Form.Item>
                <Form.Item name="store_house" label="仓库">
                    <Input placeholder="请输入仓库" />
                </Form.Item>
                <Form.Item name="delivery_address" label="收货地址">
                    <Input placeholder="请输入收货地址" />
                </Form.Item>

                <Form.Item name="buy_date" label="采购日期">
                    <DatePicker
                        size="middle"
                        placeholder="请选择采购日期"
                        onChange={onChangeTime}
                        style={InputNumberStl}
                    />
                </Form.Item>

                {/* <Form.Item
                    name="upload"
                    label="产品图片"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload name="logo" action="/upload.do" listType="picture">
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                </Form.Item> */}
                <div style={{ marginTop: 50, marginBottom: 80 }}>
                    <Form.Item wrapperCol={{ span: 3, offset: 9 }}>
                        <Button type="primary" htmlType="submit" block>
                            完成提交
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </Panel>
    )
}
export default PageSub
