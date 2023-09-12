import React, { useState } from 'react'
import {
    Form,
    Select,
    Input,
    InputNumber,
    Button,
    Table,
    Collapse,
    message,
    Divider,
    Popconfirm,
    Modal,
    Row,
} from 'antd'
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
const InputNumberStl = { width: '50%' }

const PageSub: React.FC = () => {
    const emptylist: any[] = []
    const [totalTableData, setTotalTableData] = React.useState([])
    const [method, setMethod] = useState('日结')
    const [tableData, setTableData] = useState(emptylist)
    const [isShowModel, setIsShowModel] = React.useState(false)

    let [selectedItem, setSelectedItem] = React.useState({})
    const [salaryLabel, setSalaryLabel] = React.useState('日薪')

    const [foodpayday, setFoodpayday] = React.useState(0) //餐补
    const [salaryday, setSalaryday] = React.useState(0)
    const [worklongsalary, setWorklongsalary] = React.useState(0)
    const [worklong, setWorklong] = React.useState(0)
    const [middlepay, setMiddlepay] = React.useState(0)
    const [nightpay, setNightpay] = React.useState(0)
    const [salaryworkovertime, setSalaryworkovertime] = React.useState(0)

    const [tableLoading, setTableLoading] = useState(false)
    const cache = localStorage.getItem('xx-auth-key')
        ? JSON.parse(localStorage.getItem('xx-auth-key') || '')
        : null
    const roles = cache.roles
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
            sorter: (a: any, b: any) =>
                Number(a.employeeid.substr(1, a.employeeid.length - 1)) -
                Number(b.employeeid.substr(1, b.employeeid.length - 1)),
        },
        {
            title: '所在部门',
            dataIndex: 'departmentname',
            key: 'departmentname',
        },
        {
            title: '日薪/月薪',
            dataIndex: 'salaryday',
            key: 'salaryday',
            render(text: string, record: any) {
                return (
                    <span>
                        <a href="javascript:;">
                            {record.salarytype !== '日结' ? `${text}(月薪)` : text}
                        </a>
                    </span>
                )
            },
        },
        {
            title: '加班时薪',
            dataIndex: 'salaryworkovertime',
            key: 'salaryworkovertime',
        },
        {
            title: '中班补贴',
            dataIndex: 'salarymiddleworkday',
            key: 'salarymiddleworkday',
        },
        {
            title: '晚班补贴',
            dataIndex: 'salarynightworkday',
            key: 'salarynightworkday',
        },
        {
            title: '餐补',
            dataIndex: 'foodpayday',
            key: 'foodpayday',
        },
        {
            title: '上月薪水',
            dataIndex: 'totalSalary',
            key: 'totalSalary',
            sorter: (a: any, b: any) => a.totalSalary - b.totalSalary,
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
            render: (text: any, record: any) =>{
                if(roles.includes('HR')|| roles.includes('ADMIN')){
                    return (
                        <span>
                            <a href="javascript:;" onClick={() => reset(record)}>
                                调薪
                            </a>
                            <Divider type="vertical"/>
                            <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record)}>
                                <a>删除</a>
                            </Popconfirm>
                        </span>
                    )
                }
            },
        },
    ]
    const onSearch =(v:String)=>{
        if(v.length==0 || v=="" || !v){
            setTableData(totalTableData)
        }else{
            const filter = tableData.filter(item => item.employeeid.includes(v) || item.name==v)
            setTableData(filter)
        }
    }
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
                salaryworkovertime,
                salaryday,
                worklong=0,
                worklongmoney=0,
                salarymiddleworkday,
                salarynightworkday,
                foodpayday
            } = values
            body = {
                salarytype,
                name,
                employeeid,
                salaryworkovertime,
                salaryday,
                worklong,
                worklongmoney,
                salarymiddleworkday,
                salarynightworkday,
                totalSalary,
                userno: Auth.loginInfo.id,
                foodpayday
            }
            path = 'savesimpleday'
        } else if (salarytype === '月结') {
            const {
                name,
                employeeid,
                salaryworkovertime,
                salaryday,
                salarymiddleworkday,
                salarynightworkday,
                foodpayday
            } = values
            body = {
                salarytype,
                name,
                employeeid,
                salaryworkovertime,
                salarymiddleworkday,
                salarynightworkday,
                salaryday,
                userno: Auth.loginInfo.id,
                foodpayday
            }
            path = 'savesimplemonth'
        }

        const result = await fetchApi(`api/salary/${path}`, JSON.stringify(body), 'POST')
        console.log(result)
        if (result.code == '200') {
            message.info(`提交成功`)
        } else {
            message.info('提交失败, 请重新提交')
        }
    }

    const downloadSalaryTable=()=>{
        if(tableData.length>0){
            const year = new Date().getFullYear()
            const month = new Date().getMonth() + 1
            let monthStr = month.toString()
            if(month<10) monthStr = `0${monthStr}`
            // const content = XLSX.utils.table_to_book(document.getElementById('salary-table'))
            const topic = ['结算方式','姓名','员工id','日薪/月薪','加班时薪','中班补贴','晚班补贴','餐补','本月薪水','工龄']
            const d = tableData.map(item => [item.salarytype, item.name, item.employeeid, item.salaryday,
                item.salaryworkovertime, item.salarymiddleworkday, item.salarynightworkday, item.foodpayday,
                item.totalSalary, item.worklong
            ])

            const content = XLSX.utils.aoa_to_sheet([topic, ...d])
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook,content)
            XLSX.writeFile(workbook, `salary-${year}-${monthStr}.xlsx`)
        }
    }


    const selectMethod = (value: string) => {
        setMethod(value)
        if(value=="日结"){
            setSalaryLabel("日薪")
        }else{
            setSalaryLabel("月薪")
        }
    }
    const handleDelete = async (record: any)=>{
        const {salarytype, name, employeeid}=record
        const body = {
            salarytype,
            employeeid
        }
        const result = await fetchApi(`api/salary/delete`, JSON.stringify(body), 'POST')
        if (result.code == '200') {
            message.info(`删除成功`)
            query()
        } else {
            message.info('提交失败, 请重新提交')
        }
    }
    
    const submitModel = async () => {
        let body: any = {
            ...selectedItem,
        }
        if(salaryday>=0){
            body.salaryday = salaryday
        }
        if(worklong>=0){
            body.worklong = worklong
        }
        if(worklongsalary>=0){
            body.worklongsalary = worklongsalary
        }
        if(salaryworkovertime>=0){
            body.salaryworkovertime = salaryworkovertime
        }
        if(foodpayday>=0){
            body.foodpayday = foodpayday
        }
        if(middlepay>=0){
            body.salarymiddleworkday = middlepay
        }
        if(nightpay>=0){
            body.salarynightworkday = nightpay
        }
        const result = await fetchApi(`api/salary/update`, JSON.stringify(body), 'POST')
        if (result.code == '200') {
            message.info(`提交成功`)
            query()
        } else {
            message.info('提交失败, 请重新提交')
        }
    }

    const reset=(record:any)=>{
        setIsShowModel(true)
        const {salarytype, name, employeeid,  salaryday, worklong=0, worklongmoney=0, salaryworkovertime, foodpayday,salarymiddleworkday, salarynightworkday}=record
        if(salarytype=="日结"){
            setSalaryLabel("日薪")
        }else{
            setSalaryLabel("月薪")
        }
        setSelectedItem({
            salarytype,
            name,
            employeeid,
            salaryday,
            worklong,
            worklongmoney,
            salaryworkovertime,
            foodpayday,
            salarymiddleworkday,
            salarynightworkday
        })
        setFoodpayday(foodpayday)
        setSalaryday(salaryday)
        setWorklongsalary(worklongmoney)
        setWorklong(worklong)
        setMiddlepay(salarymiddleworkday)
        setNightpay(salarynightworkday)
        setSalaryworkovertime(salaryworkovertime)
    }
    
    const query = async () => {
        setTableLoading(true)
        const cache = localStorage.getItem('xx-auth-key')
        ? JSON.parse(localStorage.getItem('xx-auth-key')||"")
        : null
        const {roles, departmentname} = cache
        const result = await fetchApi('api/salary/getallemployeesalary',JSON.stringify({roles, departmentname}), "POST")
        if (result.code == '200') {
            const d = result.data
            setTableData(d)
            setTotalTableData(d)
            setTableLoading(false)
        } else {
            message.info('查询失败, 请重新提交')
        }
    }
    const onChange = (key: any) => {
        if (key == 2) {
            query()
        }
    }
    const inputHander = (e:any) => {
        let data,
            workbook,
            items:any[] = [],
            excelData= new Map(),
            lastJson: any={}
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
            items.map((el, index) => {
                const obj=getExelArray(el, index)
                excelData.set(obj.personNo, obj)
            }) 
            
            //遍历所有数据修改本月的工资信息
            tableData.forEach(item=>{
                const {employeeid,salarytype ,salaryday, worklong=0, worklongmoney=0, salaryworkovertime=0, salarymiddleworkday=0,
                    salarynightworkday=0, foodpayday =0}= item
                if(excelData.has(employeeid)){
                    const {workday, daytotal, holidays=0, monthholiday=0, factrestdays=0, overtimehours=0, 
                        nightworkday=0, middleworkday=0, monthCountryHoliday = 0, addedPay =0, deledPay = 0} = excelData.get(employeeid)
                    let totalSalary:number = 0
                    if(salarytype=="日结"){
                        totalSalary = workday * (foodpayday + salaryday + (worklong * worklongmoney) / daytotal) + overtimehours*salaryworkovertime + middleworkday*salarymiddleworkday + nightworkday*salarynightworkday + addedPay - deledPay
                    }else{
                        const num = workday + holidays + monthCountryHoliday  //实际工作天数 + 积累假期 + 当月国家法定
                        const shouldworkday = daytotal - monthholiday //当月天数 - 月休息天数
                        if(num>shouldworkday){
                            totalSalary = salaryday + workday * foodpayday+ addedPay - deledPay
                        }else {
                            totalSalary = workday * foodpayday + Number(salaryday * num/shouldworkday ) + overtimehours*salaryworkovertime+ middleworkday*salarymiddleworkday + nightworkday*salarynightworkday + addedPay - deledPay
                        }
                    }
                    lastJson[employeeid] = {totalSalary,salarytype}
                }
            })

            const result = await fetchApi(
                'api/salary/updatetotalsalary',
                JSON.stringify(lastJson),
                'POST'
            )
            if (result.code == '200') {
                // message.info('提交成功')
                query()
            }else {
                message.info(result);
            }
        }
    }

    const getExelArray = (el:any, index:number) => {
        const personNo = el['员工编号']
        const workday = el['出勤']
        const daytotal = el['当月天数']
        const monthholiday = el['月休息天数']
        const holidays = el['积累假期']
        const factrestdays = el['月休天数']
        const overtimehours = el['加班时长']
        const middleworkday = el['中班天数']
        const nightworkday = el['晚班天数']
        const monthCountryHoliday = el['法定假期']
        const addedPay = el['补发']
        const deledPay = el['扣除']
        return {
            personNo,
            workday,
            daytotal,
            monthholiday,
            holidays,
            factrestdays,
            overtimehours,
            middleworkday,
            nightworkday,
            monthCountryHoliday,
            addedPay,
            deledPay
        }
    }
    React.useEffect(() => {
        if(document.getElementById('importSalary')){           
            document.getElementById('importSalary')?.addEventListener('change', e => {
                inputHander(e)
            })
            return document.getElementById('importSalary')?.removeEventListener('change', inputHander)
        }   
    })

    return (
        <Panel>
            <Collapse onChange={onChange} accordion>
                <Collapse.Panel header="员工薪水录入" key="1">
                    <Form name="config-form" {...formItemLayout} onFinish={onFinish}>
                        <Form.Item name="salarytype" label="核算方式">
                            <Select
                                defaultValue="日结"
                                style={{ width: 180 }}
                                onChange={selectMethod}
                            >
                                <Option value="日结">日结</Option>
                                <Option value="月结">月结</Option>
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
                        <Form.Item name="salaryday" label={salaryLabel} rules={[{ required: true, message: '必须输入日/月工资' }]}>
                                <InputNumber placeholder={`请输入${salaryLabel}`} style={InputNumberStl} />
                        </Form.Item>
                        <Form.Item name="salaryworkovertime" label="加班时薪" rules={[{ required: true, message: '必须输入加班工资' }]}>
                                <InputNumber placeholder="加班时薪" style={InputNumberStl} />
                        </Form.Item>
                        <Form.Item name="foodpayday" label="餐补" rules={[{ required: true, message: '必须输入餐补' }]}>
                                <InputNumber placeholder="餐补" style={InputNumberStl} />
                        </Form.Item>
    
                        <Form.Item name="salarymiddleworkday" label="中班工资" rules={[{ required: true, message: '必须输入中班工资' }]}>
                                <InputNumber placeholder="请输入中班工资" style={InputNumberStl} />
                        </Form.Item>
                        <Form.Item name="salarynightworkday" label="晚班工资" rules={[{ required: true, message: '必须输入晚班工资' }]}>
                                <InputNumber placeholder="请输入晚班工资" style={InputNumberStl} />
                        </Form.Item>
                        <div style={{ display: method == '日结' ? 'block' : 'none' }}>
                            <Form.Item name="worklong" label="工龄">
                                <InputNumber placeholder="请输入工龄" style={InputNumberStl} />
                            </Form.Item>

                            <Form.Item name="worklongmoney" label="工龄月薪">
                                <InputNumber placeholder="请输入工龄月薪" style={InputNumberStl} />
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
                        <input id="importSalary" type="file" style={{ display: 'none' }} />
                    </label>
                    <Input.Search placeholder="输入员工名字或者id" allowClear onSearch={onSearch} style={{ width: 200, marginRight: 200 }} />
                    <Button 
                        onClick={downloadSalaryTable}
                        type = "primary"
                        >下载薪水表
                    </Button>
                    <Table dataSource={tableData} loading = {tableLoading} columns={columns} size="small" id="salary-table"/>
                    <Modal
                        title="修改薪水"
                        wrapClassName="vertical-center-modal"
                        width="600px"
                        visible={isShowModel}
                        onCancel={() => setIsShowModel(false)}
                        footer={[
                            <Button key="close" onClick={() => {
                                setIsShowModel(false)
                                setFoodpayday(0)
                                setWorklongsalary(0)
                                setSalaryday(0)
                                setSalaryworkovertime(0)
                                setWorklong(0)
                            }}>
                                关闭
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                disabled={
                                    !salaryday  &&             
                                    !worklong  &&
                                    !salaryworkovertime &&
                                    !foodpayday && 
                                    !worklongsalary
                                }
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
                                {salaryLabel}:
                            </span>
                            <InputNumber
                                placeholder={`请输入${salaryLabel}`}
                                onChange={value=> {
                                    setSalaryday(value)
                                }}
                                style={{ width: 200, marginLeft: 10, marginBottom: 10 }}
                                value={salaryday}
                            ></InputNumber>
                        </Row>
                        <Row>
                            <span
                                style={{
                                    width: 100,
                                    display: 'inline-block',
                                    textAlign: 'right',
                                }}
                            >
                                加班时薪:
                            </span>
                            <InputNumber
                                placeholder="请输入加班时薪"
                                onChange={value=> {
                                    setSalaryworkovertime(value)
                                }}
                                style={{ width: 200, marginLeft: 10, marginBottom: 10 }}
                                value={salaryworkovertime}
                            ></InputNumber>
                        </Row>
                        <Row>
                            <span
                                style={{
                                    width: 100,
                                    display: 'inline-block',
                                    textAlign: 'right',
                                }}
                            >
                                中班补贴:
                            </span>
                            <InputNumber
                                placeholder="请输入中班补贴"
                                onChange={value=> {
                                    setMiddlepay(value)
                                }}
                                style={{ width: 200, marginLeft: 10, marginBottom: 10 }}
                                value={middlepay}
                            ></InputNumber>
                        </Row>
                        <Row>
                            <span
                                style={{
                                    width: 100,
                                    display: 'inline-block',
                                    textAlign: 'right',
                                }}
                            >
                                夜班补贴:
                            </span>
                            <InputNumber
                                placeholder="请输入夜班补贴"
                                onChange={value=> {
                                    setNightpay(value)
                                }}
                                style={{ width: 200, marginLeft: 10, marginBottom: 10 }}
                                value={nightpay}
                            ></InputNumber>
                        </Row>
                        <Row>
                            <span
                                style={{
                                    width: 100,
                                    display: 'inline-block',
                                    textAlign: 'right',
                                }}
                            >
                                餐补:
                            </span>
                            <InputNumber
                                placeholder="请输入每日餐补"
                                onChange={value => {
                                    setFoodpayday(value)
                                }}
                                style={{ width: 200, marginLeft: 10, marginBottom: 10 }}
                                value={foodpayday}
                            ></InputNumber>
                        </Row>
                        <Row>
                            <span
                                style={{
                                    width: 100,
                                    display: 'inline-block',
                                    textAlign: 'right',
                                }}
                            >
                                工龄:
                            </span>
                            <InputNumber
                                placeholder="请输入工龄"
                                onChange={value => {
                                    setWorklong(value)
                                }}
                                style={{ width: 200, marginLeft: 10, marginBottom: 10 }}
                                value={worklong}
                            ></InputNumber>
                        </Row>
                        <Row>
                            <span
                                style={{
                                    width: 100,
                                    display: 'inline-block',
                                    textAlign: 'right',
                                }}
                            >
                                工龄薪水:
                            </span>
                            <InputNumber
                                placeholder="请输入工龄薪水"
                                onChange={value => {
                                    setWorklongsalary(value)
                                }}
                                style={{ width: 200, marginLeft: 10, marginBottom: 10 }}
                                value={worklongsalary}
                            ></InputNumber>
                        </Row>
                        <Row>

                        </Row>
                    </Modal>
                </Collapse.Panel>
            </Collapse>
        </Panel>
    )
}
export default PageSub
