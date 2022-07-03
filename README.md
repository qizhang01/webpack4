## 脚手架要达到的需求

- webpack的配置
- 对静态资源（图片，模板等）的处理
- 使react项目支持typescript，eslint，prettier等工具
- 优化webpack配置，减小代码的体积
- 支持不同的css预处理器（less，sass等）
- 一套好用的样式方案
- 使项目支持多个环境切换（开发，测试，预发布，生产等）
- 使用规则来自动约束代码规范
- 优化开发体验
- 一些优化项目性能的建议



## Git规则
用 husky + commitlint 来规范git提交。

> `husky`会为`git`增加钩子，在`commit`时执行一系列操作，`commitlint`可以检查`git message`是否符合规则。

在 package.json 中增加配置如下：

```javascript
"husky": {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
```
在根目录新建文件 [.commitlintrc.js](https://github.com/zyj7815/react-ts-basic/blob/master/.commitlintrc.js)，根据具体情况配置。


## babel 和 typescript

```
$ npm i core-js@2 # babel的按需引入依赖
$ npm i -D @babel/plugin-proposal-class-properties # 能够在class中自动绑定this的指向
$ npm i -D typescript awesome-typescript-loader # 处理ts，主要就靠它
$ npm i -D html-loader html-webpack-plugin # 顺便把html的支持做好

```

在根目录新建[tsconfig.json](https://github.com/zyj7815/react-ts-basic/blob/master/tsconfig.json)。


## 完善webpack打包配置

每次打包前最好能把上一次生成的文件删除
```
$ npm i -D clean-webpack-plugin
```

修改webpack基础配置：
```javascript
// webpack.base.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    plugins: [
        new CleanWebpackPlugin(),
    ]
}
```


- 在生产环境，部署新版本后能够丢弃缓存，保留没有被改动的文件的缓存；
- 在开发环境，完全不使用缓存。

```javascript
// webpack.prod.js 生产环境打包配置
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge.smart(baseWebpackConfig, {
    mode: 'production',
    devtool: sourceMapsMode,
    output: {
        filename: 'js/[name].[contenthash:8].js', // contenthash：只有模块的内容改变，才会改变hash值
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
}
```

```javascript
// webpack.dev.js 开发环境的配置
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base');
const config = require('./config');

module.exports = merge.smart(baseWebpackConfig, {
    mode: 'development',
    output: {
        filename: 'js/[name].[hash:8].js',
        publicPath: config.publicPath // 这里可以省略
    },
    module: {
        rules: [{
            oneOf: []
        }]
    },
}
```

编辑`build.js`
```javascript
// config/build.js
const webpack = require('webpack');
const webpackConfig = require('./webpack.prod');

webpack(webpackConfig, function (err, stats) {});
```

安装工具并添加启动命令：

```
$ npm i -D cross-env
```

```json
// package.json
{
    "scripts": {
        "dev": "cross-env NODE_ENV=development webpack-dev-server --config ./config/webpack.dev.js",
        "build": "cross-env NODE_ENV=production node config/build.js"
    }
}
```

## 打包分析工具

```
$ npm i -D webpack-bundle-analyzer
```
根据打包的命令参数，在打包时自动生成或不生成分析报告。

```javascript
// webpack.base.js
const argv = require('yargs').argv;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const merge = require('webpack-merge');

const bundleAnalyzerReport = argv.report; // 根据命令参数是否含有 'report' 来决定是否生成报告
// 这个配置将合并到最后的配置中
const webpackConfig = {
    plugins: []
};
if (bundleAnalyzerReport) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: path.join(config.assetsRoot, './report.html')
    }));
}
// 改用merge来合并配置
module.exports = merge(webpackConfig, {
    // ...configs
});
```

在package.json打包命令中增加参数：

```json
"scripts": {
    "build": "cross-env NODE_ENV=production node config/build.js --report"
}
```


#### 支持less和css modules
```
$ npm i -D style-loader css-loader less less-loader
```
增加配置

```javascript

// webpack.base.js
module: {
    rules: [
        {
            oneOf: [
                // ... configs
                {
                    test: /\.(less|css)$/,
                    use: [
                        { loader: 'style-loader' },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: false // 如果要启用css modules，改为true即可
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: { javascriptEnabled: true }
                        }
                    ]
                },
            ]
        }
    ]
}
```



## 提取css

将css从js中剥离出来

```
$ npm i -D optimize-css-assets-webpack-plugin
```

增加打包配置：

```javascript
// webpack.prod.js
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// ...webpack configs
optimization: {
    minimizer: [
        new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: true ? { map: { inline: false } } : {}
        })
    ]
}
```


## 自动增加css前缀

使用postcss，自动为css增加浏览器前缀。

```
$ npm i -D postcss-loader autoprefixer
```

增加webpack配置：

```
// webpack.base.js，webpack.prod.js
{
    test: /\.(less|css)$/,
        use: [
            { loader: 'style-loader' },
            {
                loader: 'css-loader',
                options: {
                    modules: false
                }
            },
            'postcss-loader', // 注意插入的位置，webpack.prod.js也要加这一项！！！
            {
                loader: 'less-loader',
                options: { javascriptEnabled: true }
            }
        ]
},
```

在根目录新建`postcss.config.js`：

```
module.exports = {
    plugins: {
        autoprefixer: {}
    }
};
```

在`package.json`中增加配置：

```json
"browserslist": [
  "> 1%",
  "last 2 versions",
  "not ie <= 8",
  "iOS >= 8",
  "Firefox >= 20",
  "Android > 4.4"
]
```



## postcss-px-to-viewport

修改`postcss.config.js`，利用`postcss`做基于`vh`，`vw`布局的配置。

```
$ npm i -D postcss-aspect-ratio-mini postcss-px-to-viewport postcss-write-svg
$ npm i -D cssnano cssnano-preset-advanced
```

安装依赖：

```javascript
module.exports = {
    plugins: {
        'postcss-aspect-ratio-mini': {},
        'postcss-write-svg': {
            utf8: false
        },
        // 适配移动端
        'postcss-px-to-viewport': {
            viewportWidth: 750,
            viewportHeight: 1334,
            unitPrecision: 3,
            viewportUnit: 'vw',
            selectorBlackList: ['.ignore', '.hairlines'],
            minPixelValue: 1,
            mediaQuery: false
        },
        cssnano: {
            'cssnano-preset-advanced': {
                zindex: false,
            }
        },
        autoprefixer: {}
    }
};

```

配置完成后，如果是基于750px宽度设计图，那么设计图上1px就直接在样式中写1px即可，打包时会自动转为vw单位。



## 处理静态资源

依然先装依赖：

```
$ npm i -D url-loader file-loader
$ npm i -D @svgr/webpack # 顺带支持一下导入svg图片
```

增加webpack配置：
```javascript
// webpack.base.js
rules: [
    {
        test: /\.svg$/,
        use: ['@svgr/webpack']
    },
    {
        test: /\.(jpg|jpeg|bmp|png|webp|gif)$/,
        loader: 'url-loader',
        options: {
            limit: 8 * 1024, // 小于这个大小的图片，会自动base64编码后插入到代码中
            name: 'img/[name].[hash:8].[ext]',
            outputPath: config.assetsDirectory,
            publicPath: config.assetsRoot
        }
    },
    // 下面这个配置必须放在最后
    {
        exclude: [/\.(js|mjs|ts|tsx|less|css|jsx)$/, /\.html$/, /\.json$/],
        loader: 'file-loader',
        options: {
            name: 'media/[path][name].[hash:8].[ext]',
            outputPath: config.assetsDirectory,
            publicPath: config.assetsRoot
        }
    }
]
```

> 生产环境需要合理使用缓存，需要拷贝一份同样的配置在webpack.prod.js中，并将name中的hash改为contenthash

把public目录里除了index.html以外的文件都拷贝一份到打包目录中

```
$ npm i -D copy-webpack-plugin
```

增加配置：

```javascript
// webpack.base.js
const CopyWebpackPlugin = require('copy-webpack-plugin');

plugins: [
    // ...other plugins
    new CopyWebpackPlugin([
        {
            from: 'public',
            ignore: ['index.html']
        }
    ])
]

```


## 提取公共模块，拆分代码

有些模块是公共的，如果不把他拆分出来，那么会在每一个被引入的模块中出现，所以需要优化与此相关的配置。

``` javascript
// webpack.prod.js
entry: {
    app: './src/index.tsx',
    vendor: ['react', 'react-dom'] // 不变的代码分包
},
optimization: {
    splitChunks: {
        chunks: 'all',
        minChunks: 2,
        maxInitialRequests: 5,
        cacheGroups: {
            // 提取公共模块
            commons: {
                chunks: 'all',
                test: /[\\/]node_modules[\\/]/,
                minChunks: 2,
                maxInitialRequests: 5,
                minSize: 0,
                name: 'common'
            }
        }
    }
}
```


## 压缩代码 old

安装依赖：

```
$ npm i -D uglifyjs-webpack-plugin mini-css-extract-plugin compression-webpack-plugin
```

增加和修改配置：

```javascript
// webpack.prod.js
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

rules: {
    test: /\.(less|css)$/,
    use: [
        MiniCssExtractPlugin.loader, // 注意书写的顺序
        {
            loader: 'css-loader',
        },
        'postcss-loader',
        {
            loader: 'less-loader',
            options: {
                javascriptEnabled: true,
            }
        }
    ]
},
// ...configs

plugins: [
    new HtmlWebpackPlugin({
        template: config.indexPath,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeOptionalTags: false,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeAttributeQuotes: true,
            removeCommentsFromCDATA: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        }
    }),
    new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css'
        // chunkFilename: '[name].[contenthash:8].chunk.css'
    }),
    // gzip压缩
    new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240, // 大于这个大小的文件才会被压缩
        minRatio: 0.8
    }),
],

optimization: {
    minimizer: [
        new UglifyjsWebpackPlugin({
            sourceMap: config.productionJsSourceMap
        })
    ]
}
```


## 压缩代码 new 使用terser

> 由于uglify-es已经停止维护，所以改用目前比较流行的terser来压缩js代码。

首先安装依赖：

```
$ npm i -D terser-webpack-plugin
```

然后改写`webpack.prod.js`

```javascript
// const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

optimization: {
    minimizer: [
        // new UglifyjsWebpackPlugin({
        //   sourceMap: config.productionJsSourceMap
        // })
        new TerserPlugin({
            sourceMap: config.productionJsSourceMap
        })
    ]
}
```



## 配置webpack开发服务器

处理通用配置`config.js`

```javascript
module.exports = {
    // ...configs
    devServer: {
        port: 8080,
        host: 'localhost',
        contentBase: path.join(__dirname, '../public'),
        watchContentBase: true,
        publicPath: '/',
        compress: true,
        historyApiFallback: true,
        hot: true,
        clientLogLevel: 'error',
        open: true,
        overlay: false,
        quiet: false,
        noInfo: false,
        watchOptions: {
        ignored: /node_modules/
        },
        proxy: {}
    }
};
```

增加开发配置

```javascript
// webpack.dev.js
const path = require('path');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const config = require('./config');

module.exports = merge.smart(baseWebpackConfig, {
    mode: 'development',
    output: {
        filename: 'js/[name].[hash:8].js',
        publicPath: config.publicPath
    },
    module: {
        rules: [
            {
                oneOf: []
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: config.indexPath,
            minify: {
                html5: true
            },
            hash: false
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        ...config.devServer
    }
});
```

在`package.json`中增加开发环境运行命令：

```json
"scripts": {
     "dev": "cross-env NODE_ENV=development webpack-dev-server --config ./config/webpack.dev.js"
}
```


## 自动寻找空闲端口监听

> 如果8080端口已经被占用，利用[portfinder](https://github.com/http-party/node-portfinder)来自动搜索空闲的端口。

首先安装依赖：

```
$ npm i -D portfinder
```

然后增加如下配置：

```javascript
// webpack.dev.js
const portfinder = require('portfinder'); // 增加依赖

/* 将module.exports = merge.smart()修改为如下形式 */
const devWebpackConfig = merge.smart(/* ... */);

/* 寻找可用端口，并返回一个promise类型的配置，webpack可以接收promise作为配置 */
module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = config.devServer.port;
    portfinder.getPort((err, port) => {
        if (err) reject(err)
        else {
            devWebpackConfig.devServer.port = port;
        }
        resolve(devWebpackConfig)
    })
});
```


## 自定义多环境

在开发应用的时候会面临多个环境差异的问题

- 一个开发环境，提交代码即可立刻看到效果，它的接口地址可能是`http://dev-api.xxx.com`
- 一个测试环境，它需要保持一定程度的稳定性，每隔一小时发布一次新版本，接口地址可能是：`https://t1-api.xxx.com`
- 预发布环境，它与生产环境共享持久化数据，在这个环境做最后一次检查，等待发布
- 生产环境，他需要保持高度稳定，一周发布一个版本，接口地址可能是：`https://api-xxx.tom`

四套环境，不同的接口地址，不同的访问地址，可能还涉及到不同的付宝鉴权。

许多人采用的方案是这样的，写几个不同的配置文件，切换环境时修改引入的配置，但是这样做经常会忘记切环境导致生产事故。这里提供一套自动多环境的配置方案。

依然先安装依赖：

```
$ npm i -D dotenv dotenv-expand # 从配置文件中读取并注入环境变量
$ npm i -D interpolate-html-plugin # 向模板注入环境变量
```

在根目录下新建几个环境配置文件：`.env，.env.dev，.env.prod`，文件名的格式是固定的，符合 `.env[.name][.local]`即可，同名的配置会按照优先级覆盖或自动合并，例如环境名称是dev，那么优先级就是`.env.dev.local，.env.dev，.env.local，.env，`高优先级覆盖低优先级。

随意编写一个环境变量配置：

```js
// .env.dev
// 变量名要以 REACT_APP_ 开头
REACT_APP_ENV='dev'
REACT_APP_API_ROOT='http://dev-api.tianzhen.tech'
```

在`config`目录下新建一个`env.js`文件，用这个脚本来读取环境变量配置，用于以后注入到react项目中：

```js
const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const env = argv.env || 'production';
const ENV_FILE_PATH = path.resolve(__dirname, '../.env');

let dotenvFiles = [
    `${ENV_FILE_PATH}.${env}.local`,
    `${ENV_FILE_PATH}.${env}`,
    env !== 'test' && `${ENV_FILE_PATH}.local`,
    ENV_FILE_PATH
].filter(Boolean);

dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
        dotenvExpand(dotenv.config({
            path: dotenvFile
        }));
    }
});

const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
    publicUrl = process.env.NODE_ENV === 'production' ? publicUrl.slice(0, -1) : '';
    const raw = Object.keys(process.env)
        .filter(key => REACT_APP.test(key))
        .reduce(
            (env, key) => {
                env[key] = process.env[key];
                return env;
            },
            {
                NODE_ENV: process.env.NODE_ENV || 'production', // webpack在production模式下会自动启用一些配置
                APP_ENV: env,
                PUBLIC_URL: publicUrl
            }
        );

    const stringified = {};
    Object.keys(raw).forEach((key, index) => {
        stringified['process.env.' + key] = JSON.stringify(raw[key]);
    });

    return { raw, stringified };
}

module.exports = getClientEnvironment;
```

修改`webpack`配置，向`react`应用和index.html注入环境变量

```
// webpack.base.js
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const getClientEnvironment = require('./env');

const env = getClientEnvironment(config.publicPath);

plugins: [
    new HtmlWebpackPlugin(),
    // 注意：注入插件一定要在HtmlWebpackPlugin之后使用
    // 在html模板中能够使用环境变量
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    new InterpolateHtmlPlugin(env.raw),
    // 在js代码中能够使用环境变量(demo: process.env.REACT_APP_ENV === 'dev')
    new webpack.DefinePlugin(env.stringified),
]
```

配置都做好了，修改打包命令，加上env参数：

```json
{
    "scripts": {
        "dev": "cross-env NODE_ENV=development webpack-dev-server --config ./config/webpack.dev.js --env=dev",
        "build:prod": "cross-env NODE_ENV=production node config/build.js --env=prod --report",
        "build:t1": "cross-env NODE_ENV=production node config/build.js --env=t1 --report",
        "build:dev": "cross-env NODE_ENV=production node config/build.js --env=dev --report"
    }
}
```

把同样的配置，分别配置到`webpack.prod.js和webpack.dev.js`中，然后运行对应打包命令，就可以看到项目中成功注入了环境变量。例如，想要使用`.env.dev`中的变量，则打包命令中增加参数`--env=dev`即可，配置将由.`env.dev.local，.env.dev，.env.local，.env`合并覆盖生成。

> `webpack`根据`NODE_ENV`的值来自动选择`production`或`development`模式编译，因此，如果没有必须要求，尽量不要以`NODE_ENV`的值做为打包环境依据，否则就要自行处理更复杂的`webpack`配置。


## preload，prefetch

`preload`和`prefetch`是一组能够预读资源，优化用户体验的工具，这里给出一个在首页预读字体和图片的例子，来演示它们结合webpack的使用方法，详见[文档](https://github.com/GoogleChromeLabs/preload-webpack-plugin)。

安装依赖：

```
$ npm i -D preload-webpack-plugin
```

修改`webpack.prod.js`：

```js
// webpack.prod.js：
const PreloadWebpackPlugin = require('preload-webpack-plugin')

plugins: [
    new PreloadWebpackPlugin({
        rel: 'preload',
        as(entry) {
            if (/\.css$/.test(entry)) return 'style';
            if (/\.woff$/.test(entry)) return 'font';
            if (/\.png$/.test(entry)) return 'image';
            return 'script';
        },
        include: ['app']
        // include:'allChunks'
    }),
]
```

## 配置按需加载

配置按需加载，可以将每个页面或组件拆成独立的包，减小首页加载内容的体积，是很好的优化策略。

安装依赖：

```
npm i -D @babel/plugin-syntax-dynamic-import
```

修改webpack.base.js

```
rules: {
    test: /\.(j|t)sx?$/,
    include: APP_PATH,
    use: [
        {
            loader: 'babel-loader',
            options: {
                plugins: [
                    '@babel/plugin-syntax-dynamic-import', // 这是新加入的项
                    ['@babel/plugin-proposal-class-properties', { 'loose': true }]
                ],
                cacheDirectory: true
            }
        }
    ]
}
```

配置完后，就可以用import的方式载入组件了：

```js
const HelloWorldPage = import('@/pages/demo');
```


## eslint

首先安装依赖：

```
$ npm i -D eslint babel-eslint eslint-loader eslint-plugin-jsx-control-statements
$ npm i -D eslint-plugin-react @typescript-eslint/parser @typescript-eslint/eslint-plugin 
```

然后在根目录新建`eslint`配置文件`.eslintrc.js`。

检查或不检查某些特定的文件，可以在根目录新建`.eslintignore`，以下配置不检查src目录以外的js文件：

```
// webpack.base.js
module: {
    rules: [
        // 把这个配置放在所有loader之前
        {
            enforce: 'pre',
            test: /\.tsx?$/,
            exclude: /node_modules/,
            include: [APP_PATH],
            loader: 'eslint-loader',
            options: {
                emitWarning: true, // 这个配置需要打开，才能在控制台输出warning信息
                emitError: true, // 这个配置需要打开，才能在控制台输出error信息
                fix: true // 是否自动修复，如果是，每次保存时会自动修复可以修复的部分
            }
        }
    ]
}
```



## prettier 自动格式化代码

提交代码时自动格式化代码，只处理当前提交的代码，通过[prettier](https://github.com/prettier/prettier)和[lint-staged](https://github.com/okonet/lint-staged)可以完成。

先安装工具：

```
$ npm i -D prettier eslint-plugin-prettier eslint-config-prettier
$ npm i -D lint-staged
```

在根目录增加`prettier`配置`.prettierrc.js`，同样的也可以增加忽略配置`.prettierignore`（建议配置为与lint忽略规则一致）：

```js
// 这个配置需要与eslint一致，否则在启用 eslint auto fix 的情况下会造成冲突
module.exports = {
    "printWidth": 120, //一行的字符数，如果超过会进行换行，默认为80
    "tabWidth": 2,
    "useTabs": false, // 注意：makefile文件必须使用tab，视具体情况忽略
    "singleQuote": true,
    "semi": true,
    "trailingComma": "none", //是否使用尾逗号，有三个可选值"<none|es5|all>"
    "bracketSpacing": true, //对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
};
```

修改eslint配置`.eslintrc.js`：

```js
module.exports = {
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:jsx-control-statements/recommended", // 需要另外配合babel插件使用
        "prettier" // 注意顺序
    ],
    "plugins": ["@typescript-eslint", "react", "jsx-control-statements", "prettier"], // 注意顺序
    "rules": {
        "prettier/prettier": 2, // 这样prettier的提示能够以错误的形式在控制台输出
    }
};
```

修改`package.json`：

```json
{
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged"
        }
    },
    "lint-staged": {
        "src/**/*.{jsx,js,tsx,ts}": [
            "prettier --write",
            "eslint --fix",
            "git add"
        ]
    }
}
```


## 用editorconfig统一编辑器规范

有些编辑器能够根据配置提示会自动格式化代码，我们可以为各种编辑器提供一个统一的配置。

在根目录新建`.editorconfig`即可，注意不要与已有的lint规则冲突：

```js
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```



## 美化webpack输出信息

webpack在开发时的输出信息有一大堆，可能会干扰我们查看信息，以下提供一个美化、精简输出信息的建议。

精简以下开发服务器输出信息，修改`webpack.dev.js`：

```js
// ...webpack configs
stats: {
    colors: true,
    children: false,
    chunks: false,
    chunkModules: false,
    modules: false,
    builtAt: false,
    entrypoints: false,
    assets: false,
    version: false
}
```

美化一下打包输出，安装依赖：

```
$ npm i -D ora chalk
```

修改`config/build.js`：



```javascript
const ora = require('ora');
const chalk = require('chalk'); // 如果要改变输出信息的颜色，使用这个，本例没有用到
const webpack = require('webpack');
const webpackConfig = require('./webpack.prod');

const spinner = ora('webpack编译开始...\n').start();

webpack(webpackConfig, function (err, stats) {
    if (err) {
        spinner.fail('编译失败');
        console.log(err);
        return;
    }
    spinner.succeed('编译结束!\n');

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n');
});
```



## 路由的配置

本段提供一个`react-router`的实践。

安装依赖：

```
$ npm i react-router-dom react-router-config @types/react-router-dom @types/react-router-config
$ npm i @loadable/component
```

新建`src/router.ts`：

```ts
import loadable from '@loadable/component'; // 按需加载

export const basename = ''; // 如果访问路径有二级目录，则需要配置这个值，如首页地址为'http://xxx.com/en/home'，则这里配置为'/en'

export const routes = [
    {
        path: '/',
        exact: true,
        component: loadable(() => import('@/pages/demo/HelloWorldDemo/HelloWorldDemoPage')), // 组件需要你自己准备
        name: 'home', // 自定义属性
        title: 'react-home' // 自定义属性
        // 这里可以扩展一些自定义的属性
    },
    {
        path: '/home',
        exact: true,
        component: loadable(() => import('@/pages/demo/HelloWorldDemo/HelloWorldDemoPage')),
        name: 'home',
        title: 'HelloWorld'
    },
    // 404 Not Found
    {
        path: '*',
        exact: true,
        component: loadable(() => import('@/pages/demo/404Page/404Page')),
        name: '404',
        title: '404'
    }
];
```

改造index.tsx，启用路由：

```ts
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { routes, basename } from './router';
import '@/App.less';

const App: React.FC = () => {
    return <BrowserRouter basename={basename}>{renderRoutes(routes)}</BrowserRouter>;
};

export default App;
```


还可以利用路由为每个页面设置标题。

先写一个hook：

```ts
import { useEffect } from 'react';

export function useDocTitle(title: string) {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = title;
        return () => {
        document.title = originalTitle;
        };
    });
}
```

把hook应用在需要修改标题的组件中即可：

```ts
import React from 'react';
import { useDocTitle } from '@/utils/hooks/useDocTitle';

import Logo from './react-logo.svg';
import './HelloWorldDemoPage.less';

const HelloWorldDemoPage: React.FC<Routes> = (routes) => {
    const { route } = routes; // 获取传入的路由配置
    useDocTitle(route.title); // 修改标题
    return <div className="App">hello, world</div>;
};

export default HelloWorldDemoPage;
```



## 优化 webpack 构建速度

使用 `DllPlugin`和`DllReferencePlugin`，将静态库(如`react`、'antd`、....)先提取出来，因为这些库不常变动，如果每次都
打包会浪费构建时间。

- `DllPlugin`可以把我们需要打包的第三方库打包成一个 js 文件和一个 json 文件，这个 json 文件中会映射每个打包的模块地址和 id；
- `DllReferencePlugin` 通过读取这个json文件来使用打包的这些模块。

##### 配置文件

新建`webpack.dll.config.js`，将dll.js文件压缩到`index.html`同一个目录，

```js
// webpack.dll.config.js
const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        vendor: ['react', "react-dom", "react-router-dom", "antd"]
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
```

在`webpack.config.js`中添加`json`

```js
module.exports = {
    plugins: [
        new webpack.DllReferencePlugin({
            manifest: require('../public/vendor.json')
        })
    ]
}
```


## 项目讲解

- [路由鉴权](doc/auth.md)
- [主题替换](doc/theme.md)
