import * as React from 'react'
import { Button } from 'antd'
import { cssVar, cssContent } from '@/pages/home/theme'
import './index.less'

const Home: React.FC = () => {
    const onChangeColor = () => {
        let styleNode = document.getElementById('dynamic_antd_theme_custom_style')
        if (!styleNode) {
            styleNode = document.createElement('style')
            styleNode.id = 'dynamic_antd_theme_custom_style'
            styleNode.innerHTML = `${cssVar}\n${cssContent}`
            const dom = document.getElementById('custom-style-dom')
            dom && dom.appendChild(styleNode)
        } else {
            styleNode.innerHTML = `${cssVar}\n${cssContent}`
        }
    }

    return (
        <div className="home-wrapper">
            <Button type="primary" onClick={() => onChangeColor()}>
                {/* Change theme */}
            </Button>
        </div>
    )
}

export default Home
