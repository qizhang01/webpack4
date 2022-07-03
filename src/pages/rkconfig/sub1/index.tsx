import React, { useState, useEffect } from 'react'
import { Panel } from '@/components/Panel'
import XLSX from 'xlsx'

const PageContext: React.FC = () => {
    useEffect(() => {
        inputHander()
    }, [])

    const inputHander = () => {}
    return <Panel>table</Panel>
}

export default PageContext
