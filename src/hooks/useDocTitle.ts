import { useEffect } from 'react'

/**
 * 修改网站页签名
 * @param title
 */
export function useDocTitle(title: string) {
    useEffect(() => {
        const originalTitle = document.title
        document.title = title
        return () => {
            document.title = originalTitle
        }
    })
}
