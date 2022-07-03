const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        vendor: ['react', "react-dom", "react-router-dom", "antd",]
    },
    output:{
        filename:'[name].dll.js',
        path:path.resolve(__dirname,'../public'),
        library:'_dll_[name]'
    },
    plugins:[
        new webpack.DllPlugin({
            entryOnly: true,
            name:'_dll_[name]',
            path: path.join(__dirname,'../public','[name].json')
        })
    ]
}