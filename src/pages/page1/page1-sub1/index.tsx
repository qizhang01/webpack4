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
import { MinusCircleOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons'
import { Panel } from '@/components/Panel'
import commonFetch from '@/ajax/index'
import { useHistory } from 'react-router-dom'

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
}
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
    },
}
const normFile = (e: any) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
        return e
    }
    return e && e.fileList
}
const stl = {}
const PageSub1: React.FC = () => {
    const history = useHistory()

    const onFinish = async (values: any) => {
        toNextPage()
        // const { activityNum, saleAgency, client } = values
        // const param = {
        //     ...values,
        //     client: client ? client : 'GW',
        //     saleAgency: saleAgency ? saleAgency : '上海总部',
        // }
        // if (activityNum) {
        //     param['overridden'] = { activityNum }
        // }
        // const result = await commonFetch(
        //     '/api/overridden/createOverriddenPlanInfo',
        //     JSON.stringify(param),
        //     'POST'
        // )
        // console.log(result)
    }

    function toNextPage() {
        history.push({ pathname: '/root/page-sub3', state: { dimensionId: 123 } })
    }

    return (
        <Panel>
            <span className="config-topic-text">基础选项配置</span>
            <Form
                name="validate_other"
                {...formItemLayout}
                onFinish={onFinish}
                initialValues={{
                    ['input-number']: 3,
                    ['checkbox-group']: ['A', 'B'],
                    rate: 3.5,
                }}
            >
                <Form.Item
                    name="planCode"
                    label="计划编码"
                    rules={[
                        {
                            required: true,
                            message: '请输入产品计划编码',
                        },
                    ]}
                >
                    <Input placeholder="请输入产品计划编码" />
                </Form.Item>

                <Form.Item
                    name="activity"
                    label="活动编码"
                    rules={[
                        {
                            required: true,
                            message: '请输入产品计划编码',
                        },
                    ]}
                >
                    <Input placeholder="请输入赠险活动编码" />
                </Form.Item>

                <Form.Item
                    name="channel"
                    label="主渠道"
                    rules={[
                        {
                            required: true,
                            message: '请输入产品计划编码',
                        },
                    ]}
                >
                    <InputNumber min={1} placeholder="请输入主渠道来源" />
                </Form.Item>

                <Form.Item
                    name="subChannel"
                    label="子渠道"
                    rules={[
                        {
                            required: true,
                            message: '请输入产品计划编码',
                        },
                    ]}
                >
                    <InputNumber min={1} placeholder="请输入子渠道" />
                </Form.Item>

                <Form.Item name="saleAgency" label="销售机构">
                    <Input defaultValue="上海总部" />
                </Form.Item>

                <Form.Item name="client" label="客户端">
                    <Input placeholder="请输入客户端" defaultValue="GW" />
                </Form.Item>
                <Form.Item name="activityNum" label="活动总份数">
                    <Input placeholder="请输入活动总份数" />
                </Form.Item>
                {/* <Form.List name="names">
                    {(fields, { add, remove }) => {
                        return (
                            <div>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        {...(index === 0
                                            ? formItemLayout
                                            : formItemLayoutWithOutLabel)}
                                        label={index === 0 ? 'Passengers' : ''}
                                        required={false}
                                        key={field.key}
                                    >
                                        <Form.Item
                                            {...field}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请输入',
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <Input
                                                placeholder="passenger name"
                                                style={{ width: '60%' }}
                                            />
                                        </Form.Item>
                                        {fields.length > 1 ? (
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                style={{ margin: '0 8px' }}
                                                onClick={() => {
                                                    remove(field.name)
                                                }}
                                            />
                                        ) : null}
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => {
                                            add()
                                        }}
                                        style={{ width: '60%' }}
                                    >
                                        <PlusOutlined /> Add field
                                    </Button>
                                </Form.Item>
                            </div>
                        )
                    }}
                </Form.List> */}

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
export default PageSub1
