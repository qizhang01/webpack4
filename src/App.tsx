import React from 'react'
import { HashRouter as Router, useHistory } from 'react-router-dom'
import { RenderRoutes } from '@/router/RenderRoutes'
import { routes } from '@/router/router'
import { Loading } from '@/assets/images'
// import DynamicColor from 'dynamic-antd-theme'
import '@/assets/style/theme.less'

const App: React.FC = () => {
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)

        return function() {
            setTimeout(() => {
                const loading = document.getElementById('loading-wrapper')
                if (loading) {
                    loading.style.display = 'none'
                }
            }, 400)
        }
    })
    // React.useEffect(() => {
    //     let history = useHistory()
    //     history.push('/login')
    // }, [])
    return (
        <>
            {/*<DynamicColor style={{ display: 'none' }} primaryColor="#77dd66" />*/}
            <section id="loading-wrapper" style={{ opacity: loading ? 1 : 0 }}>
                <img src={Loading} alt="" />
            </section>

            <Router>{RenderRoutes(routes, true)}</Router>
        </>
    )
}

export default App
