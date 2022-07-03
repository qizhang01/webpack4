import React, { useState, useEffect } from 'react'
import { Panel } from '@/components/Panel'
import XLSX from 'xlsx'

const PageContext: React.FC = () => {
    useEffect(() => {
        document.getElementById('import')!.addEventListener('change', e => {
            inputHander(e)
        })
        return document.getElementById('import')!.removeEventListener('change', inputHander)
    }, [])

    const inputHander = (e: any) => {
        let data, workbook
        const files = e!.target!.files
        let fileReader: FileReader = new FileReader()

        // // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0])

        fileReader.onload = function(ev: any) {
            try {
                data = ev.target.result
                workbook = XLSX.read(data, {
                    type: 'binary',
                }) // 以二进制流方式读取得到整份excel表格对象
            } catch {
                alert('文件类型不正确')
                return
            }
            // 遍历每张表读取
            for (let sheet in workbook.Sheets) {
                if (workbook.Sheets[sheet]) {
                    // break; // 如果只取第一张表，就取消注释这行
                }
            }
        }
    }
    return (
        <Panel>
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
                打开excel文件
                <input id="import" type="file" style={{ display: 'none' }} />
            </label>
        </Panel>
    )
}

export default PageContext
