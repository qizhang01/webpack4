export default (url: string, options?: any, method = 'GET') => {
    let params = {}
    if (method === 'GET') {
        // 如果是GET请求，拼接url
        params = {
            method,
        }
    } else {
        params = {
            method,
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }),
            body: options,
        }
    }
    return fetch(url, params)
        .then(res => res.json())
        .then(res => {
            return res
        })
        .catch(err => console.log(err))
}
