const env = process.env.NODE_ENV === 'development'

export default {
    qax: env ? '/qax' : '',
}
