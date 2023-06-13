export const AUTH_KEY = 'xx-auth-key'
interface auth {
    id: string
    roles: string
}
export const Auth = {
    setAuth: (auth: auth) => {
        window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
        Auth.loginInfo = auth
    },

    cleanAuth: () => {
        window.localStorage.clear()
        window.location.href = '#/login'
    },
    loginInfo: window.localStorage.getItem(AUTH_KEY)
        ? JSON.parse(window.localStorage.getItem(AUTH_KEY) as string)
        : { id: '', roles: '' },
}
