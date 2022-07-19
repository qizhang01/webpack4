const AUTH_KEY = 'xx-auth-key'

export const Auth = {
    authContent: window.localStorage.getItem(AUTH_KEY),

    setAuth: (auth: string) => {
        window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
    },

    cleanAuth: () => {
        window.localStorage.clear()
        window.location.href = '#/login'
    },
    loginInfo: window.localStorage.getItem(AUTH_KEY)
        ? JSON.parse(window.localStorage.getItem(AUTH_KEY) as string)
        : null,
}
