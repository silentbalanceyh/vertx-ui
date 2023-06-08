'use strict';

const fs = require('fs');
const path = require('path');
const paths = require('./paths');
const chalk = require('react-dev-utils/chalk');
const resolve = require('resolve');

/**
 * Get additional module paths based on the baseUrl of a compilerOptions object.
 *
 * @param {Object} options
 */
function getAdditionalModulePaths(options = {}) {
    const baseUrl = options.baseUrl;

    if (!baseUrl) {
        return '';
    }

    const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

    // We don't need to do anything if `baseUrl` is set to `node_modules`. This is
    // the default behavior.
    if (path.relative(paths.appNodeModules, baseUrlResolved) === '') {
        return null;
    }

    // Allow the user set the `baseUrl` to `appSrc`.
    if (path.relative(paths.appSrc, baseUrlResolved) === '') {
        return [paths.appSrc];
    }

    // If the path is equal to the root directory we ignore it here.
    // We don't want to allow importing from the root directly as source files are
    // not transpiled outside of `src`. We do allow importing them with the
    // absolute path (e.g. `src/Components/Button.js`) but we set that up with
    // an alias.
    if (path.relative(paths.appPath, baseUrlResolved) === '') {
        return null;
    }

    // Otherwise, throw an error.
    throw new Error(
        chalk.red.bold(
            "Your project's `baseUrl` can only be set to `src` or `node_modules`." +
            ' Create React App does not support other values at this time.'
        )
    );
}

/**
 * Get webpack aliases based on the baseUrl of a compilerOptions object.
 *
 * @param {*} options
 */
function getWebpackAliases(options = {}) {
    const baseUrl = options.baseUrl;

    if (!baseUrl) {
        return {};
    }

    const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

    if (path.relative(paths.appPath, baseUrlResolved) === '') {
        return {
            src: paths.appSrc,

            app: path.resolve(__dirname, "../src", "app"),                      // Application                          「App」第三方应用专用包，每个应用程序该包信息不同
            // Zero Testing/Plugin Structure
            mock: path.resolve(__dirname, "../src", "app@mock"),                // Mock                                 「App」模拟环境包
            /*
             * 由于 app@plugin 将会被 Extension Library 调用，所以不可以在 app@plugin 中使用
             * import Ex from 'ex';
             * 即 app@plugin 不可以调用任何和 Extension Library 相关的库内容，否则会引起循环引
             * 用问题。
             */
            plugin: path.resolve(__dirname, "../src", "app@plugin"),            // Plugin                               「App」插件目录
            /*
             * app包中基本规范，必须包含的文件
             * app/in.entry.js                     包主入口
             * app/action/Epic.js               redux-observable专用
             * app/action/Types.js              redux-observable专用
             * app/action/Ajax.js               redux-observable专用
             * style/modulat/index.less         特殊风格入口
             * function/in.entry.js                功能函数主入口
             */

            lang: path.resolve(__dirname, "../src", "cab"),                     // Language                             资源包，绑定环境变量 Z_LANGUAGE

            // 「对外开放」-----------------------------------------------------------------------------------------------
            // Zero Framework Core Library
            web: path.resolve(__dirname, "../src", "economy"),                  // Economy                              「UCA」标准组件包
            entity: path.resolve(__dirname, "../src", "entity@em"),             // Entity                               标准模型包
            environment: path.resolve(__dirname, "../src", "environment"),      // Environment                          标准环境包

            // Zero Framework Extension Library
            oi: path.resolve(__dirname, "../src", "extension/eclat"),           // Origin X Interface                   「UCA」配置组件
            ei: path.resolve(__dirname, "../src", "extension/ecosystem"),       // Extension Interface                  「UCA」扩展组件
            ex: path.resolve(__dirname, "../src", "extension/library"),         // Extension X                          「Tool」扩展库

            // Zero Development Tools
            ui: path.resolve(__dirname, "../src", "ui"),                        // User Interface                       快速开发工具箱
            ux: path.resolve(__dirname, "../src", "ux"),                        // Uniform X:                           「Tool」标准库


            // 「框架内部调用」--------------------------------------------------------------------------------------------
            /* 新架构说明：基本规范
             * 1. 双下划线（__）表示私有，模块内或全局私有。
             *    -- 模块内开发私有函数使用（__）前缀
             *    -- 模块内开发私有类则使用（_）前缀
             * 2. 核心标记
             *    -- fn，当前文件全部是函数
             *    -- v， 常量文件（纯定义）
             *    -- o， 高阶方法，通常是类似 fn / rx / me 等高阶处理专用方法
             *    -- c， 类定义，使用 class 关键字
             * 3. 除基础层zone以外，其他层紧跟核心标记的为函数前缀，解读规则：
             *    3.1. 基础层（zone）
             *    -- fn.assort.value.datetime.js
             *       -- fn：函数
             *       -- assort                  模块级语义专用单词（单词含义：协调、分类）
             *       -- value：该文件中函数前缀，如上述内部定义的所有函数为：
                        valueDatetime,
                        valueJDatetime,
                        valueDuration,
                        valueStartTime,
                        valueEndTime,
                        valueNow,
                     -- datetime：               功能级语义专用单词（时间处理功能函数）
             *    3.2. 组件层（zero / zion / zodiac）
             *    --- lighting.fn.ajax.callback.js
             *       -- lighting                组件级语义专用单词（单词含义：光）
             *       -- fn：函数
             *       -- ajax：该文件中函数前缀，上述文件定义所有函数为：
                        ajaxError,
                        ajaxDialog,
                        ajaxMessage,
                        ajax2Dialog,
                        ajax2Message,
                        ajax2True,
                     -- callback：               功能级语义专用单词（Ajax远程通讯后回调模块）
                  3.3. 带有 UNLOCK 的文件为解除依赖专用文件名
             * 4. 目录单词                  包名
             *    zero（零）               zero         Zero Framework ( @zero 注解所在 ）
             *    zest（热情）              zs           Zero Environment Subsystem Toolkit
             *    zion（天国、乌托邦）        zi          Zero Interact-Oriented Native ( @uca 注解所在 ）
             *    zither（拉练、筝）         zmr         「TypeScript」Zero Qr Model（查询模型层）
             *    zodiac（黄道带，十二宫图）   zo          Zero Origin（起源组件层，下层组件第一层，再往下就是功能函数区域）
             *    zoe（佐伊，女主角）         zme         「TypeScript」Zero Environment Model（环境模型层）
             *    zone（区域）              zone         Zero Zone（环境区域功能底座）
             */
            // *禁止开发人员直接导入这些包内信息，上层开发只需使用
            // import Ux from 'ux';             import {xx} from 'web';
            // import Ex from 'ex';             import {ExXx} from 'ei;         import {OxXx} from 'oi';
            // ---------------------------------------------------------------------------------------------------------
            // Zero Research Extension Toolkit
            zei: path.resolve(__dirname, "../src", "unfold"),                   // Zero Extension Interface             扩展呈现层
            zep: path.resolve(__dirname, "../src", "upper"),                    // Zero Extension Processor             扩展处理层
            zet: path.resolve(__dirname, "../src", "utter"),                    // Zero Extension Toolkit               扩展底层
                                                                                // * plugin
                                                                                // * ux
            // import Ux from 'ux';
            // import {xx} from 'web';
            // Zero Research Core Toolkit
            // -- 子系统层
            zero: path.resolve(__dirname, "../src", "zero"),                    // Zero ( Aeon Interface )              对接层（复杂组件）
                                                                                // * entity

            zs: path.resolve(__dirname, "../src", "zest@web"),                  // Zero Subsystem                       子系统层
                                                                                // * economy ( variant )

            zi: path.resolve(__dirname, "../src", "zion"),                      // Zero Interface                       交互式组件
                                                                                // * environment
            // -- 核心组件层
            zmr: path.resolve(__dirname, "../src", "zither@em"),                // Zero Model Qr Engine                 「Model」查询模型
            zo: path.resolve(__dirname, "../src", "zodiac"),                    // Zero Origin Component                起源组件

            // -- 功能组件层
            zme: path.resolve(__dirname, "../src", "zoe@em"),                   // （全局）Zero Model -> Environment      「Model」环境模型层
            zone: path.resolve(__dirname, "../src", "zone"),                    // （全局）Zero Zone                      环境区域层（全局）

            skin: path.resolve(__dirname, "../src", "skin"),                    // 皮肤管理器（位于最底层，因为zone中有控件产生）
            style: path.resolve(__dirname, "../src", "style"),                  // 风格（SCSS导入用）
            // Mock 专用
            // ----------------------------
            stompjs: "stompjs/lib/stomp.js"
        };
    }
}

/**
 * Get jest aliases based on the baseUrl of a compilerOptions object.
 *
 * @param {*} options
 */
function getJestAliases(options = {}) {
    const baseUrl = options.baseUrl;

    if (!baseUrl) {
        return {};
    }

    const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

    if (path.relative(paths.appPath, baseUrlResolved) === '') {
        return {
            '^src/(.*)$': '<rootDir>/src/$1',
        };
    }
}

function getModules() {
    // Check if TypeScript is setup
    const hasTsConfig = fs.existsSync(paths.appTsConfig);
    const hasJsConfig = fs.existsSync(paths.appJsConfig);

    if (hasTsConfig && hasJsConfig) {
        throw new Error(
            'You have both a tsconfig.json and a jsconfig.json. If you are using TypeScript please remove your jsconfig.json file.'
        );
    }

    let config;

    // If there's a tsconfig.json we assume it's a
    // TypeScript project and set up the config
    // based on tsconfig.json
    if (hasTsConfig) {
        const ts = require(resolve.sync('typescript', {
            basedir: paths.appNodeModules,
        }));
        config = ts.readConfigFile(paths.appTsConfig, ts.sys.readFile).config;
        // Otherwise we'll check if there is jsconfig.json
        // for non TS projects.
    } else if (hasJsConfig) {
        config = require(paths.appJsConfig);
    }

    config = config || {};
    const options = config.compilerOptions || {};

    const additionalModulePaths = getAdditionalModulePaths(options);

    return {
        additionalModulePaths: additionalModulePaths,
        webpackAliases: getWebpackAliases(options),
        jestAliases: getJestAliases(options),
        hasTsConfig,
    };
}

module.exports = getModules();
