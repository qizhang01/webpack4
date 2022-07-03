import React, { useState, useEffect } from 'react'
import { Panel } from '@/components/Panel'
import XLSX from 'xlsx'
import QRCode from 'qrcode.react'

interface IExcel {
    单位?: string
    编号?: string
    代码?: string
}
interface IQrcode {
    url: string
    id: string | undefined
}

const PageSub2: React.FC = () => {
    let temp: IQrcode[] = []
    const [qrUrl, setQrurl] = useState(temp)

    function download(dataURL: string, name: string): void {
        let link: HTMLAnchorElement = document.createElement('a')
        link.download = name
        link.setAttribute('href', dataURL)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    function startDownload(): void {
        let dataUrl: HTMLCollectionOf<HTMLCanvasElement> = document.getElementsByTagName('canvas')
        let arr = Array.prototype.slice.call(dataUrl)
        arr.forEach(item => {
            const id = item.getAttribute('data-reactid')
            const dataUrl = item.toDataURL('image/png')
            download(dataUrl, `${id}.png`)
        })
    }

    // function delCanvas() {
    //     const parent = document.getElementById('section')
    //     if (parent) {
    //         let childs = parent.childNodes
    //         for (let i = 0; i < childs.length; i++) {
    //             parent.removeChild(childs[i])
    //         }
    //     }
    // }
    useEffect(() => {
        document.getElementById('import')!.addEventListener('change', e => {
            inputHander(e)
        })
        return document.getElementById('import')!.removeEventListener('change', inputHander)
    }, [])

    const inputHander = (e: any) => {
        let data,
            workbook,
            items: IExcel[] = [],
            baseUrl: string = 'https://www.gaodun.com/',
            excelData: IQrcode[] = []
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
                    items = items.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
                    // break; // 如果只取第一张表，就取消注释这行
                }
            }

            //循环生成qrcode并自动下载到文件夹
            items.map(el => {
                const org = el['单位']
                const code = el['编号']
                const number = el['代码']
                const url = `${baseUrl}?org=${org}&&code=${code}&&number=${number}`
                excelData.push({ url, id: org })
            })
            setQrurl(excelData)
            startDownload()
        }
    }

    return (
        <Panel>
            <section id="section" style={{ display: 'flex', justifyContent: 'space-around' }}>
                {qrUrl.map((item, index) => (
                    <div key={index}>
                        <QRCode
                            data-reactid={item.id}
                            value={item.url} //value参数为生成二维码的链接
                            size={200} //二维码的宽高尺寸
                            fgColor="#000000" //二维码的颜色
                        />
                        <span style={{ display: 'block', textAlign: 'center' }}>{item.id}</span>
                    </div>
                ))}
            </section>
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

export default PageSub2
