import React from 'react'
import PropTypes from 'prop-types'
import { RadioChangeEvent } from 'antd'
import { Radio, Space } from 'antd'

interface Itype {
    topic: string
    selectItem: string[]
    onChange: Function
    value: string
}

export const Testingcontent: React.FC<Itype> = (props: Itype) => {
    const [value, setValue] = React.useState<string | undefined>(props.value)

    const onChange = (e: RadioChangeEvent) => {
        props.onChange(e)
        console.log('radio checked', e.target.value)
        setValue(e.target.value)
    }
    React.useEffect(() => {
        // setValue(props.value)
    })
    return (
        <div style={{ padding: 12 }}>
            <div style={{ marginBottom: 6 }}>{props.topic}</div>
            <Radio.Group onChange={onChange} value={value}>
                <Space direction="vertical">
                    {props.selectItem.map((item, index) => (
                        <Radio key={index} style={{ margin: 4, color: 'white' }} value={index}>
                            {item}
                        </Radio>
                    ))}
                </Space>
            </Radio.Group>
        </div>
    )
}

Testingcontent.propTypes = {
    topic: PropTypes.string.isRequired,
}
