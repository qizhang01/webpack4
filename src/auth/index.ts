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
}
