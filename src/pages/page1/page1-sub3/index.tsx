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
import province from '@/enum/province'
import cardType from '@/enum/cardType'
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

    return (
        <Panel>
            <span className="config-topic-text">详细选项配置</span>
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
                <Form.Item
                    name="select"
                    label="险种名称"
                    hasFeedback
                    rules={[{ required: true, message: '请选择险种名称' }]}
                >
                    <Select placeholder="请选择险种名称" onChange={handleChange}>
                        <Option value="0">乐享无忧</Option>
                        <Option value="1">百万航空</Option>
                    </Select>
                </Form.Item>

                {isShow ? (
                    <div style={{ marginLeft: '17%', marginBottom: 20 }}>
                        <span>险种名称: </span>
                        <span style={stl.topic}>百万航空</span>
                        <span>险种code: </span>
                        <span style={stl.topic}>dssdsd333</span>
                        <span>计划code: </span>
                        <span style={stl.topic}>5565656</span>
                        <span>保障期限: </span>
                        <span style={stl.topic}>5556</span>
                    </div>
                ) : null}
                <Form.Item name="socialSecrity" label="是否需要关注微信公总号">
                    <Radio.Group onChange={onSelectWX} value={isShowWeixin}>
                        <Radio value="true">是</Radio>
                        <Radio value="false">否</Radio>
                    </Radio.Group>
                </Form.Item>
                {isShowWeixin ? (
                    <div>
                        <Form.Item name="codeTitle" label="二维码标题">
                            <Input placeholder="请输入二维码标题" />
                        </Form.Item>
                        <Form.Item name="codeSecondTitle" label="二维码副标题">
                            <Input placeholder="请输入二维码副标题" />
                        </Form.Item>
                        <Form.Item
                            name="uploadIcon"
                            label="分享链接小图"
                            valuePropName="fileIcon"
                            getValueFromEvent={normFile}
                        >
                            <Upload name="logo" action="/upload.do" listType="picture">
                                <Button icon={<UploadOutlined />}>选择图标文件</Button>
                            </Upload>
                        </Form.Item>
                    </div>
                ) : null}
                <Form.Item label="活动总份数" name="input-number">
                    <InputNumber min={1} placeholder="请输入活动总份数" />
                </Form.Item>

                <Form.Item name="name" label="企业名称">
                    <Input placeholder="请输入企业名称" />
                </Form.Item>
                <Form.Item name="code" label="企业code">
                    <Input placeholder="请输入企业code" />
                </Form.Item>
                <Form.Item name="maxNumber" label="限领分数(不填默认为一份)">
                    <Input placeholder="请输入限领分数" />
                </Form.Item>

                <Form.Item name="activityNum" label="活动总份数">
                    <Input placeholder="请输入活动总份数" />
                </Form.Item>

                <Form.Item
                    name="select"
                    label="是否需要激活码"
                    hasFeedback
                    rules={[{ required: true, message: '请选择是否需要激活码' }]}
                >
                    <Select placeholder="请选择是否需要激活码">
                        <Option value="0">不需要</Option>
                        <Option value="1">需要</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="总份数(不填默认为1)" name="input-number">
                    <InputNumber min={1} placeholder="请输入总份数" />
                </Form.Item>

                <Form.Item name="switch" label="是否需要健告" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item name="socialSecrity" label="是否询问医保情况">
                    <Radio.Group>
                        <Radio value="socialSecrity_true">是</Radio>
                        <Radio value="socialSecrity_false">否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="normal_duty" label="普通意外责任">
                    <Input placeholder="请输入金额, 比如1万元" />
                </Form.Item>
                <Form.Item name="normal_doctor_duty" label="意外医疗保险责任">
                    <Input placeholder="请输入金额, 比如5000元" />
                </Form.Item>
                <Form.Item name="organizeCode" label="所属机构代码">
                    <Input placeholder="请输入所属机构代码" />
                </Form.Item>
                <Form.Item name="manageCode" label="默认代理人经理工号">
                    <Input placeholder="请输入代理人经理工号" />
                </Form.Item>
                <Form.Item name="manageName" label="默认代理人经理姓名">
                    <Input placeholder="请输入代理人经理姓名" />
                </Form.Item>
                <Form.Item
                    name="Start_Date"
                    label="开始日期"
                    rules={[{ type: 'object', required: true, message: '请选择活动开始日期' }]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    name="End_Date"
                    label="结束日期"
                    rules={[{ type: 'object', required: true, message: '请选择活动结束日期' }]}
                >
                    <DatePicker />
                </Form.Item>

                <Form.Item
                    name="checkbox-group"
                    label="活动省份"
                    wrapperCol={{ span: 12, offset: 0 }}
                >
                    <Checkbox.Group>
                        <Row>
                            {province.map(item => (
                                <Col span={4} key={item.id}>
                                    <Checkbox value={item.id} style={{ lineHeight: '32px' }}>
                                        {item.name}
                                    </Checkbox>
                                </Col>
                            ))}
                            <Col span={8}>
                                <Checkbox value="all" style={{ lineHeight: '32px' }}>
                                    全部
                                </Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item name="cardType" label="证件类型" wrapperCol={{ span: 16, offset: 0 }}>
                    <Checkbox.Group>
                        <Row>
                            {cardType.map(item => (
                                <Col span={4} key={item.value}>
                                    <Checkbox value={item.value} style={{ lineHeight: '32px' }}>
                                        {item.label}
                                    </Checkbox>
                                </Col>
                            ))}
                            <Col span={8}>
                                <Checkbox value="all" style={{ lineHeight: '32px' }}>
                                    全部
                                </Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item
                    name="clintType"
                    label="客户端"
                    hasFeedback
                    rules={[{ required: true, message: '请选择客户端' }]}
                >
                    <Select placeholder="请选择客户端">
                        <Option value="0">微信</Option>
                        <Option value="1">短信</Option>
                        <Option value="2">交银APP</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="origin"
                    label="渠道来源"
                    hasFeedback
                    rules={[{ required: true, message: '请选择渠道来源' }]}
                >
                    <Select placeholder="请选择渠道来源">
                        <Option value="0">微信</Option>
                        <Option value="1">短信</Option>
                        <Option value="2">交银APP</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="upload"
                    label="二维码分享图标"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload name="logo" action="/upload.do" listType="picture">
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                </Form.Item>
                <Form.Item name="EWMTitle" label="二维码标题">
                    <Input placeholder="请输入二维码标题" />
                </Form.Item>
                <Form.Item name="EWMSecondTitle" label="二维码副标题">
                    <Input placeholder="请输入二维码副标题" />
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
