import React, { useState } from 'react'
import { Form, Select, Input, InputNumber, Button, Table, Collapse, message } from 'antd'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons'
import { Panel } from '@/components/Panel'
import './index.less'
import { Auth } from '@/auth'
import fetchApi from '@/ajax/index'
import XLSX from 'xlsx'
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
    const [tableData, setTableData] = useState([])
    const columns = [
        {
            title: '结算方式',
            dataIndex: 'salarytype',
            key: 'salarytype',
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '员工ID',
            dataIndex: 'employeeid',
            key: 'employeeid',
        },
        {
            title: '日薪',
            dataIndex: 'salaryday',
            key: 'salaryday',
        },
        {
            title: '上月薪水',
            dataIndex: 'totalSalary',
            key: 'totalSalary',
        },
        {
            title: '工龄',
            dataIndex: 'worklong',
            key: 'worklong',
        },
        /*eslint-disable*/
        {
            title: '操作',
            key: 'action',
            render: (text: any, record: any) => (
                <span>
                    <a href="javascript:;" onClick={() => reset(record)}>
                        修改
                    </a>
                </span>
            ),
        },
        /*eslint-disable*/
        // {
        //     title: '姓名',
        //     dataIndex: 'userno',
        //     key: 'userno',
        // },
        // {
        //     title: '创建时间',
        //     dataIndex: 'createtime',
        //     key: 'createtime',
        //     render: (_: any, record: any) => <a>{record.createtime.slice(0, 10)}</a>,
        // },
    ]
    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values)
        let body = {}
        let path = ''
        let totalSalary
        const salarytype = method
        if (salarytype === '日结') {
            const {
                name,
                employeeid,
                workday,
                daytotal,
                salaryday,
                worklong,
                worklongmoney,
            } = values
            totalSalary = workday * (salaryday + (worklong * worklongmoney) / daytotal)
            body = {
                salarytype,
                name,
                employeeid,
                workday,
                daytotal,
                salaryday,
                worklong,
                worklongmoney,
                totalSalary,
                userno: Auth.loginInfo.id,
            }
            path = 'savesimpleday'
        } else if (salarytype === '月结') {
            const {
                name,
                employeeid,
                workday,
                daytotal,
                fullsalary,
                salaryday,
                overdaysalary,
                factrestdays,
            } = values
            path = 'savesimpleday'
        } else if (salarytype === '无满勤奖励') {
            const {
                name,
                employeeid,
                workday,
                holidays,
                monthholiday,
                factrestdays,
                salaryday,
            } = values
            totalSalary = salaryday * (workday + holidays + monthholiday - factrestdays)
            body = {
                salarytype,
                name,
                employeeid,
                workday,
                salaryday,
                totalSalary,
                monthholiday,
                userno: Auth.loginInfo.id,
            }
            path = 'savesimplemonth'
        } else if (salarytype === '按比例核定') {
            const {
                name,
                employeeid,
                workday,
                holidays,
                monthholiday,
                factrestdays,
                salaryday,
            } = values
            totalSalary =
                ((workday * factrestdays) / 28).toFixed() +
                Number(salaryday * (workday + holidays + monthholiday - factrestdays))

            body = {
                salarytype,
                name,
                employeeid,
                workday,
                salaryday,
                totalSalary,
                monthholiday,
                userno: Auth.loginInfo.id,
            }
            path = 'savesimplemonth'
        }

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

    const reset = (type: string) => {}
    const query = async () => {
        const result = await fetchApi('api/salary/getallemployeesalary')
        if (result.code == '200') {
            setTableData(result.data)
        } else {
            message.info('查询失败, 请重新提交')
        }
    }
    const onChange = (key: any) => {
        console.log(key)
        if (key == 2) {
            query()
        }
    }
    const inputHander = (e:any) => {
        let data,
            workbook,
            items:any[] = [],
            excelData: any[]= []
        const files = e.target.files
        if (!/\.(xlsx|xls)$/.test(files[0].name)) {
            return alert('文件类型不正确')
        }
        let fileReader = new FileReader()

        // // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0])

        fileReader.onload = async function(ev) {
            try {
                data = ev.target?.result
                workbook = XLSX.read(data, {
                    type: 'binary',
                }) // 以二进制流方式读取得到整份excel表格对象
            } catch {
                return alert('文件有错误，请重新编辑后导入')
            }

            // // 遍历每张表读取
            for (let sheet in workbook.Sheets) {
                if (workbook.Sheets[sheet]) {
                    items = items.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
                    // break; // 如果只取第一张表，就取消注释这行
                }
            }
            //循环生成qrcode并自动下载到文件夹

            // const result = await fetchApi(
            //     'api/importstandard',
            //     JSON.stringify({ excelData, userno }),
            //     'POST'
            // )
            // console.log('22222222222222', result)
            // if (result.code == '200') {
            //     message.info('提交成功')
            // } else {
            //     message.info('提交失败, 请重新提交')
            // }
        }
    }

    const getExelArray = (el:any, index:number) => {
        const goodsNo = el['商品编号']
        const name = el['商品名称'].replace('（', '(').replace('）', ')')
        const goodsType = el['商品类别']
        const goodsCode = el['编码']
        const goodsNorms = el['规格型号']
        if (name == '' || goodsNo == '') {
            return message.info(`第${index + 1}行数据异常, 名称,编号或者价格不能为空`)
        }
        return {
            goodsNo,
            name,
            goodsType,
            goodsCode,
            goodsNorms,
        }
    }
    React.useEffect(() => {
        if(document.getElementById('import')){           
            document.getElementById('import')?.addEventListener('change', e => {
                inputHander(e)
            })
            return document.getElementById('import')?.removeEventListener('change', inputHander)
        }   
    },[])

    return (
        <Panel>
            <Collapse onChange={onChange} accordion>
                <Collapse.Panel header="员工薪水录入" key="1">
                    <Form name="config-form" {...formItemLayout} onFinish={onFinish}>
                        <Form.Item name="salarytype" label="核算方式">
                            <Select
                                defaultValue="日结"
                                style={{ width: 120 }}
                                onChange={selectMethod}
                            >
                                <Option value="日结">日结</Option>
                                {/* <Option value="月结">月结</Option> */}
                                <Option value="无满勤奖励">月结-无满勤奖励</Option>
                                <Option value="按比例核定">月结-按比例核定</Option>
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
                            name="employeeid"
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
                            <Form.Item label="本月天数" name="daytotal">
                                <InputNumber
                                    min={0}
                                    placeholder="请输入本月天数"
                                    style={InputNumberStl}
                                />
                            </Form.Item>
                            <Form.Item name="salaryday" label="日工资">
                                <InputNumber placeholder="请输入日工资" style={InputNumberStl} />
                            </Form.Item>
                            <Form.Item name="worklong" label="工龄">
                                <InputNumber placeholder="请输入工龄" style={InputNumberStl} />
                            </Form.Item>

                            <Form.Item name="worklongmoney" label="工龄月薪">
                                <InputNumber placeholder="请输入工龄月薪" style={InputNumberStl} />
                            </Form.Item>
                        </div>
                        {/* <div style={{ display: method == '月结' ? 'block' : 'none' }}>
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
                        </div> */}
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
                            <Form.Item label="积累假期" name="holidays">
                                <InputNumber
                                    min={0}
                                    placeholder="请输入积累假期"
                                    style={InputNumberStl}
                                />
                            </Form.Item>
                            <Form.Item name="monthholiday" label="每月休息天数">
                                <InputNumber placeholder="请输入月休息天数" />
                            </Form.Item>
                            <Form.Item name="factrestdays" label="实际休息天数">
                                <InputNumber placeholder="请输入实际休息天数" />
                            </Form.Item>
                            <Form.Item name="salaryday" label="日工资">
                                <InputNumber placeholder="请输入日工资" />
                            </Form.Item>
                        </div>

                        <div style={{ marginTop: 30, marginBottom: 10 }}>
                            <Form.Item wrapperCol={{ span: 3, offset: 9 }}>
                                <Button type="primary" htmlType="submit" block>
                                    完成提交
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </Collapse.Panel>
                <Collapse.Panel header="员工薪水列表" key="2">
                <label
                className="ant-btn ant-btn-primary"
                style={{
                    width: '160px',
                    marginBottom: 6,
                    marginLeft: 6,
                    marginRight: 60
                }}
            >
                <UploadOutlined /> 导入excel文件
                <input id="import" type="file" style={{ display: 'none' }} />
            </label>
                    <Table dataSource={tableData} columns={columns} size="small" />
                </Collapse.Panel>
            </Collapse>
        </Panel>
    )
}
export default PageSub
