import React, { useState, useEffect } from 'react'
import { Panel } from '@/components/Panel'
import fetchApi from '@/ajax/index'
import { message, Input, Table, Button } from 'antd'
import Icon, { PlusOutlined,SearchOutlined } from '@ant-design/icons'

const tableOrginData=[]

const Score= () => {
    const [dataSource, setDataSource] = useState([])
    const [columns, setColumns] = useState([])
    const loginInfo = JSON.parse(localStorage.getItem('xx-auth-key') || '')
    const [searchName, setSearchName] = useState(undefined)
    useEffect(() => {
        getScore()
    }, [])
    const getScore = async () => {
        let columns =  await getTestingLibName()
        const result = await fetchApi('api/users/allusers')
        if (result.code == 200) {

            const d = result.data.map(item=>{
                const obj={}
                if(item.score){
                    const score = item.score.split('&')
                    score.forEach(el=>{
                        const temp=el.split('=')
                        obj[temp[0]]=temp[1]
                    })
                }
                return {
                    id: item.id,
                    name: item.name,
                    ...obj
                }
            })
            tableOrginData = d
            setColumns(columns)
            setDataSource(d)
        }
    }
    const getTestingLibName = async()=>{
        let columns = []
        const result = await fetchApi('api/testing/alltestinglibname')
        if (result.code == 200) {
            columns = generateMap(result.data)
        }
        return columns
    }
    const generateMap = (d) => {
        let columns =[{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        }]
        const { name, tablename } = d[0]
        const nameArr = name.split(',')
        const tableArr = tablename.split(',')
        const result = []
        for (let i = 0; i < nameArr.length; i++) {
            columns.push({
                title: nameArr[i],
                dataIndex: tableArr[i],
                key: tableArr[i],
            })
        }
        return columns
    }
    const search =()=>{
        if(searchName){
            const d = tableOrginData.filter(item=>item.name==searchName)
            setDataSource(d)
        }else{
            setDataSource(tableOrginData)
        }
    }
    return (loginInfo.roles.includes('ADMIN') ? 
        <Panel>
            <Input placeholder="请输入员工姓名" value={searchName} onChange={e=> setSearchName(e.target.value)} style={{width: 160, margin:'0 20px 20px'}}/>
            <Button
                    onClick={search}
                    type="primary"
                    icon={<SearchOutlined />}
                >
                    搜索
            </Button>
            <Table dataSource={dataSource} columns={columns} size='small'/>;
        </Panel>: 
        <div>功能尚未完善</div>
    )
}

export default Score
