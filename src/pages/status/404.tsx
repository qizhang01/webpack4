import React from 'react'
import { Button, Result } from 'antd'

const NoMatch: React.FC = () => {
    // 重定向到 root 页面
    if (window.location.hash === '#/') {
        window.location.href = '#/root'
        return <div />
    }

    return (
        <Result
            status="404"
            title="404 Not Found"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Button type="primary" onClick={() => window.history.back()}>
                    Back
                </Button>
            }
        />
    )
}

export default NoMatch
