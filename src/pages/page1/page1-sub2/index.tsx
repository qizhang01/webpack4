import React, { useState, useEffect } from 'react'
import { Panel } from '@/components/Panel'
import XLSX from 'xlsx'
import fetchApi from '@/ajax/index'
import { message } from 'antd'

const PageSub2: React.FC = () => {
    useEffect(() => {
        document.getElementById('import')!.addEventListener('change', e => {
            inputHander(e)
        })
        return document.getElementById('import')!.removeEventListener('change', inputHander)
    }, [])

    const inputHander = (e: any) => {
        let data,
            workbook,
            items: any[] = [],
            excelData: any[] = []
        const files = e!.target!.files
        if (!/\.(xlsx|xls)$/.test(files[0].name)) {
            return alert('文件类型不正确')
        }
        let fileReader: FileReader = new FileReader()

        // // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0])

        fileReader.onload = async function(ev: any) {
            try {
                data = ev.target.result
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
            items.map(el => {
                excelData.push(getExelArray(el))
            })
            const result = await fetchApi(
                'api/addExcelImportProduct',
                JSON.stringify(excelData),
                'POST'
            )
            console.log(result)
            if (result.code == '200') {
                message.info('提交成功')
            } else {
                message.info('提交失败, 请重新提交')
            }
        }
    }

    const getExelArray = (el: any) => {
        const goodsType = el['商品类别']
        const goodsNo = el['商品编号']
        const name = el['商品名称']
        const modelType = el['规格型号']
        const price = el['采购价']
        const unit = el['计量单位']
        const ifOpen = el['是否启用']
        const goodsProdAddress = el['产地']
        const buyDate = el['采购日期']
        const buyNumber = el['采购数量']
        const storeHouse = el['仓库']
        const deliveryAddress = el['收货地址']
        return {
            goodsType,
            goodsNo,
            name,
            modelType,
            price,
            unit,
            ifOpen: ifOpen == '是' ? 1 : 0,
            goodsProdAddress,
            buyDate,
            buyNumber,
            storeHouse,
            deliveryAddress,
        }
    }
    return (
        <Panel>
            <section
                id="section"
                style={{ display: 'flex', justifyContent: 'space-around' }}
            ></section>
            <label
                className="ant-btn ant-btn-primary"
                style={{
                    display: 'inline-block',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '200px',
                }}
            >
                导入excel文件
                <input id="import" type="file" style={{ display: 'none' }} />
            </label>
        </Panel>
    )
}

export default PageSub2
