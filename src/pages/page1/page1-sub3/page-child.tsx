import * as React from 'react'
import { SizeContext } from './size-context'
import { Button } from 'antd'

const { useContext } = React

export const PageChild: React.FC = () => {
    const { count, setCount } = useContext(SizeContext)

    return (
        <div>
            <h4>Page Child</h4>
            <Button onClick={() => setCount(count + 1)}>Add</Button>
        </div>
    )
}
