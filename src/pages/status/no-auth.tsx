import * as React from 'react'
import { Result, Button } from 'antd'

const NoAuth: React.FC = () => {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
        />
    )
}

export default NoAuth
