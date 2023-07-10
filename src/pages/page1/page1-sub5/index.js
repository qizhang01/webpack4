
import React,{PureComponent} from 'react';
import {
    Button,
    Row,
    Table,
    Modal,
    Checkbox,
    Divider,
    Input,
} from 'antd';
import { Panel } from '@/components/Panel'
import Icon, { PlusOutlined } from '@ant-design/icons';
import { Auth } from '@/auth'
import fetchAPI from "@/ajax"
import generator  from 'generate-password';

const CheckboxGroup = Checkbox.Group;

const style={
    formItem:{
         labelCol:{span:4},
         wrapperCol:{span:20}
    }
}
const options = ['管理员', '用户', '测验', '营运', 'HR'];
const obj ={
    "ADMIN":'管理员',
    "USER": '用户',
    "TEST": '测验',
    'OPERATE': '营运',
    'HR':'HR'
}

const objMap ={
    "管理员":'ADMIN',
    "用户": 'USER',
    "测验": 'TEST',
    '营运': 'OPERATE',
    'HR':'HR'
}
export default class Index extends React.Component {
    constructor(props) {
        super(props);
    }

    state={
        isShowModel:false,
        employeeList: [],
        addRoles: [],
        addEmployeeName: '',
        ifSuccessOnce: false,  //是否成功新增至少一名
        userno: '', //员工
        departmentname: '',
        isShowSetDepModel: false,
        selectedItem: null,
        addDepartmentName: ''
    }

    columns = [
        {
            title: '工号',
            dataIndex: 'userno',
            key: 'userno'
        },{
            title: '姓名',
            dataIndex: 'name',
            key:'name'
        },{
            title: '部门',
            dataIndex: 'departmentname',
            key:'departmentname'
        },
        {
            title: '权限',
            dataIndex: 'roles',
            key:'roles',
            render: (text, record)=>{
                let arr = record.roles.split(',').map(item=>obj[item])
                return (
                    <CheckboxGroup
                        options={options}
                        value={arr}
                        onChange={(e)=>this.onChangeRoles(record,e)}
                    />
                )
            }
        },{
            title: '创建时间',
            dataIndex: 'createtime',
            key:'createtime',
            render:(text, record)=>{
                if(text){
                    const time = this.parseTime(text)
                    return (<span>{time.day+' '+time.hour}</span>)
                }else{
                    return ''
                }
            }
        },{
            title: '上次登录时间',
            dataIndex: 'lastlogintime',
            key:'lastlogintime',
            render:(text, record)=>{
                if(text){
                    const time = this.parseTime(text)
                    return (<span>{time.day+' '+time.hour}</span>)
                }else{
                    return ''
                }
            }
        },
        {
            title: 'action',
            key: 'action',
            render: (text, record) => (
              <span>
                <a href="javascript:;" onClick={()=>this.editStatus(record)}>{ record.ifopen==1?'停用':'启用' }</a>
                <Divider type="vertical"/>
                <a href="javascript:;" onClick={()=>this.initSign(record)}>重置密码</a>
                <Divider type="vertical"/>
                <a href="javascript:;" onClick={()=>this.initDeparment(record)}>项目部</a>
              </span>
            ),
        }
    ]

    componentDidMount(){
        this.getAllUsersList()
    }

    componentDidCatch(error, info) {
		
    }

    async getAllUsersList(){
        const d = await fetchAPI('api/users/allusers')
        let employeeList = d.data.map( item => {
            return {
                ...item,
                key: item.id
            }
        })
       this.setState({ employeeList})
    }

    onChangeRoles= async (record,e) =>{
        const roles = e.map(item=>objMap[item])
        const formData = {
            id: record.id,
            roles: roles.join(','),
        }
        const res = await fetchAPI('api/users/updateroles', JSON.stringify(formData),'POST')
         //刷新列表
        this.getAllUsersList()
    }

    //停用或者激活
    editStatus=async ({id,ifopen})=>{
        const res = await fetchAPI('api/users/enduse',JSON.stringify({id, ifopen}),'POST')
        //刷新列表
        res && this.getAllUsersList()
    }
    
    initDeparment = record => {
        this.setState({selectedItem: record, isShowSetDepModel: true})
    }

    initSign= async record =>{
        const password = generator.generate({
            length: 10,
            numbers: true
        });
        const formData = {
            id: record.id,
            password: password
        }
        const res = await fetchAPI('api/users/updatepassword',JSON.stringify(formData),'POST')
        if(res){
            Modal.info({
                title: '密码更改成功',
                okText:'关闭 我已记下密码',
                content: (
                    <div>
                        <p>本密码只会在这里显示，请立即抄写下来。</p>
                        <p>工号：{record.userno} </p>
                        <p>姓名：{record.name}</p>
                        <p>临时密码：<span style={{fontWeight:'bold',fontSize: '16px'}}>{password}</span></p>
                    </div>
                ),
                onOk() {},
            });
        }
    }

    addRole=()=>{
        this.setState({
            isShowModel: true,
            userno:''
        })
    }
    
    updateDepartmentName = async ()=>{
        this.setState({isShowSetDepModel:false})
        const { id} = this.state.selectedItem
        const res = await fetchAPI('/api/users/updatedepartment',JSON.stringify({id, departmentname: this.state.departmentname}),"POST")
        res && this.getAllUsersList()
    }

    submitModel=async ()=>{
        const {userno,addEmployeeName,addRoles, addDepartmentName} = this.state
        const password = generator.generate({
            length: 10,
            numbers: true
        });
        const formData = {
            userno,
            name: addEmployeeName,
            password,
            roles: addRoles.map(item=>objMap[item]).join(','),
            departmentname: addDepartmentName
        }
        console.log(formData)
        const res = await fetchAPI('/api/users/addaccount',JSON.stringify(formData),"POST")
        if(res){
            //成功
            await this.getAllUsersList();
            this.setState({
                userno:'',
                addEmployeeName:'',
                addRoles: [],
                ifSuccessOnce: true,
                isShowModel:false
            },()=>{
                Modal.info({
                    title: '新增用户成功',
                    okText:'关闭 我已记下密码',
                    content: (
                      <div>
                        <p>本密码只会在这里显示，请立即抄写下来。</p>
                        <p>工号：{userno} </p>
                        <p>姓名：{addEmployeeName}</p>
                        <p>临时密码：<span style={{fontWeight:'bold',fontSize: '16px'}}>{password}</span></p>
                      </div>
                    ),
                    onOk() {
                    }
                });
            })
        }else{

        }

    }
    
    cancelModel=()=>{
        this.setState({isShowModel: false})
        //如果新增至少一名 则需要刷新数据
        if(this.state.ifSuccessOnce){
            this.getAllUsersList()
        }
    }
    
    cancelDepModel=()=>{
        this.setState({isShowSetDepModel: false})
        this.getAllUsersList()
    }

    submitDepModel=()=>{
        this.updateDepartmentName()
    }
    onChangeCode=(e)=>{
       this.setState({
        userno: e.target.value
       })
    }
    onChangeName=(e)=>{
        this.setState({
            addEmployeeName: e.target.value
        })
    }
    onChangeDepName=(e)=>{
        this.setState({departmentname: e.target.value})
    }
    onSelectRoles=(e)=>{
        this.setState({
            addRoles:e
        })
    }

    onChangePassword=(e)=>{
        this.setState({
            password: e.target.value
        })
    }
    onChangeDepartname=(e)=>{
        this.setState({
            addDepartmentName: e.target.value
        })
    }
    parseTime=(time)=>{
        // 2019-05-03T07:41:32.36Z
        if(!time){
           return {
            day: '',
            hour:''
           }
        }
        let arr = time.split('T')
        return {
          day: arr[0],
          hour: arr[1].slice(0,5)
        }
    }

    render() {
        const loginInfo = window.localStorage.getItem('xx-auth-key')?JSON.parse(window.localStorage.getItem('xx-auth-key')):null
        if(!loginInfo || !loginInfo.roles.includes("ADMIN")){
            return (<div>功能尚未完善</div>)
        }
        const {employeeList,isShowModel,
            addEmployeeName,addRoles,
            userno, selectedItem,
            isShowSetDepModel,departmentname,
            addDepartmentName
        } = this.state
        return (
            <Panel>
                <div className='sale-record_content' style={{height: "100%",background: "#ffff",minWidth:1140, paddingRight:5}}>
                    <Button
                        type ='primary'
                        style={{marginLeft: 5, marginBottom: 10}}
                        icon={<PlusOutlined />} 
                        onClick={this.addRole}>
                        添加
                    </Button>

                    <Table
                        columns={this.columns}
                        dataSource={employeeList}
                        bordered
                        pagination = {
                            {
                                pageSize: 20,
                                showSizeChanger: true,
                            }
                        }
                    >
                    </Table>

                    <Modal
                        title="添加用户"
                        wrapClassName="vertical-center-modal"
                        width='600px'
                        visible={isShowModel}
                        onCancel={this.cancelModel}
                        footer={[
                            <Button key="close" onClick={this.cancelModel}>
                               关闭
                            </Button>,
                            <Button key="submit" disabled = {!addEmployeeName||addRoles.length<1} type="primary"  onClick={this.submitModel}>
                               确定
                            </Button>,
                        ]}
                    >
                        <Row>
                            <span style={{width: 100, display: 'inline-block',textAlign: 'right'}}>工号:</span>
                            <Input placeholder="请输入工号"
                                    onChange={this.onChangeCode}
                                    style={{ width: 200,marginLeft: 10,marginBottom: 10 }}
                                    value={userno}
                                >
                            </Input>
                        </Row>
                        <Row>
                            <span style={{width: 100, display: 'inline-block',textAlign: 'right'}}>姓名:</span>
                            <Input placeholder="姓名"
                                    onChange={this.onChangeName}
                                    style={{ width: 200,marginLeft: 10,marginBottom: 10  }}
                                    value={addEmployeeName}
                                >
                            </Input>
                        </Row>
                        <Row>
                            <span style={{width: 100, display: 'inline-block',textAlign: 'right'}}>项目部:</span>
                            <Input placeholder="项目部"
                                    onChange={this.onChangeDepartname}
                                    style={{ width: 200,marginLeft: 10,marginBottom: 10  }}
                                    value={addDepartmentName}
                                >
                            </Input>
                        </Row>
                        <Row>
                            <span style={{width: 100, display: 'inline-block',textAlign: 'right'}}>设置权限:</span>
                            <CheckboxGroup
                                disabled={!addEmployeeName}
                                options={options}
                                value={addRoles}
                                onChange={this.onSelectRoles}
                                style={{marginLeft: 10}}
                            />
                        </Row>
                    </Modal>
                    <Modal
                        title="录入项目部"
                        wrapClassName="vertical-center-modal"
                        width='600px'
                        visible={isShowSetDepModel}
                        onCancel={this.cancelDepModel}
                        footer={[
                            <Button key="close" onClick={this.cancelDepModel}>
                               关闭
                            </Button>,
                            <Button key="submit" disabled = {!departmentname} type="primary"  onClick={this.submitDepModel}>
                               确定
                            </Button>,
                        ]}
                    >
                        {/* <Row>
                            <span style={{width: 100, display: 'inline-block',textAlign: 'right'}}>姓名: {selectedItem.name}</span>
                        </Row> */}
                        <Row>
                            <span style={{width: 100, display: 'inline-block',textAlign: 'right'}}>项目部名称:</span>
                            <Input placeholder="请输入项目部名称"
                                    onChange={this.onChangeDepName}
                                    style={{ width: 200,marginLeft: 10,marginBottom: 10  }}
                                    value={departmentname}
                                >
                            </Input>
                        </Row>
                    </Modal>
                </div>
            </Panel>
        )
    }
}