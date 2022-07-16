import { Panel } from '@/components/Panel'
import React from 'react'
import { DatePicker, Button } from 'antd'
import ReactEcharts from 'echarts-for-react'
import XLSX from 'xlsx'

let monthD = {
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        data: ['趋势图'],
    },
    toolbox: {
        show: true,
        feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true },
            saveAsImage: { show: true },
        },
    },
    textStyle: {
        color: 'rgb(24, 144, 255)',
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: [
                '一月',
                '二月',
                '三月',
                '四月',
                '五月',
                '六月',
                '七月',
                '八月',
                '九月',
                '十月',
                '十一月',
                '十二月',
            ],
        },
    ],
    yAxis: [
        {
            type: 'value',
        },
    ],
    series: [
        {
            name: '趋势图',
            type: 'line',
            stack: '总量',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            smooth: true,
            lineStyle: {
                width: '2',
                type: 'solid',
                color: '#1890ff',
            },
            areaStyle: {
                color: '#1890ff',
                opacity: '0.2',
            },
        },
    ],
}
const columns = [
    { title: '月份', dataIndex: 'time', key: 'time', width: '10%' },
    { title: '数值', dataIndex: 'count', key: 'count', width: '10%' },
]

class ReportContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            colors: [],
            selectYear: '',
            year: '',
            showData: monthD,
            isOpen: false,
            tableData: [],
        }
    }

    componentDidCatch() {}

    clearValue = () => {
        this.setState({ selectYear: '' })
    }

    handlePanelChange = (value) => {
        const v = new Date(value)
        const year = v.getFullYear()
        this.setState({
            selectYear: value,
            year,
        })
        //    this.getShowData(year)
    }

    // async getShowData(year){
    //     const param = `year=${year}`
    //     const res = await fetchAPI('report',param)
    //     const d = {
    //         ...monthD,
    //         series: this.parseData(res)
    //     }
    //     this.setState({
    //         showData: d,
    //         tableData: res
    //     })
    // }

    parseData(d) {
        let obj = {
            name: '趋势图',
            type: 'line',
            stack: '总量',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
        let series = []
        d.forEach((item) => obj.data.splice(item.time, 1, item.count))
        series.push(obj)
        return series
    }

    handleOpenChange = (status) => {
        if (status) {
            this.setState({ isOpen: true })
        } else {
            this.setState({ isOpen: false })
        }
    }
    export = () => {
        const content = XLSX.utils.table_to_book(document.getElementById('report-table'))
        XLSX.writeFile(content, `${this.state.year}-year.xlsx`)
    }

    render() {
        let { selectYear, showData, isOpen, tableData } = this.state
        return (
           <Panel>
              <div style={{marginLeft: 30}}>
                    <span style={{ color: '#000',marginRight:10 }}>请选择年份</span>
                    <DatePicker
                        placeholder="请选择年份"
                        value={selectYear}
                        mode="year"
                        format="YYYY"
                        open={isOpen}
                        onPanelChange={this.handlePanelChange}
                        onChange={this.clearValue}
                        onOpenChange={this.handleOpenChange}
                    ></DatePicker>
                    <Button
                        onClick={this.export}
                        style={{ marginLeft: 15 }}
                        type="primary"
                        disabled={tableData.length < 1}
                    >
                        导出为excel文件
                    </Button>
                </div>
                <div style={{ display: 'flex', flexFlow: 'column', margin: 30 }}>
                    <div style={{ display: 'flex', height: 400, flexShrink: 0 }}>
                        <ReactEcharts
                            option={showData}
                            style={{ height: 400, width: '100%' }}
                            className="react_for_echarts"
                        />
                    </div>
                </div>
           </Panel>
        )
    }
}
export default ReportContainer