import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {BrowserRouter} from "react-router-dom";
// 统一引入AntDesign样式
import 'ant-design-pro/dist/ant-design-pro.css';

import routes from "./environment/routes";

import createStore from "./environment/store";

const store = createStore();
/**
 * @typedef JObject 从Json文件中读取的JsonObject
 * @typedef EmptyActionCreator redux-act 的返回值
 * @typedef ReactComponent React组件引用，通常是 reference
 * @typedef WebColor 值为 #XXXXXX 的Web颜色值（字符串格式）
 * @typedef Ux 全局工具类，核心调用入口
 */
/**
 * @overview
 *
 * # Zero UI框架文档
 *
 * > 标准`node`环境可运行在` > 8.x `中，目前系统环境运行在`14.16.0`，由于`15.x`中有很多问题，所以标准环境中不推荐升级到 `15.x`。
 *
 * 从2018年框架诞生开始，整个框架经历了很多改动，整个框架分为以下几部分：
 *
 * ## 0. 框架结构
 *
 * ### 0.1. 标准 / 扩展
 *
 * * `ux`：框架核心库，全称为`Utility X`，封装了所有第三方库，使用函数前缀，主要包含如下：
 *      * 类类型：「Class」以类为单位定义核心全局类型。
 *      * 函数型：「Function」以模块为单位定义的函数前缀类型。
 *      * 常量型：「Value」以常量为主的全局类型。
 *      * 注解型：「Annotation」以 `ES7` 为主的装饰专用类型。
 * * `web`：标准组件类型，不带业务逻辑的核心组件类型，直接使用`import { xxx } from 'web';`的方式导入组件。
 * * `ex`：扩展业务框架类，全称为`Extension X`，封装了所有底层库，可直接调用`Ux`库函数，带一定的业务内容。
 *      * 类类型：「ExClass」（略）
 *      * 函数型：「ExFunction」（略）
 *      * 常量型：「ExValue」（略）
 *      * 注解型：「ExAnnotation」（略）
 * * `ei`：扩展组件类型，带业务逻辑的核心组件类型，封装程度更高。
 *
 * ### 0.2. 起源 / 开发
 *
 * * `oi`：Origin X 专用组件类型，以配置数据为核心的组件类型。
 * * `mock`：纯前端专用模拟数据类型，存储在`ux/mock`文件中。
 * * `plugin`：插件类型，存储在`plugin`目录中，不同应用有所区别。
 * * `app`：应用专用类型（每个应用主代码），存储在`app`目录中。
 * * `environment`：环境信息。
 * * `entity`：专用数据结构（TypeScript定义）。
 *
 * ### 0.3. 文档站点
 *
 * * 主文档：
 *      * 本地地址：<http://localhost:1017>
 *      * 外网地址：<http://www.vertxui.cn/document/doc-web/index.html>
 * * 扩展文档：
 *      * 本地地址：<http://localhost:1231>
 *      * 外网地址：<http://www.vertxui.cn/document/doc-web-extension/index.html>
 *
 * **您可点击左边的完整菜单直接导航到外网地址中，本地地址则不可如此用法。**
 *
 * ```js
 *
 * // ------------- 标准组件工具的引入
 * // Zero UI 工具包使用方式
 * import Ux from 'ux';
 *
 * // Zero UI Component 标准组件使用，如：GraphicEditor
 * import {GraphicEditor} from 'web';
 *
 * ```
 *
 * 所有的工具都直接走`Ux.xxx`的方式执行调用，上层调用中，不用考虑类相关信息，除开类类型的特殊调用如：`Ux.Ant.xxx`以外，剩余部分都是直接调用，开发人员则可以根据函数前缀来判断API的用法，在文档中也会针对不同的API执行函数说明。
 *
 * ## 1. 文档配置环境
 *
 * ```shell
 * # 新版使用 yarn 替代了 npm，所以安装可使用新方式
 * yarn add docdash --dev
 * # 旧：npm install docdash
 *
 * # 如果缺乏 jsdoc，则直接运行
 * yarn add jsdoc --dev
 * # 旧：npm install jsdoc
 * ```
 *
 * 由于项目中本身不存在上述的 dependency 的第三方依赖包，您可以直接安装，也可以加上`-g`参数安装在全局环境中，安装完成后，直接执行根目录下的 `run-doc.sh` 脚本生成相关文档。
 *
 * ## 2. 文档服务器
 *
 * 如果您要使用文档服务器，先在机器上安装`live-server`（建议使用全局模式）：
 *
 * ```shell
 * yarn global add live-server
 * # 旧：npm install live-server -g
 * ```
 *
 * ## 3. 运行服务器
 *
 * 安装完成后，直接执行根目录下的 `/run-doc.sh` 脚本则可执行文档服务器。
 *
 * |命令执行|参数名|含义|
 * |---:|:---|:---|
 * |`./run-doc.sh doc`|doc|使用文档API生成文档，文档存储于document目录中，doc-web为标准文档，doc-web-extension为扩展文档。|
 * |`./run-doc.sh zero`|zero|运行标准文档，Ux。|
 * |`./run-doc.sh extension`|extension|运行扩展文档，Ex。|
 *
 * ```shell
 * // 生成 Zero UI/Extension 文档
 * ./run-doc.sh doc
 *
 * // 运行 Zero UI 文档
 * ./run-doc.sh zero
 * ```
 *
 * ## 4. 基本规则
 *
 * ### 4.1. 基本使用
 *
 * 1. Zero Ui模块中的函数全部使用 `Ux.xxx` 的方式调用。
 * 2. Zero Ui Extension模块中的函数全部使用 `Ex.xxx` 的方式调用。
 *
 * ### 4.2. 关于标记
 *
 * 如果有特殊函数，整个文档会使用加粗的方式标记该函数，主要标记如下：
 *
 * *「标准」JavaScript标准封装函数（脱离Zero Ui可使用）。
 * *「引擎」Zero Ui中的核心层函数，提高开发效率专用。
 * *「类」Zero Ui中定义的核心类函数。
 * *「私有」内部函数，不对外提供API，不可使用`Ux.xxx`方式调用。
 *
 * ### 4.3. 基本标记规则
 *
 * * 方法定义之前有 `(inner)` 修饰标记，这种类型的方法都可以直接通过 `Ux.xxx` 的方式调用。
 * * 方法定义中的参数 `(arguments)` 为可变长度参数，引用`arguments`默认JS参数处理，且定义方式使用`ES5`中的`function(){}`方式。
 * * 如果方法返回值中返回`{Promise.<T>}` 则表示该方法支持**同步**和**异步**两种，且返回值为Promise，如果是异步函数则会带上`async`标记。
 * * 方法定义之前有 `(static)` 修饰标记，则属于类中静态方法，可直接调用。
 *
 * ### 4.4. 章节说明
 *
 * 整个代码说明区域主要包含几个章节
 *
 * * 标准函数：在整个 JavaScript 的运行时可用。
 * * 引擎函数：位于`engine`专用库中的函数入口，特定引擎函数，带有引擎逻辑，注`unity`中还包含引擎函数。
 *
 * 所有代码中都存在的部分
 *
 * * 参数函数：在调用的API中有特殊的`Function`类型的函数参数说明。
 * * 技巧：演示新旧函数调用的核心技巧，带上【巧】备注。
 *
 * ## 5. 总结
 *
 * 如果您有什么疑问，请联系：[silentbalanceyh@126.com](mailto:silentbalanceyh@126.com)，整体框架相关链接参考左侧菜单。
 * @author 戒子猪
 */
ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <Provider store={store}>
            <BrowserRouter>
                {routes}
            </BrowserRouter>
        </Provider>
    </ConfigProvider>, document.getElementById("root"));
