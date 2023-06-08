const fs = require('fs');
const path = require('path');
const paths = require('./paths');
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

// Check if Tailwind config exists
const useTailwind = fs.existsSync(
    path.join(paths.appPath, 'tailwind.config.js')
);
// ---------------------------------

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (webpackEnv, cssOptions, preProcessor) => {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';
    const loaders = [
        isEnvDevelopment ? {
            loader: require.resolve("thread-loader"),
            options: {
                // 产生的 worker 的数量，默认是 (cpu 核心数 - 1)，或者，
                // 在 require('os').cpus() 是 undefined 时回退至 1
                // 一个 worker 进程中并行执行工作的数量
                // 默认为 20
                workerParallelJobs: 64,

                // 额外的 node.js 参数
                workerNodeArgs: ['--max-old-space-size=1024'],
                // 允许重新生成一个僵死的 work 池
                // 这个过程会降低整体编译速度
                // 并且开发环境应该设置为 false
                poolRespawn: false,

                // 闲置时定时删除 worker 进程
                // 默认为 500（ms）
                // 可以设置为无穷大，这样在监视模式(--watch)下可以保持 worker 持续存在
                poolTimeout: 2000,

                // 池分配给 worker 的工作数量
                // 默认为 200
                // 降低这个数值会降低总体的效率，但是会提升工作分布更均一
                poolParallelJobs: 64,

                // 池的名称
                // 可以修改名称来创建其余选项都一样的池
                name: "zjs-style-worker"
            }
        } : false,
        isEnvDevelopment && require.resolve('style-loader'),
        isEnvProduction && {
            loader: MiniCssExtractPlugin.loader,
            // css is located in `static/css`, use '../../' to locate index.html folder
            // in production `paths.publicUrlOrPath` can be a relative path
            options: paths.publicUrlOrPath.startsWith('.')
                ? {publicPath: '../../'}
                : {},
        },
        {
            loader: require.resolve('css-loader'),
            options: {
                ...cssOptions,
                // importLoaders: 0
            },
        },
        {
            // Options for PostCSS as we reference these options twice
            // Adds vendor prefixing based on your specified browser support in
            // package.json
            loader: require.resolve('postcss-loader'),
            options: {
                postcssOptions: {
                    // Necessary for external CSS imports to work
                    // https://github.com/facebook/create-react-app/issues/2677
                    ident: 'postcss',
                    config: false,
                    plugins: !useTailwind
                        ? [
                            'postcss-flexbugs-fixes',
                            [
                                'postcss-preset-env',
                                {
                                    autoprefixer: {
                                        flexbox: 'no-2009',
                                    },
                                    stage: 3,
                                },
                            ],
                            // Adds PostCSS Normalize as the reset css with default options,
                            // so that it honors browserslist config in package.json
                            // which in turn let's users customize the target behavior as per their needs.
                            'postcss-normalize',
                        ]
                        : [
                            'tailwindcss',
                            'postcss-flexbugs-fixes',
                            [
                                'postcss-preset-env',
                                {
                                    autoprefixer: {
                                        flexbox: 'no-2009',
                                    },
                                    stage: 3,
                                },
                            ],
                        ],
                },
                sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            },
        },
    ].filter(Boolean);
    if (preProcessor) {
        // -------------------------------
        const preOptions = {
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment
        }
        if ("sass-loader" === preProcessor) {
            /*
             *  Link: https://webpack.docschina.org/loaders/sass-loader/
             *  - implementation: sass ( Dart Sass )
             *  - sassOptions
             *  - sourceMap: compiler.devtool
             *  - additionalData
             *  - webpackImporter: true
             *  - warnRuleAsWarning: false
             */
            preOptions.sassOptions = {
                ...cssOptions
            };
            /*
             * $uni_font    - 默认字体大小
             * $uni_color   - 默认关键色
             * $uni_radius  - 默认圆角尺寸（2 / 4 / 6 / 8）
             * $uni_shadow  - 默认是否开启阴影（true / false）
             */
            preOptions.additionalData = `
                    $uni_font: ${process.env.Z_CSS_FONT}px;
                    $uni_color: ${process.env.Z_CSS_COLOR};
                    $uni_radius: ${process.env.Z_CSS_RADIUS}px;
                    $uni_shadow: ${process.env.Z_CSS_SHADOW};
                `
        }
        // -------------------------------
        loaders.push(
            {
                loader: require.resolve('resolve-url-loader'),
                options: {
                    sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
                    root: paths.appSrc,
                },
            },
            {
                loader: require.resolve(preProcessor),
                options: preOptions,
            }
        );
    }
    return loaders;
};