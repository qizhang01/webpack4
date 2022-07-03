const path = require('path');

module.exports = {
	assetsRoot: path.resolve(__dirname, '../build'),
	assetsDirectory: 'static',
	indexPath: path.resolve(__dirname, '../public/index.html'),
	productionJsSourceMap: false,
    enIndexPath: path.resolve(__dirname, '../public/en/index.html'),

	devServer: {
		port: 7777,
		host: 'localhost',
		// contentBase: path.join(__dirname, '../public'),
		watchContentBase: true,
		// compress: true,
		// historyApiFallback: true,
		hot: true,
		// clientLogLevel: 'error',
		open: true,
		// overlay: false,
		// quiet: false,
		// noInfo: false,
		// watchOptions: {
		// 	ignored: /node_modules/
		// },
		proxy: {
			"/api": {
					target: "http://129.11.9.16:1000/",
					secure: false,
					changeOrigin: true,
					pathRewrite:{'^/api': ''}
			},
			"/qax":{
				target: 'http://129.11.9.14:8752/',
				secure: false,
				changeOrigin: true,
				pathRewrite:{'^/qax': ''}
			}
	  },
	}
};
