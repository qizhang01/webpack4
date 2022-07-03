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
} from 'antd'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons'
import { Panel } from '@/components/Panel'
import { useLocation } from 'react-router-dom'
import './index.less'

const { Option } = Select

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
}

const stl = {
    topic: { marginRight: '10px', fontWeight: 800 },
}

const normFile = (e: any) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
        return e
    }
    return e && e.fileList
}

const PageSub: React.FC = () => {
    const param = useLocation()

    const [isShow, setIsShow] = useState(false)

    const [isShowWeixin, setShowWeixin] = useState(false)

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values)
    }
    const handleChange = (value: any) => {
        setIsShow(true)
    }

    const onSelectWX = (e: any) => {
        const value = e.target.value
        if (value === 'true') {
            setShowWeixin(true)
        } else {
            setShowWeixin(false)
        }
    }
    const onChangeTime = () => {}
    return (
        <Panel>
            <Form
                name="config-form"
                {...formItemLayout}
                onFinish={onFinish}
                initialValues={{
                    ['input-number']: 3,
                    ['checkbox-group']: ['A', 'B'],
                    rate: 3.5,
                }}
            >
                <Form.Item name="socialSecrity" label="是否启用">
                    <Radio.Group onChange={onSelectWX} value={isShowWeixin}>
                        <Radio value="true">是</Radio>
                        <Radio value="false">否</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name="name" label="商品类别">
                    <Input placeholder="请输入商品类别" />
                </Form.Item>
                <Form.Item name="code" label="商品编号">
                    <Input placeholder="请输入商品编号" />
                </Form.Item>
                <Form.Item name="maxNumber" label="商品名称">
                    <Input placeholder="请输入商品名称" />
                </Form.Item>

                <Form.Item name="activityNum" label="规格型号">
                    <Input placeholder="请输入规格型号" />
                </Form.Item>

                <Form.Item label="采购价" name="input-number">
                    <InputNumber min={1} placeholder="请输入采购价" />
                </Form.Item>
                <Form.Item name="normal_duty" label="计量单位">
                    <Input placeholder="请输入计量单位" />
                </Form.Item>
                <Form.Item name="normal_doctor_duty" label="产地">
                    <Input placeholder="请输入产地" />
                </Form.Item>
                <Form.Item name="organizeCode" label="采购数量">
                    <InputNumber placeholder="请输入采购数量" />
                </Form.Item>
                <Form.Item name="manageCode" label="仓库">
                    <Input placeholder="请输入仓库" />
                </Form.Item>
                <Form.Item name="manageName" label="收货地址">
                    <Input placeholder="请输入收货地址" />
                </Form.Item>

                <Form.Item name="Start_Date" label="采购日期">
                    <DatePicker
                        size="middle"
                        placeholder="请选择采购日期"
                        onChange={onChangeTime}
                    />
                </Form.Item>

                <Form.Item
                    name="upload"
                    label="产品图片"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload name="logo" action="/upload.do" listType="picture">
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                </Form.Item>
                <div style={{ marginTop: 50 }}>
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
