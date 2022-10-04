import React, { useState } from 'react'
import { Form, Select, Input, InputNumber, Button, Row, Collapse, message } from 'antd'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons'
import { Panel } from '@/components/Panel'
import './index.less'
import { Auth } from '@/auth'
import fetchApi from '@/ajax/index'

const { Option } = Select

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
}

const stl = {
    topic: { marginRight: '10px', fontWeight: 800 },
}
const InputNumberStl = { width: '60%' }

const PageSub: React.FC = () => {
    const [method, setMethod] = useState('日结')

    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values)
        let body = {}
        let path = ''
        let totalSalary
        const { salarytpye } = values
        if (salarytpye === '日结') {
            const {
                salarytpye,
                name,
                emplyeeid,
                workday,
                daytotal,
                daysalary,
                worklong,
                worklongmoney,
            } = values
            totalSalary = workday * (daysalary + (worklong * worklongmoney) / daytotal)
            body = {
                salarytpye,
                name,
                emplyeeid,
                workday,
                daytotal,
                daysalary,
                worklong,
                worklongmoney,
                totalSalary,
                userno: Auth.loginInfo.id,
            }
            path = 'savesimpleday'
        } else if (salarytpye === '月结') {
            const {
                salarytpye,
                name,
                emplyeeid,
                workday,
                daytotal,
                fullsalary,
                daysalary,
                overdaysalary,
                factrestdays,
            } = values
            path = 'savesimpleday'
        } else if (salarytpye === '无满勤奖励') {
            const {
                salarytpye,
                name,
                emplyeeid,
                workday,
                holidays,
                monthholiday,
                factrestdays,
                daysalary,
            } = values
            totalSalary = daysalary * (workday + holidays + monthholiday - factrestdays)
            body = {
                salarytpye,
                name,
                emplyeeid,
                workday,
                daysalary,
                totalSalary,
                monthholiday,
                userno: Auth.loginInfo.id,
            }
            path = 'savesimplemonth'
        } else if (salarytpye === '按比例核定') {
            const {
                salarytpye,
                name,
                emplyeeid,
                workday,
                holidays,
                monthholiday,
                factrestdays,
                daysalary,
            } = values
            totalSalary =
                ((workday * factrestdays) / 28).toFixed() +
                daysalary * (workday + holidays + monthholiday - factrestdays)
            body = {
                salarytpye,
                name,
                emplyeeid,
                workday,
                daysalary,
                totalSalary,
                monthholiday,
                userno: Auth.loginInfo.id,
            }
            path = 'savesimplemonth'
        }

        console.log(body)

        const result = await fetchApi(`api/salary/${path}`, JSON.stringify(body), 'POST')
        console.log(result)
        if (result.code == '200') {
            message.info(`提交成功, 薪水为${totalSalary}`)
        } else {
            message.info('提交失败, 请重新提交')
        }
    }

    const selectMethod = (value: string) => {
        setMethod(value)
    }

    const calSalary = (type: string) => {}

    return (
        <Panel>
            <Collapse>
                <Collapse.Panel header="员工薪水录入" key="1">
                    <Form name="config-form" {...formItemLayout} onFinish={onFinish}>
                        <Form.Item name="salarytpye" label="核算方式">
                            <Select
                                defaultValue="日结"
                                style={{ width: 120 }}
                                onChange={selectMethod}
                            >
                                <Option value="日结">日结</Option>
                                {/* <Option value="月结">月结</Option> */}
                                <Option value="无满勤奖励">无满勤奖励</Option>
                                <Option value="按比例核定">按比例核定</Option>
                                {/* <Option value="核定后扣除">核定后扣除</Option> */}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="姓名"
                            rules={[{ required: true, message: '必须输入姓名' }]}
                        >
                            <Input placeholder="请输入姓名" />
                        </Form.Item>
                        <Form.Item
                            name="emplyeeid"
                            label="员工id"
                            rules={[{ required: true, message: '必须输入员工id' }]}
                        >
                            <Input placeholder="请输入员工id" />
                        </Form.Item>
                        <div style={{ display: method == '日结' ? 'block' : 'none' }}>
                            <Form.Item name="workday" label="本月出勤">
                                <InputNumber
                                    placeholder="请输入本月出勤天数"
                                    style={InputNumberStl}
                                />
                            </Form.Item>
                            <Form.Item
                                label="本月天数"
                                name="daytotal"
                                rules={[{ required: true, message: '必须输入本月天数' }]}
                            >
                                <InputNumber
                                    min={0}
                                    placeholder="请输入本月天数"
                                    style={InputNumberStl}
                                />
                            </Form.Item>
                            <Form.Item
                                name="daysalary"
                                label="日工资"
                                rules={[{ required: true, message: '必须输入日工资' }]}
                            >
                                <InputNumber placeholder="请输入日工资" style={InputNumberStl} />
                            </Form.Item>
                            <Form.Item
                                name="worklong"
                                label="工龄"
                                rules={[{ required: true, message: '必须输入工龄' }]}
                            >
                                <InputNumber placeholder="请输入工龄" style={InputNumberStl} />
                            </Form.Item>

                            <Form.Item name="worklongmoney" label="工龄月薪">
                                <InputNumber placeholder="请输入工龄月薪" style={InputNumberStl} />
                            </Form.Item>
                        </div>

                        <div style={{ display: method == '月结' ? 'block' : 'none' }}>
                            <Form.Item name="workday" label="本月出勤">
                                <InputNumber placeholder="请输入本月出勤天数" />
                            </Form.Item>
                            <Form.Item
                                label="满勤天数"
                                name="daytotal"
                                rules={[{ required: true, message: '必须输入满勤天数' }]}
                            >
                                <InputNumber
                                    min={0}
                                    placeholder="请输入满勤天数"
                                    style={InputNumberStl}
                                />
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
                        </div>

                        <div
                            style={{
                                display:
                                    method == '无满勤奖励' || method == '按比例核定'
                                        ? 'block'
                                        : 'none',
                            }}
                        >
                            <Form.Item name="workday" label="本月出勤">
                                <InputNumber placeholder="请输入本月出勤天数" />
                            </Form.Item>
                            <Form.Item
                                label="积累假期"
                                name="holidays"
                                rules={[{ required: true, message: '必须输入积累假期' }]}
                            >
                                <InputNumber
                                    min={0}
                                    placeholder="请输入积累假期"
                                    style={InputNumberStl}
                                />
                            </Form.Item>
                            <Form.Item
                                name="monthholiday"
                                label="每月休息天数"
                                rules={[{ required: true, message: '必须输入月休息天数' }]}
                            >
                                <InputNumber placeholder="请输入月休息天数" />
                            </Form.Item>
                            <Form.Item
                                name="factrestdays"
                                label="实际休息天数"
                                rules={[{ required: true, message: '必须输入实际休息天数' }]}
                            >
                                <InputNumber placeholder="请输入实际休息天数" />
                            </Form.Item>
                            <Form.Item
                                name="daysalary"
                                label="日工资"
                                rules={[{ required: true, message: '必须输入日工资' }]}
                            >
                                <InputNumber placeholder="请输入日工资" />
                            </Form.Item>
                        </div>

                        <div style={{ marginTop: 30, marginBottom: 10 }}>
                            <Form.Item wrapperCol={{ span: 3, offset: 9 }}>
                                <Button type="primary" htmlType="submit" block>
                                    完成提交3
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </Collapse.Panel>
                <Collapse.Panel header="员工薪水列表" key="2"></Collapse.Panel>
            </Collapse>
        </Panel>
    )
}
export default PageSub
