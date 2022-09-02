import React, { useState } from 'react'
import {
    Form,
    Select,
    Input,
    InputNumber,
    Button,
    Row,
    Col,
    message,
} from 'antd'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons'
import { Panel } from '@/components/Panel'
import { useLocation } from 'react-router-dom'
import './index.less'
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

const PageSub: React.FC = () => {
    const param = useLocation()

    const [method, setMethod] = useState('日结')

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
            goods_prod_address,
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

    const selectMethod = (value: string) => {
        setMethod(value)
    }

    return (
        <Panel>
            <Form name="config-form" {...formItemLayout} onFinish={onFinish}>
                <Form.Item name="type" label="核算方式">
                    <Select defaultValue="日结" style={{ width: 120 }} onChange={selectMethod}>
                        <Option value="日结">日结</Option>
                        <Option value="月结">月结</Option>
                        <Option value="无满勤奖励">无满勤奖励</Option>
                        <Option value="按比例核定">按比例核定</Option>
                        <Option value="核定后扣除">核定后扣除</Option>
                    </Select>
                </Form.Item>
                <div style={{ display: method == '日结' ? 'block' : 'none' }}>
                    <Form.Item name="workday" label="本月出勤">
                        <InputNumber placeholder="请输入本月出勤天数" />
                    </Form.Item>

                    <Form.Item
                        name="daysalary"
                        label="日工资"
                        rules={[{ required: true, message: '必须输入日工资' }]}
                    >
                        <InputNumber placeholder="请输入日工资" />
                    </Form.Item>
                    <Form.Item
                        name="worklong"
                        label="工龄"
                        rules={[{ required: true, message: '必须输入工龄' }]}
                    >
                        <InputNumber placeholder="请输入工龄" />
                    </Form.Item>

                    <Form.Item name="worklongmoney" label="工龄月薪">
                        <InputNumber placeholder="请输入工龄月薪" />
                    </Form.Item>

                    <Form.Item
                        label="本月天数"
                        name="daytotal"
                        rules={[{ required: true, message: '必须输入本月天数' }]}
                    >
                        <InputNumber min={0} placeholder="请输入本月天数" style={InputNumberStl} />
                    </Form.Item>
                </div>

                <div style={{ display: method == '月结' ? 'block' : 'none' }}>
                    <Form.Item name="workday" label="本月出勤">
                        <InputNumber placeholder="请输入本月出勤天数" />
                    </Form.Item>

                    <Form.Item
                        name="fullsalary"
                        label="满勤工资"
                        rules={[{ required: true, message: '必须输入满勤工资' }]}
                    >
                        <InputNumber placeholder="请输入满勤工资" />
                    </Form.Item>
                    <Form.Item
                        name="daysalary"
                        label="日工资"
                        rules={[{ required: true, message: '必须输入日工资' }]}
                    >
                        <InputNumber placeholder="请输入日工资" />
                    </Form.Item>
                    <Form.Item
                        name="overdaysalary"
                        label="超勤工资"
                        rules={[{ required: true, message: '必须输入超勤工资' }]}
                    >
                        <InputNumber placeholder="请输入超勤工资" />
                    </Form.Item>
                    <Form.Item
                        label="满勤天数"
                        name="daytotal"
                        rules={[{ required: true, message: '必须输入满勤天数' }]}
                    >
                        <InputNumber min={0} placeholder="请输入满勤天数" style={InputNumberStl} />
                    </Form.Item>
                </div>

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
