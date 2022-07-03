import * as React from 'react'

export const SizeContext = React.createContext({
    count: 0,
    setCount: (count: number) => {
        console.log(count)
    },
})
